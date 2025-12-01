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
 * Full Normalization, ignores simplfied translation skip flag from DB row
 * @param name
 * @param dbRow
 * @returns
 */
async function normalizeFull(name: string, dbRow?: DBArtist): Promise<string> {
  const pre = normalizeSpaces(normalizeCommas(normalizeCV(name)));
  const skipChinese = !!dbRow?.ignoreChineseCanonization;

  // Print line statements for debugging
  // if (skipChinese) {
  //   console.log(
  //     `Normalizing "${name}" with skipChineseConversion=${skipChinese}`
  //   );
  // }
  return canonicalizeName(pre, { skipChineseConversion: skipChinese });
}

/**
 * Fetches all pages of Last.fm data for a given method
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
 *
 * @param albums
 * @param dbArtistMap
 * @returns
 */
async function buildAlbumLookup(
  albums: LastFmAlbum[],
  dbArtistMap: Record<string, DBArtist>
): Promise<AlbumLookup> {
  const lookup: AlbumLookup = {};

  for (const album of albums) {
    const rawName = album.artist?.name;
    if (!rawName) continue;

    const dbRow = dbArtistMap[rawName];
    const artistName = await normalizeFull(rawName, dbRow);

    if (!lookup[artistName]) lookup[artistName] = [];
    lookup[artistName].push(album);
  }

  return lookup;
}

/**
 *
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
 *
 * @param lastFmArtists
 * @param dbArtistMap
 * @returns
 */
async function mergeArtists(
  lastFmArtists: LastFmArtist[],
  dbArtistMap: Record<string, DBArtist>
) {
  const aliasMap: Record<string, string> = {};

  const asciiLower = (str: string) =>
    str.replace(/[A-Za-z]/g, (c) => c.toLowerCase());

  /**
   * Normalizes all database artist names and aliases
   */
  const normalizedDbPromises = Object.values(dbArtistMap).map(
    async (artist) => {
      const nameNorm = await normalizeFull(artist.name, artist);

      let aliases: string[] = [];
      if (Array.isArray(artist.aliases)) {
        aliases = artist.aliases.filter(
          (a): a is string => typeof a === "string"
        );
      } else if (typeof artist.aliases === "string") {
        try {
          const parsed = JSON.parse(artist.aliases);
          if (Array.isArray(parsed))
            aliases = parsed.filter((a): a is string => typeof a === "string");
        } catch {}
      }

      const aliasNorm = await Promise.all(
        aliases.map((a) => normalizeFull(a, artist))
      );

      return { original: artist, nameNorm, aliasNorm };
    }
  );

  const normalizedDb = await Promise.all(normalizedDbPromises);

  // Builds the alias map from normalized DB names and aliases
  normalizedDb.forEach(({ original, nameNorm, aliasNorm }) => {
    aliasMap[nameNorm] = original.name;
    aliasNorm.forEach((a) => (aliasMap[a] = original.name));
  });

  const sortedDbCanonNames = Object.keys(aliasMap).sort(
    (a, b) => a.length - b.length
  );

  // Merging Last.fm artists into the merged structure
  const merged: Record<string, MergedEntry> = {};

  for (const artist of lastFmArtists) {
    const dbRow = dbArtistMap[artist.name]; // may be undefined
    const canonName = await normalizeFull(artist.name, dbRow);

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

    if (!merged[mainName])
      merged[mainName] = { playcount: 0, candidates: [], aliasNames: [] };

    merged[mainName].playcount += parseInt(artist.playcount, 10);
    merged[mainName].candidates.push(artist);

    if (
      mainName !== artist.name &&
      !merged[mainName].aliasNames.includes(artist.name)
    ) {
      merged[mainName].aliasNames.push(artist.name);
    }
  }

  return merged;
}

/**
 * Builds the final result set
 * @param merged
 * @param dbArtistMap
 * @param albums
 * @returns
 */
async function buildResult(
  merged: Record<string, MergedEntry>,
  dbArtistMap: Record<string, DBArtist>,
  albums: LastFmAlbum[]
): Promise<ResultRow[]> {
  const albumLookup = await buildAlbumLookup(albums, dbArtistMap);
  const rows: ResultRow[] = [];

  for (const [name, entry] of Object.entries(merged)) {
    const dbRow = dbArtistMap[name];

    let explicitAliases: string[] = [];
    if (dbRow?.aliases) {
      if (Array.isArray(dbRow.aliases)) {
        explicitAliases = dbRow.aliases.filter(
          (a): a is string => typeof a === "string"
        );
      } else if (typeof dbRow.aliases === "string") {
        try {
          const parsed = JSON.parse(dbRow.aliases);
          if (Array.isArray(parsed))
            explicitAliases = parsed.filter(
              (a): a is string => typeof a === "string"
            );
        } catch {}
      }
    }

    const allAliases = [...explicitAliases, ...entry.aliasNames];

    const namesToCheck = await Promise.all(
      [name, ...allAliases].map((n) => normalizeFull(n, dbRow))
    );
    const image = getTopAlbumImageFromNames(albumLookup, namesToCheck);

    rows.push({
      name: await normalizeFull(name, dbRow),
      playcount: entry.playcount,
      aliases: await Promise.all(
        allAliases.map((a) => normalizeFull(a, dbRow))
      ),
      image,
    });
  }

  return rows.sort((a, b) => b.playcount - a.playcount);
}

/**
 * GET Handler
 * @returns Response with merged artists
 */
export async function GET() {
  try {
    // Fetch only the necessary fields, including ignoreChineseCanonization
    const dbArtists = await prisma.artist.findMany({
      select: {
        id: true,
        name: true,
        aliases: true,
        ignoreChineseCanonization: true, // make sure this is included
      },
    });

    const dbArtistMap: Record<string, DBArtist> = {};
    dbArtists.forEach((a) => {
      dbArtistMap[a.name] = {
        ...a,
        ignoreChineseCanonization: a.ignoreChineseCanonization ?? false, // default if missing
      };
    });

    const [lastFmArtists, lastFmAlbums] = await Promise.all([
      fetchAllLastFm<LastFmArtist>("user.gettopartists", USERNAME, API_KEY),
      fetchAllLastFm<LastFmAlbum>("user.gettopalbums", USERNAME, API_KEY),
    ]);

    const merged = await mergeArtists(lastFmArtists, dbArtistMap);
    const result = await buildResult(merged, dbArtistMap, lastFmAlbums);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Fetch + merge error:", err);
    return NextResponse.json(
      { error: "Failed to fetch and merge artists" },
      { status: 500 }
    );
  }
}
