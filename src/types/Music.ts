import { JsonValue } from "@prisma/client/runtime/library";

export interface Artist {
  id: number;
  name: string;
  aliases: string | string[];
  playcount: number | 0;
  image: string | "";
}

export interface DBArtist {
  name: string;
  id: number;
  aliases: JsonValue | null;
}
[];
export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | string;
}

export interface LastFmAlbum {
  name: string;
  playcount: string;
  artist: { name: string };
  image: LastFmImage[];
}
