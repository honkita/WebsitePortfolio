import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Types
import type { Artist } from "@prisma/client";

const dbArtists: Record<string, Artist> = {};

export const getArtists = cache(async (): Promise<Record<string, Artist>> => {
  if (Object.keys(dbArtists).length === 0) {
    console.log("Fetching artists from database...");
    const artists = await prisma.artist.findMany();
    for (const a of artists) {
      dbArtists[a.name] = a;
    }
  }
  return dbArtists;
});
