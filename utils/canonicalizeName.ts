import * as OpenCC from "opencc-js";

// ---------------------------
// Manual mapping for exceptions / romanizations
// ---------------------------
const manualMap: Record<string, string> = {
  林忆莲: "林憶蓮",
  優里: "優里",
};

// ---------------------------
// Unicode ranges for CJK
// ---------------------------
// Includes: Han, Hiragana, Katakana, CJK extensions, compatibility
const CJK_REGEX =
  /[\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\uF900-\uFAFF]/;

/**
 * Detect if a string contains Chinese characters
 */
function isChinese(text: string): boolean {
  return /[\u4E00-\u9FFF]/.test(text);
}

/**
 * Detect if a string contains Japanese characters
 */
function isJapanese(text: string): boolean {
  return /[\u3040-\u30FF]/.test(text);
}

/**
 * Remove ONLY spaces between two CJK characters.
 * DO NOT remove if anything non-CJK is involved (e.g., ×, & , -, Latin, emoji).
 */
function removeCJKInnerSpaces(text: string): string {
  return text.replace(/(\S)\s+(\S)/g, (match, left, right) => {
    if (CJK_REGEX.test(left) && CJK_REGEX.test(right)) {
      return left + right; // remove space
    }
    return match; // keep as-is
  });
}

/**
 * Canonicalize a name:
 * 1. First remove CJK-only spaces (鬼頭 明里 → 鬼頭明里)
 * 2. Convert simplified → traditional Chinese using OpenCC
 * 3. Handle Japanese names via manual map
 * 4. Apply fallback manual overrides
 */
export function canonicalizeName(name: string): string {
  // Step 1 — collapse CJK-only spaces BEFORE doing any conversion
  let normalized = removeCJKInnerSpaces(name);

  // Step 2 — convert Chinese to traditional
  if (isChinese(normalized)) {
    // Correct conversion: simplified → traditional
    const converter = OpenCC.Converter({ from: "cn", to: "t" });
    normalized = converter(normalized);
  }

  // Step 3 — Japanese handling (manual only)
  if (isJapanese(normalized)) {
    normalized = manualMap[normalized] || normalized;
  }

  // Step 4 — final override map
  normalized = manualMap[normalized] || normalized;

  return normalized;
}
