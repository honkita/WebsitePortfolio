import { supabase } from "@/lib/supabase/client";

import type {
  CDAlbum,
  CDArtist,
  CDSong,
  CDTrack,
  CDVersion,
} from "@/types/physicalCDs";

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

function getArtworkUrl(musicbrainzReleaseId: string | null): string | null {
  if (!musicbrainzReleaseId) {
    return null;
  }

  return `https://coverartarchive.org/release/${musicbrainzReleaseId}/front-500`;
}

export async function getPhysicalCDs(): Promise<CDAlbum[]> {
  const [
    albumsResult,
    artistsResult,
    albumArtistsResult,
    songsResult,
    songArtistsResult,
    versionsResult,
    binTracksResult,
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
  ]);

  const results = [
    albumsResult,
    artistsResult,
    albumArtistsResult,
    songsResult,
    songArtistsResult,
    versionsResult,
    binTracksResult,
  ];

  for (const result of results) {
    if (result.error) {
      console.error("Supabase catalogue error:", result.error);
      throw new Error(result.error.message);
    }
  }

  const albums = (albumsResult.data ?? []) as AlbumRow[];
  const artists = (artistsResult.data ?? []) as ArtistRow[];
  const albumArtists = (albumArtistsResult.data ?? []) as AlbumArtistRow[];
  const songs = (songsResult.data ?? []) as SongRow[];
  const songArtists = (songArtistsResult.data ?? []) as SongArtistRow[];
  const versions = (versionsResult.data ?? []) as VersionRow[];
  const binTracks = (binTracksResult.data ?? []) as BinTrackRow[];

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
  const result: CDAlbum[] = albums.map((album) => ({
    id: album.id,
    name: album.name,
    musicbrainz_release_id: album.musicbrainz_release_id,
    image_url: getArtworkUrl(album.musicbrainz_release_id),
    release_date: album.release_date,
    artists: albumArtistMap.get(album.id) ?? [],
    versions: versionsByAlbum.get(album.id) ?? [],
  }));

  return result;
}
