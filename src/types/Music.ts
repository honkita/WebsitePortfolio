/**
 * Merged Artist Interface
 */
interface Artist {
  id: number | -1;
  playcount: number;
  ignoreChinese: boolean;
}

/**
 * Last.fm Artist Interface
 */
export interface LastFmArtist {
  name: string;
  playcount: number;
}

/**
 * Last.fm Album Interface
 */
export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | string;
}

/**
 * Last.fm Album Interface (Direct from the API)
 */
export interface LastFmAlbum {
  name: string;
  playcount: number;
  artist: { name: string };
  image: LastFmImage[];
}

/**
 * Last.fm Album Interface (Cleaned)
 */
export interface LastFmAlbumClean {
  playcount: number;
  image: string;
}

export interface lfmArtistAlbums {
  playcount: number;
  albums: Record<string, LastFmAlbumClean>;
}

/**
 * Cleaned Albums Interface
 */
export interface cleanedAlbums {
  playcount: number;
  image: string;
}

/**
 * Artist Album Container Interface
 */
export interface artistAlbumContainer extends Artist {
  albums: Record<string, cleanedAlbums>;
}

/**
 * Artist Top Album Interface
 */
export interface artistAlbumTopAlbum extends Artist {
  name: string;
  topAlbumImage: string;
}
