import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

// Utils
import { canonicalizeName } from "@utils/canonicalizeName";

// Environment Variables
const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY!;
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME!;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

/**
 *
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
      all.push(...data.topartists.artist);
      totalPages = parseInt(data.topartists["@attr"].totalPages, 10);
    } else if (method === "user.gettopalbums") {
      all.push(...data.topalbums.album);
      totalPages = parseInt(data.topalbums["@attr"].totalPages, 10);
    }

    page++;
  }

  return all;
}

/**
 *
 * @param albums
 * @returns
 */
function buildAlbumLookup(albums: any[]) {
  const lookup: Record<string, any[]> = {};
  albums.forEach((album) => {
    const artistName = album.artist?.name;
    if (!artistName) return;
    if (!lookup[artistName]) lookup[artistName] = [];
    lookup[artistName].push(album);
  });
  return lookup;
}

/**
 *
 * @param albumLookup
 * @param names
 * @returns
 */
function getTopAlbumImageFromNames(
  albumLookup: Record<string, any[]>,
  names: string[]
) {
  let topAlbum: any | null = null;

  for (const name of names) {
    const artistAlbums = albumLookup[name];
    if (!artistAlbums?.length) continue;

    const candidate = artistAlbums.reduce(
      (max, a) =>
        !max || parseInt(a.playcount) > parseInt(max.playcount) ? a : max,
      null as any
    );

    if (
      !topAlbum ||
      parseInt(candidate.playcount) > parseInt(topAlbum.playcount)
    ) {
      topAlbum = candidate;
    }
  }

  if (!topAlbum) return "";

  const sizes = ["mega", "extralarge", "large", "medium", "small"];
  for (const size of sizes) {
    const img = topAlbum.image.find((i: any) => i.size === size);
    if (
      img?.["#text"] &&
      !img["#text"].includes("2a96cbd8b46e442fc41c2b86b821562f.png")
    ) {
      return img["#text"];
    }
  }

  const fallback = topAlbum.image.find((i: any) => i["#text"]);
  return fallback?.["#text"] || "";
}

// -----------------------------
// Merge Last.fm artists with DB aliases and substring matches
// -----------------------------
function mergeArtists(lastFmArtists: any[], dbArtists: any[]) {
  const aliasMap: Record<string, string> = {};

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

  const merged: Record<
    string,
    { playcount: number; candidates: any[]; aliasNames: string[] }
  > = {};

  lastFmArtists.forEach((artist) => {
    const canonName = canonicalizeName(artist.name);

    // Exact alias match
    let mainName = aliasMap[canonName];
    let matchedBySubstring = false;

    // Substring match fallback
    if (!mainName) {
      const dbCanonMatch = Object.keys(aliasMap).find(
        (dbCanon) => dbCanon.includes(canonName) || canonName.includes(dbCanon)
      );
      if (dbCanonMatch) {
        mainName = aliasMap[dbCanonMatch];
        matchedBySubstring = true;
      }
    }

    // Fallback to Last.fm name
    mainName = mainName || artist.name;

    if (!merged[mainName])
      merged[mainName] = { playcount: 0, candidates: [], aliasNames: [] };

    merged[mainName].playcount += parseInt(artist.playcount, 10);
    merged[mainName].candidates.push(artist);

    // Add substring/merged names to aliasNames
    if (
      matchedBySubstring ||
      mainName !== artist.name // includes explicit alias case
    ) {
      if (!merged[mainName].aliasNames.includes(artist.name)) {
        merged[mainName].aliasNames.push(artist.name);
      }
    }
  });

  return merged;
}

// -----------------------------
// Build final result with album images
// -----------------------------
function buildResult(
  merged: Record<
    string,
    { playcount: number; candidates: any[]; aliasNames: string[] }
  >,
  dbArtists: any[],
  albums: any[]
) {
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
 *
 * @returns
 */
export async function GET() {
  try {
    const [lastFmArtists, lastFmAlbums, dbArtists] = await Promise.all([
      fetchAllLastFm("user.gettopartists", USERNAME, API_KEY),
      fetchAllLastFm("user.gettopalbums", USERNAME, API_KEY),
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
