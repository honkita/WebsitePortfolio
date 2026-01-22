import { NextResponse } from "next/server";

// Lib
import { prisma } from "@/lib/prisma";

// Utils
import { normalizeArtistFull } from "@/utils/normalizeName";

// Types
import type { Artist as DBArtist } from "@prisma/client";
import {
  LastFmArtist,
  LastFmAlbum,
  LastFmAlbumClean,
  lfmArtistAlbums,
  artistAlbumContainer,
  cleanedAlbums,
  artistAlbumTopAlbum,
} from "@/types/Music";

// Environment Variables
const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY!;
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME!;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

/**
 * Fetches all pages concurrently
 * @param url
 * @param totalPages
 * @returns Promise<any[]>
 */
async function fetchAllPages(url: string, totalPages: number) {
  const promises = [];
  for (let p = 2; p <= totalPages; p++) {
    promises.push(fetch(url + `&page=${p}`).then((r) => r.json()));
  }
  const results = await Promise.all(promises);
  return results;
}

/**
 * Fetches all items from Last.fm
 * @param method
 * @param username
 * @param apiKey
 * @returns Promise<T[]>
 */
async function fetchAllLastFm<T>(
  method: string,
  username: string,
  apiKey: string,
) {
  const baseURL = `${API_URL}?method=${method}&user=${username}&api_key=${apiKey}&format=json&limit=1000`;

  const first = await fetch(baseURL + "&page=1").then((r) => r.json());

  let items: any[] = [];
  let extract: (d: any) => any[];
  let totalPages: number;

  if (method === "user.gettopartists") {
    extract = (d) => d.topartists.artist;
    totalPages = +first.topartists["@attr"].totalPages;
  } else {
    extract = (d) => d.topalbums.album;
    totalPages = +first.topalbums["@attr"].totalPages;
  }

  items.push(...extract(first));

  if (totalPages > 1) {
    const rest = await fetchAllPages(baseURL, totalPages);
    for (const r of rest) items.push(...extract(r));
  }

  return items as T[];
}

/**
 * Merges the artists
 * @param lfmArtistMap
 * @param dbArtistMap
 * @returns
 */
async function mergeArtists(
  lfmArtistAlbumMap: Record<string, lfmArtistAlbums>,
  dbArtistMap: Record<string, DBArtist>,
): Promise<Record<string, artistAlbumContainer>> {
  // Maps ALL the aliases
  const aliasMap: Record<string, string> = {};

  const asciiLower = (str: string) =>
    str.replace(/[A-Za-z]/g, (c) => c.toLowerCase());

  const normalizedDbPromises = Object.values(dbArtistMap).map(
    async (artist) => {
      const nameNorm = await normalizeArtistFull(
        artist.name,
        artist.ignoreChineseCanonization,
      );

      let aliases: string[] = [];

      if (Array.isArray(artist.aliases)) {
        aliases = artist.aliases.filter(
          (a): a is string => typeof a === "string",
        );
      } else if (typeof artist.aliases === "string") {
        try {
          const parsed = JSON.parse(artist.aliases);
          if (Array.isArray(parsed))
            aliases = parsed.filter((a): a is string => typeof a === "string");
        } catch {}
      }

      const aliasNorm = await Promise.all(
        aliases.map((a) =>
          normalizeArtistFull(a, artist.ignoreChineseCanonization),
        ),
      );

      return {
        id: artist.id,
        name: artist.name,
        ignoreChinese: artist?.ignoreChineseCanonization,
        nameNorm,
        aliasNorm,
      };
    },
  );

  const normalizedDb = await Promise.all(normalizedDbPromises);

  normalizedDb.forEach(({ id, name, ignoreChinese, nameNorm, aliasNorm }) => {
    aliasMap[nameNorm] = name;
    aliasNorm.forEach((a) => (aliasMap[a] = name));
  });

  /**
   * Penalty function for sorting
   * @param name
   * @returns
   */
  function penalty(name: string) {
    return /[&,，,＋+×]/.test(name) ? 2 : 1;
  }

  const sortedDbCanonNames = Object.keys(aliasMap).sort((a, b) => {
    const pa = penalty(a);
    const pb = penalty(b);
    return a.length * pa - b.length * pb;
  });

  const merged: Record<string, artistAlbumContainer> = {};

  for (const [artistName, information] of Object.entries(lfmArtistAlbumMap)) {
    const dbRow = dbArtistMap[artistName];
    const canonName = await normalizeArtistFull(
      artistName,
      dbRow?.ignoreChineseCanonization ?? false,
    );

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

    mainName = mainName || artistName;

    if (!merged[mainName])
      merged[mainName] = {
        playcount: 0,
        albums: {},
        ignoreChinese: false,
        id: dbArtistMap[mainName]?.id || -1,
      };

    merged[mainName].playcount += Number(information.playcount);

    // Merge albums

    const mergedAlbums = <Record<string, cleanedAlbums>>{};
    for (const [name, value] of Object.entries(merged[mainName].albums)) {
      mergedAlbums[name] = {
        playcount:
          (mergedAlbums[name]?.playcount ?? 0) + Number(value.playcount),
        image: value.image,
      };
    }
    for (const [name, value] of Object.entries(information.albums)) {
      mergedAlbums[name] = {
        playcount:
          (mergedAlbums[name]?.playcount ?? 0) + Number(value.playcount),
        image: value.image,
      };
    }

    merged[mainName].albums = mergedAlbums;
  }

  return merged;
}

