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
 * Fetches all the Last.fm data
 * @param method
 * @param username
 * @param apiKey
 * @returns
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
 * Builds album lookup table
 * @param albums
 * @returns
 */
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

/**
 * Picks the top album image from a list of artist names using the album lookup
 * @param albumLookup
 * @param names
 * @returns
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
 * Function to merge artists
 * @param lastFmArtists
 * @param dbArtists
 * @returns
 */
function mergeArtists(lastFmArtists: LastFmArtist[], dbArtists: DBArtist[]) {
  const aliasMap: Record<string, string> = {};

  // Helper: lowercase only ASCII letters
  const asciiLower = (str: string) =>
    str.replace(/[A-Za-z]/g, (c) => c.toLowerCase());

  // Build canonicalized alias map from DB
  dbArtists.forEach((artist) => {
    const dbCanon = canonicalizeName(
      normalizeSpaces(normalizeCommas(normalizeCV(artist.name)))
    );
    aliasMap[dbCanon] = artist.name;

    // Safely parse aliases from JsonValue
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
      } catch {
        aliases = [];
      }
    }

    aliases.forEach((alias) => {
      aliasMap[normalizeSpaces(canonicalizeName(normalizeCommas(alias)))] =
        artist.name;
    });
  });

  // Sort database canonical names by length ascending (shortest first)
  const sortedDbCanonNames = Object.keys(aliasMap).sort(
    (a, b) => a.length - b.length
  );

  const merged: Record<string, MergedEntry> = {};

  lastFmArtists.forEach((artist) => {
    const canonName = canonicalizeName(normalizeCommas(artist.name));
    let mainName: string | undefined;

    // Try exact alias match first
    mainName = aliasMap[canonName];

    // Try substring match using longest DB names first, ASCII-only lowercase
    if (!mainName) {
      const canonAscii = asciiLower(canonName);
      for (const dbCanon of sortedDbCanonNames) {
        const dbAscii = asciiLower(dbCanon);
        if (dbAscii.includes(canonAscii)) {
          mainName = aliasMap[dbCanon];
          break;
        }
      }
    }

    // Fallback to artist name itself if no match
    mainName = mainName || artist.name;

    // Initialize merged entry if it doesn't exist
    if (!merged[mainName]) {
      merged[mainName] = {
        playcount: 0,
        candidates: [],
        aliasNames: [],
      };
    }

    // Aggregate playcount
    merged[mainName].playcount += parseInt(artist.playcount, 10);
    merged[mainName].candidates.push(artist);

    // Track alias names
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
 * @param merged
 * @param dbArtists
 * @param albums
 * @returns
 */
function buildResult(
  merged: Record<string, MergedEntry>,
  dbArtists: DBArtist[],
  albums: LastFmAlbum[]
): ResultRow[] {
  const albumLookup = buildAlbumLookup(albums);

  return Object.entries(merged)
    .map(([name, { playcount, aliasNames }]) => {
      const dbEntry = dbArtists.find((a) => a.name === name);

      // Parse DB aliases safely
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
          } catch {
            explicitAliases = [];
          }
        }
      }

      const allAliases = [...explicitAliases, ...aliasNames];
      const namesToCheck = [name, ...allAliases];

      const image = getTopAlbumImageFromNames(albumLookup, namesToCheck);

      // Final normalization stage (safe because merging is already completed)
      const normalizeFinal = (s: string) =>
        normalizeSpaces(normalizeCommas(normalizeCV(s)));

      return {
        name: normalizeFinal(name),
        playcount,
        aliases: allAliases.map(normalizeFinal),
        image,
      };
    })
    .sort((a, b) => b.playcount - a.playcount);
}

/**
 * GET Handler
 * @returns Response with merged artists data
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
