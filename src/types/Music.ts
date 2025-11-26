export interface Artist {
  id: number;
  name: string;
  aliases: string | string[];
  playcount?: number;
  image?: string;
}

export interface DBArtist {
  name: string;
  aliases: string[] | string; // Can be stored as JSON string in DB
  id: number;
}

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
