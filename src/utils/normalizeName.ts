/**
 * Detects if string is predominantly CJK (Chinese/Japanese/Korean)
 */
function isCJK(str: string): boolean {
  // Count CJK characters
  const cjk =
    str.match(/[\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/g)
      ?.length ?? 0;
  const non = str.replace(
    /[\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F]/g,
    ""
  ).length;

  // Consider "predominantly CJK" if ≥ 40% characters are CJK
  // (can adjust threshold if needed)
  return cjk > 0 && cjk >= non * 0.4;
}

/**
 * Normalizes commas based on if the string is Japanese/Chinese or not
 * @param str
 * @returns
 */
export function normalizeCommas(str: string): string {
  if (!str) return str;

  const useCjkComma = isCJK(str);
  const targetComma = useCjkComma ? "，" : ",";

  // Normalize all comma variants but *preserve chosen comma style*
  return str
    .replace(/[\uFF0C,]\s*/g, targetComma)
    .replace(/\s*([，,])\s*/g, targetComma)
    .trim();
}

/**
 * Remove any spaces between two Chinese/Japanese characters
 * @param str
 */
export function normalizeSpaces(str: string): string {
  if (!str) return str;

  // Remove spaces between two CJK characters
  return str.replace(
    /([\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F])\s+([\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F])/g,
    "$1$2"
  );
}

/**
 * Normalizes seiyuu CV patterns to (CV.NAME)
 * @param str
 * @returns
 */
export function normalizeCV(str: string): string {
  if (!str) return str;
  const cvRegex = /\(([^)]*CV[^)]*)\)/gi;

  return str.replace(cvRegex, (full, inner) => {
    const match = inner.match(/^CV[\s.:]?(.+)$/i);

    if (!match) return full; // Not a CV group

    const name = match[1].trim();

    // Prevent double-normalizing: if already (CV.NAME)
    if (/^CV\.[^()]+$/i.test(inner.trim())) {
      return `(${inner.trim()})`;
    }

    return `(CV.${name})`;
  });
}
