// utils/canonicalizeName.ts
import * as OpenCC from "opencc-js";

/**
 * Manual override map (fill with any manual mappings you want)
 */
const manualMap: Record<string, string> = {};

/**
 * CJK detection ranges
 */
const CJK_REGEX =
  /[\u4E00-\u9FFF\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\uF900-\uFAFF]/;

export function isChinese(text: string): boolean {
  return /[\u4E00-\u9FFF]/.test(text);
}

export function isJapanese(text: string): boolean {
  return /[\u3040-\u30FF]/.test(text);
}

/**
 * Remove ONLY spaces between two CJK characters.
 * Keep spaces if either side is non-CJK.
 */
export function removeCJKInnerSpaces(text: string): string {
  return text.replace(/(\S)\s+(\S)/g, (match, left, right) => {
    if (CJK_REGEX.test(left) && CJK_REGEX.test(right)) {
      return left + right;
    }
    return match;
  });
}

/**
 * canonicalizeName
 *
 * opts.skipChineseConversion — when true, skip OpenCC conversion (Traditional -> Simplified).
 * This is intended to be used when the DB artist row explicitly requests skipping Chinese canonization.
 *
 * NOTE: This function still runs removeCJKInnerSpaces and manualMap logic regardless of skip flag,
 * per your requirement that only the OpenCC step be skipped.
 */
export function canonicalizeName(
  rawName: string,
  opts?: { skipChineseConversion?: boolean }
): string {
  let normalized = removeCJKInnerSpaces(rawName);

  const skipChineseConversion = !!opts?.skipChineseConversion;

  // Only apply OpenCC when:
  //  - contains Chinese Han characters
  //  - is not Japanese (we don't want to treat Japanese as Chinese)
  //  - and skipChineseConversion is false
  if (
    isChinese(normalized) &&
    !isJapanese(normalized) &&
    !skipChineseConversion
  ) {
    try {
      // Traditional -> Simplified (as you requested)
      const converter = OpenCC.Converter({ from: "t", to: "cn" });
      normalized = converter(normalized);
    } catch (e) {
      // Fail gracefully and keep the unconverted text
      console.warn("OpenCC conversion failed:", normalized, e);
    }
  }

  // Apply Japanese manual map if applicable
  if (isJapanese(normalized)) {
    normalized = manualMap[normalized] || normalized;
  }

  // Global manual map override
  normalized = manualMap[normalized] || normalized;

  return normalized;
}
