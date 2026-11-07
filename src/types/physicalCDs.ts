export interface CDArtist {
  id: string;
  name: string;
}

export interface CDSong {
  id: string;
  name: string;
  duration_seconds: number | null;
  language: string | null;
  artists: CDArtist[];
}

export interface CDTrack {
  id: string;
  track_number: number;
  disc_number: number;
  song: CDSong;
}

export interface CDVersion {
  id: string;
  name: string;
  sort_order: number;
  tracks: CDTrack[];
  colour: string;
}

export interface CDAlbum {
  id: string;
  name: string;
  musicbrainz_release_id: string | null;
  image_url: string | null;
  release_date: Date;
  artists: CDArtist[];
  versions: CDVersion[];
  search_artist_names: string[];
}
