// Lib
import { getCached } from "@/lib/apiCache";

// Types
import {
  DBAlbums,
  DBArtist,
  DBArtistAlbum,
  DBArtistAlbumRedirect,
  DBSameName,
} from "@/types/DBMusic";

export const getAlbums = () => getCached<DBAlbums>("/api/Albums");

export const getArtist = () => getCached<DBArtist>("/api/Artist");

export const getArtistAlbum = () =>
  getCached<DBArtistAlbum>("/api/ArtistAlbum");

export const getArtistAlbumRedirect = () =>
  getCached<DBArtistAlbumRedirect>("/api/ArtistAlbumRedirect");

export const getSameNames = () => getCached<DBSameName[]>("/api/SameName");
