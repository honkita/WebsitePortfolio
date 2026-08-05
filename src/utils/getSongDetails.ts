// Lib
import { getArtist } from "@/lib/api";

// Utils
import { normalizeArtistFull } from "@/utils/normalizeName";

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
