// FULLY REFACTORED VERSION

import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";
import { canonicalizeName } from "@utils/canonicalizeName";

// Types
import { Artist as DBArtist } from "../../../types/Music";

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY!;
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME!;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

// ----------------------
// Last.fm API TYPES
// ----------------------
export interface LastFmImage {
  "#text": string;
  size: string;
}

export interface LastFmArtist {
  name: string;
  playcount: string;
  image: LastFmImage[];
}

export interface LastFmAlbum {
  name: string;
  playcount: string;
  artist: { name: string };
  image: LastFmImage[];
}

interface MergedEntry {
  playcount: number;
  candidates: LastFmArtist[];
  aliasNames: string[];
}

interface ResultRow {
  name: string;
  playcount: number;
  aliases: string[];
  image: string;
}

// Album lookup
type AlbumLookup = Record<string, LastFmAlbum[]>;

// ----------------------
// Generic Last.fm fetcher
// ----------------------
async function fetchAllLastFm<T>(
  method: string,
  username: string,
  apiKey: string
) {
  const firstRes = await fetch(
    `${API_URL}?method=${method}&user=${username}&api_key=${apiKey}&format=json&page=1&limit=1000`
  );
  if (!firstRes.ok) throw new Error(`Failed to fetch Last.fm ${method} page 1`);

  const firstData = await firstRes.json();

  let all: T[] = [];
  let totalPages = 1;

  if (method === "user.gettopartists") {
    all.push(...(firstData.topartists.artist as T[]));
    totalPages = parseInt(firstData.topartists["@attr"].totalPages, 10);
  } else if (method === "user.gettopalbums") {
    all.push(...(firstData.topalbums.album as T[]));
    totalPages = parseInt(firstData.topalbums["@attr"].totalPages, 10);
  }

  if (totalPages > 1) {
    const remainingPages = Array.from(
      { length: totalPages - 1 },
      (_, i) => i + 2
    );

    const pagePromises = remainingPages.map(async (page) => {
      const res = await fetch(
        `${API_URL}?method=${method}&user=${username}&api_key=${apiKey}&format=json&page=${page}&limit=1000`
      );
      if (!res.ok) throw new Error(`Failed Last.fm fetch page ${page}`);

      const data = await res.json();

      if (method === "user.gettopartists") return data.topartists.artist as T[];
      if (method === "user.gettopalbums") return data.topalbums.album as T[];

      return [] as T[];
    });

    const pagesResults = await Promise.all(pagePromises);
    pagesResults.forEach((pageData) => all.push(...pageData));
  }

  return all;
}

// ----------------------
// Album lookup builder
// ----------------------
function buildAlbumLookup(albums: LastFmAlbum[]): AlbumLookup {
  const lookup: AlbumLookup = {};

  albums.forEach((album) => {
    const artistName = album.artist?.name;
    if (!artistName) return;

    if (!lookup[artistName]) lookup[artistName] = [];
    lookup[artistName].push(album);
  });

  return lookup;
}

// ----------------------
// Pick best album image
// ----------------------
function getTopAlbumImageFromNames(
  lookup: AlbumLookup,
  names: string[]
): string {
  let topAlbum: LastFmAlbum | null = null;

  for (const name of names) {
    const albums = lookup[name];
    if (!albums?.length) continue;

    const candidate = albums.reduce<LastFmAlbum | null>((max, a) => {
      return !max || parseInt(a.playcount) > parseInt(max.playcount) ? a : max;
    }, null);

    if (
      !topAlbum ||
      parseInt(candidate!.playcount) > parseInt(topAlbum.playcount)
    ) {
      topAlbum = candidate!;
    }
  }

  if (!topAlbum) return "";

  const priority = ["mega", "extralarge", "large", "medium", "small"];

  for (const size of priority) {
    const img = topAlbum.image.find((i) => i.size === size);
    if (
      img?.["#text"] &&
      !img["#text"].includes("2a96cbd8b46e442fc41c2b86b821562f.png")
    ) {
      return img["#text"];
    }
  }

  const fallback = topAlbum.image.find((i) => i["#text"]);
  return fallback?.["#text"] || "";
}

// ----------------------
// Similarity helper
// ----------------------
function lengthSimilarity(a: string, b: string) {
  const lenA = a.length;
  const lenB = b.length;
  return Math.min(lenA, lenB) / Math.max(lenA, lenB);
}

