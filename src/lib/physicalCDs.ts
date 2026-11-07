import { supabase } from "@/lib/supabase/client";

import type {
  CDAlbum,
  CDArtist,
  CDSong,
  CDTrack,
  CDVersion,
} from "@/types/physicalCDs";

// Database row types

interface ArtistRow {
  id: string;
  name: string;
}

interface AlbumRow {
  id: string;
  name: string;
  musicbrainz_release_id: string | null;
  release_date: Date;
}

interface AlbumArtistRow {
  album_id: string;
  artist_id: string;
}

interface SongRow {
  id: string;
  name: string;
  duration_seconds: number | null;
  language: string | null;
}

interface SongArtistRow {
  song_id: string;
  artist_id: string;
}

interface VersionRow {
  id: string;
  album_id: string;
  name: string;
  bin_id: string;
  sort_order: number;
  colour: string;
}

interface BinTrackRow {
  id: string;
  bin_id: string;
  song_id: string;
  track_number: number;
  disc_number: number;
}

interface ArtistRelationshipRow {
  parent_artist_id: string;
  child_artist_id: string;
}

// Artwork

function getArtworkUrl(musicbrainzReleaseId: string | null): string | null {
  if (!musicbrainzReleaseId) {
    return null;
  }

  return `https://coverartarchive.org/release/${musicbrainzReleaseId}/front-500`;
}

// Artist hierarchy

function buildArtistGroups(
  relationships: ArtistRelationshipRow[],
): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();

  // Build an undirected relationship graph.
  for (const relationship of relationships) {
    const { parent_artist_id, child_artist_id } = relationship;

    if (!adjacency.has(parent_artist_id)) {
      adjacency.set(parent_artist_id, new Set());
    }

    if (!adjacency.has(child_artist_id)) {
      adjacency.set(child_artist_id, new Set());
    }

    adjacency.get(parent_artist_id)!.add(child_artist_id);
    adjacency.get(child_artist_id)!.add(parent_artist_id);
  }

  const groups = new Map<string, Set<string>>();
  const visited = new Set<string>();

  // Find all connected artists.
  for (const artistId of adjacency.keys()) {
    if (visited.has(artistId)) {
      continue;
    }

    const group = new Set<string>();
    const queue = [artistId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      if (visited.has(currentId)) {
        continue;
      }

      visited.add(currentId);
      group.add(currentId);

      for (const relatedId of adjacency.get(currentId) ?? []) {
        if (!visited.has(relatedId)) {
          queue.push(relatedId);
        }
      }
    }

    // Every artist in this group points to the same set.
    for (const id of group) {
      groups.set(id, group);
    }
  }

  return groups;
}

// Get all searchable artist names for an album.

function getSearchArtistNames(
  albumArtists: CDArtist[],
  artistGroups: Map<string, Set<string>>,
  artistMap: Map<string, CDArtist>,
): string[] {
  const names = new Set<string>();

  for (const artist of albumArtists) {
    // Always include the actual album artist.
    names.add(artist.name);

    // Include all related artists.
    const group = artistGroups.get(artist.id);

    if (!group) {
      continue;
    }

    for (const relatedArtistId of group) {
      const relatedArtist = artistMap.get(relatedArtistId);

      if (relatedArtist) {
        names.add(relatedArtist.name);
      }
    }
  }

  return [...names];
}

// Main catalogue retrieval