/**
 * Builds the final result function
 * @param merged
 * @param dbArtistMap
 * @param albums
 * @returns
 */
async function buildResult(
  lfmArtistsMap: Record<string, number>,
  lfmAlbumMap: Record<string, Record<string, LastFmAlbumClean>>,
): Promise<Record<string, lfmArtistAlbums>> {
  const lfmArtistAlbumMap: Record<string, lfmArtistAlbums> = {};

  for (const [artistName, playcount] of Object.entries(lfmArtistsMap)) {
    if (playcount > 0) {
      lfmArtistAlbumMap[artistName] = {
        playcount: playcount,
        albums: {},
      };
    }
  }
  for (const [artistName, lfmAlbum] of Object.entries(lfmAlbumMap)) {
    for (const [albumName, album] of Object.entries(lfmAlbum)) {
      if (albumName == "I burn") {
        console.log(lfmAlbum);
      }
      // Remove the - Single or - EP suffixes for better matching
      const cleanedName = String(
        albumName.replace(/\s*-\s*(Single|EP)$/i, "").trim(),
      );
      // if (lfmAlbum.artistName === "i-dle" || lfmAlbum.artistName === "(G)I-DLE") {
      //   console.log(name, ": ", lfmAlbum.playcount);
      // }

      // Check if the name of the artist exists in the lfmArtistsMap
      if (lfmArtistAlbumMap[artistName] !== undefined) {
        // Check if the artist already has the album
        if (
          lfmArtistAlbumMap[artistName].albums[String(cleanedName)] !==
          undefined
        ) {
          // If it exists, accumulate the playcount
          lfmArtistAlbumMap[artistName].albums[String(cleanedName)].playcount =
            Number(
              lfmArtistAlbumMap[artistName].albums[String(cleanedName)]
                .playcount,
            ) + Number(album.playcount);

          // Will need to add the album image checker later, but will leave out for now.....
        } else {
          lfmArtistAlbumMap[artistName].albums[String(cleanedName)] = album;
        }
      } else {
        continue;
      }
    }
  }
  console.log(lfmArtistAlbumMap["i-dle"]);
  // console.log(lfmArtistAlbumMap["(G)I-DLE"]);

  return lfmArtistAlbumMap;
}

async function getBestAlbum(
  merged: Record<string, artistAlbumContainer>,
): Promise<artistAlbumTopAlbum[]> {
  const result: artistAlbumTopAlbum[] = [];

  for (const [artistName, data] of Object.entries(merged)) {
    let topAlbumImage = "";
    let highestPlaycount = -1;
    for (const album of Object.values(data.albums)) {
      if (album.playcount > highestPlaycount) {
        highestPlaycount = album.playcount;
        topAlbumImage = album.image;
      }
    }
    result.push({
      name: artistName,
      id: data.id,
      playcount: data.playcount,
      ignoreChinese: data.ignoreChinese,
      topAlbumImage: topAlbumImage,
    });
  }
  return result;
}

// /**
//  *
//  * @param rows
//  * @param dbArtistMap
//  * @param albums
//  * @returns
//  */
// async function applySameNameDisambiguation(
//   rows: ResultRow[],
//   dbArtistMap: Record<string, DBArtist>,
//   albums: LastFmAlbum[],
// ): Promise<ResultRow[]> {
//   const output: ResultRow[] = [];

//   // Normalize DB artist lookup
//   const normalizedDbArtist = new Map<string, DBArtist>();
//   for (const artist of Object.values(dbArtistMap)) {
//     const norm = await normalizeArtistFull(artist.name, artist);
//     normalizedDbArtist.set(norm, artist);
//   }

