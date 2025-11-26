export interface Artist {
  name: string;
  playcount: number;
  aliases: string[];
  image: string;
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