// ----------------------
// TWO-PHASE MERGE (FIX)
// ----------------------
function mergeArtists(lastFmArtists: LastFmArtist[], dbArtists: DBArtist[]) {
  const aliasMap: Record<string, string> = {};

  // Build canonical → main name alias map
  dbArtists.forEach((artist) => {
    const canonMain = canonicalizeName(artist.name);
    aliasMap[canonMain] = artist.name;

    const aliases: string[] = Array.isArray(artist.aliases)
      ? artist.aliases
      : JSON.parse(artist.aliases || "[]");

    aliases.forEach((alias) => {
      aliasMap[canonicalizeName(alias)] = artist.name;
    });
  });

  const merged: Record<string, MergedEntry> = {};
  const unmerged: LastFmArtist[] = [];

  // ------------------
  // PHASE 1: alias-only
  // ------------------
  lastFmArtists.forEach((artist) => {
    const canon = canonicalizeName(artist.name);
    const directMatch = aliasMap[canon];

    if (directMatch) {
      if (!merged[directMatch]) {
        merged[directMatch] = { playcount: 0, candidates: [], aliasNames: [] };
      }

      merged[directMatch].playcount += parseInt(artist.playcount, 10);
      merged[directMatch].candidates.push(artist);

      if (directMatch !== artist.name) {
        merged[directMatch].aliasNames.push(artist.name);
      }

      return;
    }

    unmerged.push(artist);
  });

  // ----------------------
  // PHASE 2: substring merge
  // ----------------------
  const dbCanonNames = Object.keys(aliasMap);

  unmerged.forEach((artist) => {
    const canon = canonicalizeName(artist.name);

    const candidates = dbCanonNames.filter(
      canon // ONE-WAY SUBSTRING ONLY: lastfm → db => canon.includes(dbCanon)
    );

    let mainName: string | undefined = undefined;

    if (candidates.length === 1) {
      mainName = aliasMap[candidates[0]];
    } else if (candidates.length > 1) {
      candidates.sort(
        (a, b) => lengthSimilarity(a, canon) - lengthSimilarity(b, canon)
      );
      mainName = aliasMap[candidates[candidates.length - 1]];
    }

    mainName = mainName || artist.name;

    if (!merged[mainName]) {
      merged[mainName] = { playcount: 0, candidates: [], aliasNames: [] };
    }

    merged[mainName].playcount += parseInt(artist.playcount, 10);
    merged[mainName].candidates.push(artist);

    if (mainName !== artist.name) {
      merged[mainName].aliasNames.push(artist.name);
    }
  });

  return merged;
}

// ----------------------
// Build final formatted result
// ----------------------
function buildResult(
  merged: Record<string, MergedEntry>,
  dbArtists: DBArtist[],
  albums: LastFmAlbum[]
): ResultRow[] {
  const lookup = buildAlbumLookup(albums);

  return Object.entries(merged)
    .map(([name, { playcount, aliasNames }]) => {
      const dbEntry = dbArtists.find((a) => a.name === name);

      const explicitAliases: string[] = dbEntry?.aliases
        ? Array.isArray(dbEntry.aliases)
          ? dbEntry.aliases
          : JSON.parse(dbEntry.aliases)
        : [];

      const allAliases = [...explicitAliases, ...aliasNames];
      const namesToCheck = [name, ...allAliases];

      const image = getTopAlbumImageFromNames(lookup, namesToCheck);

      return { name, playcount, aliases: allAliases, image };
    })
    .sort((a, b) => b.playcount - a.playcount);
}

// ----------------------
// GET handler with retry + dynamic refresh
// ----------------------
export async function GET(request: Request) {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const [artists, albums, dbArtists] = await Promise.all([
        fetchAllLastFm<LastFmArtist>("user.gettopartists", USERNAME, API_KEY),
        fetchAllLastFm<LastFmAlbum>("user.gettopalbums", USERNAME, API_KEY),
        prisma.artist.findMany(),
      ]);

      const merged = mergeArtists(artists, dbArtists);
      const result = buildResult(merged, dbArtists, albums);

      return NextResponse.json(result);
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);

      if (attempt === MAX_RETRIES) {
        console.log("Max retries reached. Refreshing route...");
        // Redirect to the same route dynamically
        return NextResponse.redirect(request.url);
      }

      // Small delay before retrying
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}