export async function getPhysicalCDs(): Promise<CDAlbum[]> {
  const [
    albumsResult,
    artistsResult,
    albumArtistsResult,
    songsResult,
    songArtistsResult,
    versionsResult,
    binTracksResult,
    artistRelationshipsResult,
  ] = await Promise.all([
    supabase
      .from("albums")
      .select("id, name, musicbrainz_release_id, release_date")
      .order("name"),

    supabase.from("artists").select("id, name"),

    supabase.from("album_artists").select("album_id, artist_id"),

    supabase.from("songs").select("id, name, duration_seconds, language"),

    supabase.from("song_artists").select("song_id, artist_id"),

    supabase
      .from("versions")
      .select("id, album_id, name, colour, bin_id, sort_order")
      .order("sort_order"),

    supabase
      .from("bin_tracks")
      .select("id, bin_id, song_id, track_number, disc_number")
      .order("disc_number")
      .order("track_number"),

    supabase
      .from("artist_relationships")
      .select("parent_artist_id, child_artist_id"),
  ]);

  // Error handling

  const results = [
    albumsResult,
    artistsResult,
    albumArtistsResult,
    songsResult,
    songArtistsResult,
    versionsResult,
    binTracksResult,
    artistRelationshipsResult,
  ];

  for (const result of results) {
    if (result.error) {
      console.error("Supabase catalogue error:", result.error);
      throw new Error(result.error.message);
    }
  }

  // Database data

  const albums = (albumsResult.data ?? []) as AlbumRow[];
  const artists = (artistsResult.data ?? []) as ArtistRow[];
  const albumArtists = (albumArtistsResult.data ?? []) as AlbumArtistRow[];
  const songs = (songsResult.data ?? []) as SongRow[];
  const songArtists = (songArtistsResult.data ?? []) as SongArtistRow[];
  const versions = (versionsResult.data ?? []) as VersionRow[];
  const binTracks = (binTracksResult.data ?? []) as BinTrackRow[];

  const artistRelationships = (artistRelationshipsResult.data ??
    []) as ArtistRelationshipRow[];

  // Artist lookup

  const artistMap = new Map<string, CDArtist>(
    artists.map((artist) => [
      artist.id,
      {
        id: artist.id,
        name: artist.name,
      },
    ]),
  );

  // Build artist hierarchy

  const artistGroups = buildArtistGroups(artistRelationships);

  // Album artist lookup

  const albumArtistMap = new Map<string, CDArtist[]>();

  for (const relation of albumArtists) {
    const artist = artistMap.get(relation.artist_id);

    if (!artist) {
      continue;
    }

    const existing = albumArtistMap.get(relation.album_id) ?? [];
    existing.push(artist);

    albumArtistMap.set(relation.album_id, existing);
  }

  // Song artist lookup

  const songArtistMap = new Map<string, CDArtist[]>();

  for (const relation of songArtists) {
    const artist = artistMap.get(relation.artist_id);

    if (!artist) {
      continue;
    }

    const existing = songArtistMap.get(relation.song_id) ?? [];
    existing.push(artist);

    songArtistMap.set(relation.song_id, existing);
  }

  // Song lookup

  const songMap = new Map<string, CDSong>(
    songs.map((song) => [
      song.id,
      {
        id: song.id,
        name: song.name,
        duration_seconds: song.duration_seconds,
        language: song.language,
        artists: songArtistMap.get(song.id) ?? [],
      },
    ]),
  );

  // Tracklist lookup, keyed by bin ID

  const tracksByBin = new Map<string, CDTrack[]>();

  for (const track of binTracks) {
    const song = songMap.get(track.song_id);

    if (!song) {
      continue;
    }

    const formattedTrack: CDTrack = {
      id: track.id,
      track_number: track.track_number,
      disc_number: track.disc_number,
      song,
    };

    const existing = tracksByBin.get(track.bin_id) ?? [];
    existing.push(formattedTrack);

    tracksByBin.set(track.bin_id, existing);
  }

  // Sort tracks by disc and track number

  for (const tracks of tracksByBin.values()) {
    tracks.sort((a, b) => {
      if (a.disc_number !== b.disc_number) {
        return a.disc_number - b.disc_number;
      }

      return a.track_number - b.track_number;
    });
  }

  // Version lookup, keyed by album ID

  const versionsByAlbum = new Map<string, CDVersion[]>();

  for (const version of versions) {
    const formattedVersion: CDVersion = {
      id: version.id,
      name: version.name,
      colour: version.colour,
      sort_order: version.sort_order,
      tracks: tracksByBin.get(version.bin_id) ?? [],
    };

    const existing = versionsByAlbum.get(version.album_id) ?? [];
    existing.push(formattedVersion);

    versionsByAlbum.set(version.album_id, existing);
  }

  // Sort versions by their configured order

  for (const albumVersions of versionsByAlbum.values()) {
    albumVersions.sort((a, b) => a.sort_order - b.sort_order);
  }

  // Assemble final catalogue

  const result: CDAlbum[] = albums.map((album) => {
    const actualArtists = albumArtistMap.get(album.id) ?? [];

    return {
      id: album.id,
      name: album.name,
      musicbrainz_release_id: album.musicbrainz_release_id,
      image_url: getArtworkUrl(album.musicbrainz_release_id),
      release_date: album.release_date,

      // Original album artist credits.
      artists: actualArtists,

      // Parent and child artists used for searching.
      search_artist_names: getSearchArtistNames(
        actualArtists,
        artistGroups,
        artistMap,
      ),

      versions: versionsByAlbum.get(album.id) ?? [],
    };
  });

  return result;
}
