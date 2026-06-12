/**
 * Converts Bengali digits (০-৯) to English digits (0-9).
 * If the input is null, undefined, or empty, returns an empty string.
 */
export function banglaToEnglishDigits(str) {
  if (str === null || str === undefined) return '';
  const banglaDigits = {
    '০': '0',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    '৫': '5',
    '৬': '6',
    '৭': '7',
    '৮': '8',
    '৯': '9'
  };
  return String(str).replace(/[০-৯]/g, d => banglaDigits[d]);
}

/**
 * Normalizes input text for search indexing or numeric comparison.
 */
export function normalizeDigits(str) {
  return banglaToEnglishDigits(str);
}

/**
 * Parses a numeric amount from a string, supporting both English and Bengali digit text.
 * It will extract the first contiguous sequence of digits (e.g. "৫০০ টাকা" -> 500, "100/-" -> 100).
 */
export function parseDonationAmount(amountStr) {
  if (!amountStr) return 0;
  const normalized = banglaToEnglishDigits(String(amountStr));
  const match = normalized.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}
