import { NextResponse } from "next/server";

// Lib
import { prisma } from "@/lib/prisma";

// Utils
import { canonicalizeName } from "@/utils/canonicalizeName";
import {
  normalizeCommas,
  normalizeCV,
  normalizeSpaces,
} from "@/utils/normalizeName";

// Types
import { DBArtist, LastFmArtist, LastFmAlbum } from "@/types/Music";

// Environment Variables
const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY!;
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME!;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

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

/**
 * --- FULL NORMALIZATION PIPELINE ---
 */
function normalizeFull(name: string): string {
  return canonicalizeName(normalizeSpaces(normalizeCommas(normalizeCV(name))));
}

/**
 * Fetches all the Last.fm data
 * @param method
 * @param username
 * @param apiKey
 */
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

/**
 * Builds album lookup table (NORMALIZED ARTIST KEYS)
 */
function buildAlbumLookup(albums: LastFmAlbum[]): AlbumLookup {
  const lookup: AlbumLookup = {};

  albums.forEach((album) => {
    const rawName = album.artist?.name;
    if (!rawName) return;

    const artistName = normalizeFull(rawName);

    if (!lookup[artistName]) lookup[artistName] = [];
    lookup[artistName].push(album);
  });

  return lookup;
}

/**
 * Picks the top album image from normalized names
 */
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

/**
 * Merge artists with FULL normalization
 */
function mergeArtists(lastFmArtists: LastFmArtist[], dbArtists: DBArtist[]) {
  const aliasMap: Record<string, string> = {};

  const asciiLower = (str: string) =>
    str.replace(/[A-Za-z]/g, (c) => c.toLowerCase());

  //--------------------------------------------------------------------
  // NORMALIZE DB ARTISTS + ALIASES FIRST
  //--------------------------------------------------------------------
  const normalizedDb = dbArtists.map((artist) => {
    const nameNorm = normalizeFull(artist.name);

    let aliases: string[] = [];

    if (Array.isArray(artist.aliases)) {
      aliases = artist.aliases.filter(
        (a): a is string => typeof a === "string"
      );
    } else if (typeof artist.aliases === "string") {
      try {
        const parsed = JSON.parse(artist.aliases);
        if (Array.isArray(parsed)) {
          aliases = parsed.filter((a): a is string => typeof a === "string");
        }
      } catch {}
    }

    const aliasNorm = aliases.map((a) => normalizeFull(a));

    return {
      original: artist,
      nameNorm,
      aliasNorm,
    };
  });

  //--------------------------------------------------------------------
  // BUILD ALIAS MAP
  //--------------------------------------------------------------------
  normalizedDb.forEach(({ original, nameNorm, aliasNorm }) => {
    aliasMap[nameNorm] = original.name;
    aliasNorm.forEach((a) => {
      aliasMap[a] = original.name;
    });
  });

  const sortedDbCanonNames = Object.keys(aliasMap).sort(
    (a, b) => a.length - b.length
  );

  //--------------------------------------------------------------------
  // MERGE LAST.FM ARTISTS (NORMALIZED)
  //--------------------------------------------------------------------
  const merged: Record<string, MergedEntry> = {};

  lastFmArtists.forEach((artist) => {
    const canonName = normalizeFull(artist.name);
    let mainName: string | undefined = aliasMap[canonName];

    if (!mainName) {
      const canonAscii = asciiLower(canonName);

      for (const dbCanon of sortedDbCanonNames) {
        if (asciiLower(dbCanon).includes(canonAscii)) {
          mainName = aliasMap[dbCanon];
          break;
        }
      }
    }

    mainName = mainName || artist.name;

    if (!merged[mainName]) {
      merged[mainName] = {
        playcount: 0,
        candidates: [],
        aliasNames: [],
      };
    }

    merged[mainName].playcount += parseInt(artist.playcount, 10);
    merged[mainName].candidates.push(artist);

    if (
      mainName !== artist.name &&
      !merged[mainName].aliasNames.includes(artist.name)
    ) {
      merged[mainName].aliasNames.push(artist.name);
    }
  });

  return merged;
}

/**
 * Builds the final results table
 */
function buildResult(
  merged: Record<string, MergedEntry>,
  dbArtists: DBArtist[],
  albums: LastFmAlbum[]
): ResultRow[] {
  const albumLookup = buildAlbumLookup(albums);

  return Object.entries(merged)
    .map(([name, entry]) => {
      const dbEntry = dbArtists.find((a) => a.name === name);

      // Parse DB aliases again for final output
      let explicitAliases: string[] = [];

      if (dbEntry?.aliases) {
        if (Array.isArray(dbEntry.aliases)) {
          explicitAliases = dbEntry.aliases.filter(
            (a): a is string => typeof a === "string"
          );
        } else if (typeof dbEntry.aliases === "string") {
          try {
            const parsed = JSON.parse(dbEntry.aliases);
            if (Array.isArray(parsed)) {
              explicitAliases = parsed.filter(
                (a): a is string => typeof a === "string"
              );
            }
          } catch {}
        }
      }

      const allAliases = [...explicitAliases, ...entry.aliasNames];

      const namesToCheck = [name, ...allAliases].map(normalizeFull);
      const image = getTopAlbumImageFromNames(albumLookup, namesToCheck);

      return {
        name: normalizeFull(name),
        playcount: entry.playcount,
        aliases: allAliases.map(normalizeFull),
        image,
      };
    })
    .sort((a, b) => b.playcount - a.playcount);
}

/**
 * GET Handler
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
