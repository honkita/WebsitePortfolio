import { JsonValue } from "@prisma/client/runtime/library";

/**
 * Artist Interface
 */
export interface Artist {
  id: number;
  name: string;
  aliases: string | string[];
  playcount: number | 0;
  image: string | "";
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

export interface cleanedAlbums {
  playcount: number;
  image: string;
}

export interface artistAlbumContainer {
  id: number | -1;
  playcount: number;
  ignoreChinese: boolean;
  albums: Record<string, cleanedAlbums>;
}

export interface artistAlbumTopAlbum {
  id: number | -1;
  name: string;
  playcount: number;
  ignoreChinese: boolean;
  topAlbumImage: string;
}