//   // Albums from Last.FM
//   const albumIndex = await buildArtistAlbumIndex(albums, dbArtistMap);
//   const albumLookup = await buildAlbumLookup(albums, dbArtistMap);

//   for (const row of rows) {
//     const dbArtist = normalizedDbArtist.get(row.name);

//     // Artist not in DB → passthrough
//     if (!dbArtist) {
//       output.push(row);
//       continue;
//     }

//     const sameNames = await prisma.sameNames.findMany({
//       where: { groupID: dbArtist.id },
//       orderBy: { isDefault: "desc" },
//     });

//     // No SameNames → passthrough
//     if (!sameNames.length) {
//       output.push(row);
//       continue;
//     }

//     const artistAlbums = albumIndex.get(row.name) || new Map();
//     let remaining = row.playcount;

//     const buckets = new Map<number, number>();

//     // Allocate album-based scrobbles to each SameName
//     for (const sn of sameNames) {
//       const albumIDs: number[] = extractAlbumNames(sn.albumIDs);
//       if (!albumIDs.length) continue;

//       let sum = 0;

//       for (const albumID of albumIDs) {
//         const albumRow = await prisma.album.findUnique({
//           where: { id: albumID },
//         });
//         if (!albumRow) continue;

//         const albumNames = [albumRow.name];
//         if (albumRow.aliases) {
//           if (Array.isArray(albumRow.aliases))
//             albumNames.push(...albumRow.aliases);
//           else if (typeof albumRow.aliases === "string") {
//             try {
//               const parsed = JSON.parse(albumRow.aliases);
//               if (Array.isArray(parsed)) albumNames.push(...parsed);
//             } catch {}
//           }
//         }

//         for (const name of albumNames) {
//           const key = normalizeAlbumFull(name);
//           sum += artistAlbums.get(key) || 0;
//         }
//       }

//       if (sum > 0) {
//         buckets.set(sn.id, sum);
//         remaining -= sum;
//       }
//     }

//     // Bin leftovers into default SameName
//     const defaultSN = sameNames.find((s) => s.isDefault) ?? sameNames[0];
//     buckets.set(
//       defaultSN.id,
//       (buckets.get(defaultSN.id) || 0) + Math.max(remaining, 0),
//     );

//     // Emit split rows — each gets its own top album image
//     for (const sn of sameNames) {
//       const playcount = buckets.get(sn.id) || 0;
//       if (playcount === 0 && !sn.isDefault) continue;

//       const image = getTopAlbumImageFromNames(albumLookup, [sn.name]);

//       output.push({
//         ...row,
//         name: sn.name,
//         playcount,
//         image,
//       });
//     }
//   }

//   return output.sort((a, b) => b.playcount - a.playcount);
// }

/**
 * GET Handler
 * @returns NextResponse
 */
export async function GET() {
  try {
    // Fetch DB Artists
    const dbArtists = await prisma.artist.findMany();

    // Hash map for quick artist lookup
    const dbArtistMap: Record<string, DBArtist> = {};
    dbArtists.forEach((a) => (dbArtistMap[a.name] = a));

    const [lfmArtists, lfmAlbums] = await Promise.all([
      fetchAllLastFm<LastFmArtist>("user.gettopartists", USERNAME, API_KEY),
      fetchAllLastFm<LastFmAlbum>("user.gettopalbums", USERNAME, API_KEY),
    ]);

    // Organize the fetched artists and albums into desired structure with hashmap
    const lfmArtistMap: Record<string, number> = {};
    lfmArtists.forEach(
      (artist) => (lfmArtistMap[artist.name] = artist.playcount),
    );

    const lfmAlbumMap: Record<string, Record<string, LastFmAlbumClean>> = {};
    lfmAlbums.forEach((album) => {
      const artist = album.artist.name;
      const name = album.name;

      lfmAlbumMap[artist] ??= {};

      lfmAlbumMap[artist][name] = {
        image: album.image[album.image.length - 1]["#text"],
        playcount: Number(album.playcount),
      };
    });
    const baseResult = await buildResult(lfmArtistMap, lfmAlbumMap);

    // console.log("base: ", Object.keys(baseResult).length);

    const merged = await mergeArtists(baseResult, dbArtistMap);

    // console.log("merged: ", Object.keys(merged).length);

    const bestAlbum = await getBestAlbum(merged);

    // console.log("best album: ", Object.keys(bestAlbum).length);

    return NextResponse.json(bestAlbum);
  } catch (err) {
    console.error("Fetch + merge error:", err);
    return NextResponse.json(
      { error: "Failed to fetch and merge artists" },
      { status: 500 },
    );
  }
}
