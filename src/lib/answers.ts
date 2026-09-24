// Reading and grading a numeric answer the way students actually write it.
//
// The exercise screen used to do parseFloat(answer) and accept anything
// within 0.05. parseFloat stops at the first character it doesn't like, so
// "-3,5" (decimal comma, as many students write it) was read as -3, and
// "16/3" — the exact answer to a sector-area problem — as 16. Meanwhile a
// flat ±0.05 accepted 0.65 for 0.6.
//
// Rule: an answer is right if it is the same number, however it's written
// (comma or point, a fraction, with or without its unit), or if it is the
// key rounded to the number of decimals the student chose to write.

export interface ParsedNumber {
  value: number;
  // Decimals the student wrote; null for a fraction, which is exact.
  decimals: number | null;
}

const NUMBER = String.raw`\d+(?:[.,]\d+)*`;
const ANSWER = new RegExp(String.raw`^([+-])?\s*(${NUMBER})(?:\s*/\s*([+-])?\s*(${NUMBER}))?\s*[^\d/=]*$`);

// All the ways a digit string with separators can be read. More than one
// only when it's genuinely ambiguous: "1,050" is 1050 to some and 1.05 to
// others, and either could be what the student meant.
function readDigits(token: string, allowThousands: boolean): ParsedNumber[] {
  const separators = token.match(/[.,]/g) || [];
  if (separators.length === 0) return [{ value: Number(token), decimals: 0 }];

  if (separators.length === 1) {
    const [whole, frac] = token.split(/[.,]/);
    const asDecimal = { value: Number(`${whole}.${frac}`), decimals: frac.length };
    const looksLikeThousands = allowThousands && frac.length === 3 && whole.length <= 3 && whole !== '0';
    return looksLikeThousands ? [asDecimal, { value: Number(whole + frac), decimals: 0 }] : [asDecimal];
  }

  if (!allowThousands) return [];
  // Several separators: the last one is the decimal mark if it differs from
  // the others ("1.050,5", "1,050.5"); if they're all the same, they're all
  // thousands ("1,234,567"). Groups after the first must be 3 digits.
  const kinds = new Set(separators);
  const lastSep = separators[separators.length - 1];
  const decimalMark = kinds.size === 2 ? lastSep : null;
  if (kinds.size === 2 && separators.slice(0, -1).includes(lastSep)) return [];
  const [intPart, fracPart] = decimalMark ? [token.slice(0, token.lastIndexOf(decimalMark)), token.slice(token.lastIndexOf(decimalMark) + 1)] : [token, ''];
  const groups = intPart.split(/[.,]/);
  if (groups[0].length === 0 || groups[0].length > 3 || groups.slice(1).some((g) => g.length !== 3)) return [];
  const digits = groups.join('');
  return [fracPart ? { value: Number(`${digits}.${fracPart}`), decimals: fracPart.length } : { value: Number(digits), decimals: 0 }];
}

export function parseAnswer(raw: unknown): ParsedNumber[] {
  if (typeof raw !== 'string') return [];
  let s = raw.trim()
    // Minus signs from phone keyboards and word processors.
    .replace(/[−‒–—﹣－]/g, '-')
    // "x = 5", "R = 12": what matters is after the last '='.
    .replace(/^.*=\s*/, '')
    // Soles written in front: "S/ 120", "S/. 120".
    .replace(/^s\/\.?\s*/i, '')
    // Squared and cubed units typed without the superscript: "m2", "cm3".
    .replace(/\s*(?:[kcdm]?m|u)[23]\s*$/i, '');
  const m = s.match(ANSWER);
  if (!m) return [];
  const [, sign, num, denSign, den] = m;
  const negative = (sign === '-') !== (denSign === '-');

  if (den === undefined) {
    return readDigits(num, true).map((p) => ({ ...p, value: negative ? -p.value : p.value }));
  }
  // A fraction: its parts are read as plain decimals, never thousands.
  const [n] = readDigits(num, false);
  const [d] = readDigits(den, false);
  if (!n || !d || d.value === 0) return [];
  const value = n.value / d.value;
  return [{ value: negative ? -value : value, decimals: null }];
}

// The key is stored as a canonical string ("15", "-3.5", "16/3").
export function keyValue(key: unknown): number | null {
  const [first] = parseAnswer(String(key ?? ''));
  return first ? first.value : null;
}

const scaled = (x: number, decimals: number) => Math.sign(x) * Math.round(Math.abs(x) * 10 ** decimals + 1e-9);

export function isCorrectAnswer(answer: unknown, key: unknown): boolean {
  const expected = keyValue(key);
  if (expected === null) return false;
  return parseAnswer(answer).some(({ value, decimals }) => {
    if (decimals === null || decimals === 0) {
      return Math.abs(value - expected) <= 1e-9 * Math.max(1, Math.abs(expected));
    }
    // "5.3" or "5.33" for 16/3: right, if it's the key rounded to what
    // they wrote. "5.34" isn't; neither is "5" (that's a different number).
    return scaled(value, decimals) === scaled(expected, decimals);
  });
}
