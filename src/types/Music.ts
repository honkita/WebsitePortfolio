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
 * Database Artist Interface
 */
export interface DBArtist {
  name: string;
  id: number;
  aliases: JsonValue | null;
  ignoreChineseCanonization?: boolean | null;
}
[];

/**
 * Last.fm Artist Interface
 */
export interface LastFmArtist {
  name: string;
  playcount: string;
  image: LastFmImage[];
}

/**
 * Last.fm Album Interface
 */
export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | string;
}

/**
 * Last.fm Album Interface
 */
export interface LastFmAlbum {
  name: string;
  playcount: string;
  artist: { name: string };
  image: LastFmImage[];
}
