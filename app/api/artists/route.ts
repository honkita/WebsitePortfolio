import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";
import { canonicalizeName } from "@utils/canonicalizeName";

// Types
import type { Artist, LastFmImage, LastFmAlbum } from "../../../types/Music";

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY!;
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME!;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

// ----------------------
// Last.fm API TYPES
// ----------------------

export interface LastFmArtist {
  name: string;
  playcount: string;
  image: LastFmImage[];
}

// Merge structure
interface MergedEntry {
  playcount: number;
  candidates: LastFmArtist[];
  aliasNames: string[];
}

// Output result
interface ResultRow {
  name: string;
  playcount: number;
  aliases: string[];
  image: string;
}

// Album lookup table
type AlbumLookup = Record<string, LastFmAlbum[]>;

// ----------------------
// API fetcher
// ----------------------
async function fetchAllLastFm<T>(
  method: string,
  username: string,
  apiKey: string
) {
  let all: T[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(
      `${API_URL}?method=${method}&user=${username}&api_key=${apiKey}&format=json&page=${page}&limit=1000`
    );
    if (!res.ok) throw new Error(`Failed to fetch Last.fm ${method}`);

    const data = await res.json();

    if (method === "user.gettopartists") {
      all.push(...(data.topartists.artist as T[]));
      totalPages = parseInt(data.topartists["@attr"].totalPages, 10);
    } else if (method === "user.gettopalbums") {
      all.push(...(data.topalbums.album as T[]));
      totalPages = parseInt(data.topalbums["@attr"].totalPages, 10);
    }

    page++;
  }

  return all;
}

// ----------------------
// Build album lookup
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
// Pick top album image
// ----------------------
function getTopAlbumImageFromNames(
  albumLookup: AlbumLookup,
  names: string[]
): string {
  let topAlbum: LastFmAlbum | null = null;

  for (const name of names) {
    const artistAlbums = albumLookup[name];
    if (!artistAlbums?.length) continue;

    const candidate = artistAlbums.reduce<LastFmAlbum | null>(
      (max, a) =>
        !max || parseInt(a.playcount) > parseInt(max.playcount) ? a : max,
      null
    );

    if (
      !topAlbum ||
      parseInt(candidate!.playcount) > parseInt(topAlbum.playcount)
    ) {
      topAlbum = candidate!;
    }
  }

  if (!topAlbum) return "";
  const sizes = ["mega", "extralarge", "large", "medium", "small"];
  for (const size of sizes) {
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
// String similarity based on length percentage
// ----------------------
function lengthSimilarity(a: string, b: string) {
  const lenA = a.length;
  const lenB = b.length;
  return Math.min(lenA, lenB) / Math.max(lenA, lenB);
}

// ----------------------
// Merge artists
// ----------------------
function mergeArtists(lastFmArtists: LastFmArtist[], dbArtists: Artist[]) {
  const aliasMap: Record<string, string> = {};

  // Build canonicalized alias map
  dbArtists.forEach((artist) => {
    const dbCanon = canonicalizeName(artist.name);
    aliasMap[dbCanon] = artist.name;

    const aliases: string[] = Array.isArray(artist.aliases)
      ? artist.aliases
      : JSON.parse(artist.aliases || "[]");

    aliases.forEach((alias) => {
      aliasMap[canonicalizeName(alias)] = artist.name;
    });
  });

  // Sort database canonical names by length descending
  const sortedDbCanonNames = Object.keys(aliasMap).sort(
    (a, b) => b.length - a.length
  );

  const merged: Record<string, MergedEntry> = {};

  lastFmArtists.forEach((artist) => {
    const canonName = canonicalizeName(artist.name);

    let mainName: string | undefined;

    // Try exact match first
    mainName = aliasMap[canonName];

    // Try substring match using longest DB names first
    if (!mainName) {
      for (const dbCanon of sortedDbCanonNames) {
        if (canonName.includes(dbCanon) || dbCanon.includes(canonName)) {
          mainName = aliasMap[dbCanon];
          break;
        }
      }
    }

    mainName = mainName || artist.name;

    if (!merged[mainName])
      merged[mainName] = {
        playcount: 0,
        candidates: [],
        aliasNames: [],
      };

    merged[mainName].playcount += parseInt(artist.playcount, 10);
    merged[mainName].candidates.push(artist);

    if (mainName !== artist.name) {
      if (!merged[mainName].aliasNames.includes(artist.name)) {
        merged[mainName].aliasNames.push(artist.name);
      }
    }
  });

  return merged;
}

// ----------------------
// Build final output
// ----------------------
function buildResult(
  merged: Record<string, MergedEntry>,
  dbArtists: Artist[],
  albums: LastFmAlbum[]
): ResultRow[] {
  const albumLookup = buildAlbumLookup(albums);

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

      const image = getTopAlbumImageFromNames(albumLookup, namesToCheck);

      return { name, playcount, aliases: allAliases, image };
    })
    .sort((a, b) => b.playcount - a.playcount);
}

/**
 * GET Handler
 * @returns
 */
export async function GET() {
  try {
    const [lastFmArtists, lastFmAlbums, dbArtists] = await Promise.all([
      fetchAllLastFm<LastFmArtist>("user.gettopartists", USERNAME, API_KEY),
      fetchAllLastFm<LastFmAlbum>("user.gettopalbums", USERNAME, API_KEY),
      prisma.artist.findMany(),
    ]);

    const merged = mergeArtists(lastFmArtists, dbArtists);
    const result = buildResult(merged, dbArtists, lastFmAlbums);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Fetch + merge error:", err);
    return NextResponse.json(
      { error: "Failed to fetch and merge artists" },
      { status: 500 }
    );
  }
}
