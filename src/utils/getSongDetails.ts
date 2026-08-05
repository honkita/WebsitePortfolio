// Lib
import { getArtist, getArtistAlbum } from "@/lib/api";

// Utils
import {
  canonicalAlbumKey,
  normalizeAlbumFull,
  normalizeArtistFull,
} from "@/utils/normalizeName";
import { levenshtein, similarityScore } from "@/utils/levenshtein";

/**
 * Gets the canonical database artist name from a Last.fm artist name
 * @param artistName Last.fm artist name
 * @param dbArtistMap Database artists
 * @returns Canonical artist name or original name if no match found
 */
export const getArtistName = async (artistName: string): Promise<string> => {
  const aliasMap: Record<string, string> = {};

  const asciiLower = (str: string) =>
    str.replace(/[A-Za-z]/g, (c) => c.toLowerCase());

  // Build alias lookup
  const normalizedDbPromises = Object.values(await getArtist()).map(
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
          if (Array.isArray(parsed)) {
            aliases = parsed.filter((a): a is string => typeof a === "string");
          }
        } catch {}
      }

      return {
        name: artist.name,
        nameNorm,
        aliases: await Promise.all(
          aliases.map((a) =>
            normalizeArtistFull(a, artist.ignoreChineseCanonization),
          ),
        ),
      };
    },
  );

  const normalizedDb = await Promise.all(normalizedDbPromises);

  normalizedDb.forEach(({ name, nameNorm, aliases }) => {
    aliasMap[nameNorm] = name;

    aliases.forEach((alias) => {
      aliasMap[alias] = name;
    });
  });

  // Normalize incoming artist
  const dbRow = (await getArtist())[artistName];

  const canonName = await normalizeArtistFull(
    artistName,
    dbRow?.ignoreChineseCanonization ?? false,
  );

  // Exact match
  if (aliasMap[canonName]) {
    return aliasMap[canonName];
  }

  // Fallback ASCII contains matching
  const canonAscii = asciiLower(canonName);

  for (const dbCanon of Object.keys(aliasMap)) {
    if (asciiLower(dbCanon).includes(canonAscii)) {
      return aliasMap[dbCanon];
    }
  }

  // No match
  return artistName;
};

/**
 * Gets the canonical database album name from a Last.fm album name
 * @param artistName Artist name
 * @param albumName Last.fm album name
 * @returns Canonical album name or original name if no match found
 */
export const getAlbumName = async (
  artistName: string,
  albumName: string,
): Promise<string> => {
  const dbAlbums = (await getArtistAlbum())[artistName] || {};

  const aliasMap: Record<string, string> = {};

  // Build album alias lookup
  for (const [dbAlbumName, aliases] of Object.entries(dbAlbums)) {
    const normalized = normalizeAlbumFull(dbAlbumName);

    aliasMap[canonicalAlbumKey(dbAlbumName)] = normalized;

    aliases.forEach((alias) => {
      aliasMap[canonicalAlbumKey(alias)] = normalized;
    });
  }

  const albumKey = canonicalAlbumKey(albumName);

  // 1. Exact alias match
  if (aliasMap[albumKey]) {
    return aliasMap[albumKey];
  }

  // 2. Similarity fallback
  const DISTANCE_THRESHOLD = 3;
  const SIMILARITY_THRESHOLD = 0.82;

  let bestMatch: string | null = null;
  let bestDistance = Infinity;
  let bestSimilarity = 0;

  for (const aliasKey of Object.keys(aliasMap)) {
    const dist = levenshtein(albumKey, aliasKey);
    const sim = similarityScore(albumKey, aliasKey);

    if (
      sim > bestSimilarity ||
      (sim === bestSimilarity && dist < bestDistance)
    ) {
      bestSimilarity = sim;
      bestDistance = dist;
      bestMatch = aliasKey;
    }
  }

  if (
    bestMatch &&
    bestDistance <= DISTANCE_THRESHOLD &&
    bestSimilarity >= SIMILARITY_THRESHOLD
  ) {
    return aliasMap[bestMatch];
  }

  // No match
  return albumName;
};
