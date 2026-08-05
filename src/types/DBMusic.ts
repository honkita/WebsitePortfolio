import type { Artist } from "@prisma/client";

/**
 * Database Albums Interface
 */
export interface DBAlbums {
  [key: number]: string;
}

/**
 * Database Artist Interface
 */
export interface DBArtist {
  [key: string]: Artist;
}

/**
 * Database Artist Albums Interface
 */
export interface DBArtistAlbum {
  [key: string]: Record<string, string[]>;
}

/**
 * Database Artist Album Redirect Interface
 */
export interface DBArtistAlbumRedirect {
  [key: string]: Record<string, string>;
}

/**
 * Database SameNames Interface
 */
export interface DBSameName {
  name: string;
  Artist: { name: string };
  albumIDs: number[] | string;
  isDefault: boolean;
}
