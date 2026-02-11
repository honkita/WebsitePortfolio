// import { JsonArray } from "./generated/prisma/internal/prismaNamespace";

// export function jsonToArray<T>(values: JsonArray, typeGuard: string) {
//   let parsedValues: string[] = [];
//   if (Array.isArray(values)) {
//     parsedValues = values.filter((a): a is T => typeof a === typeGuard);
//   } else if (typeof values === "string") {
//     try {
//       const parsed = JSON.parse(album.Albums.aliases);
//       if (Array.isArray(parsed))
//         aliases = parsed.filter((a): a is string => typeof a === typeGuard);
//     } catch {}
//   }
// }
