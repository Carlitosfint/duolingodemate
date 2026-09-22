import { describe, expect, it } from 'vitest';
import {
  clampInt,
  cleanMistakes,
  normalizeEmailDomain,
  plainObject,
  slugify,
  studentEmailDomain,
  EMAIL_DOMAIN_REGEX,
  EMAIL_REGEX,
  MAX_CURRENCY,
  MAX_MISTAKES,
  MAX_PROGRESS,
  MAX_SECTIONS,
  cleanSections,
  cleanStudentUpdates,
} from './validation.ts';

describe('slugify', () => {
  it('strips accents so the slug matches the hand-seeded ones', () => {
    expect(slugify('Colegio Ángeles de Jesús')).toBe('colegio-angeles-de-jesus');
    expect(slugify('Institución Educativa Ñandú')).toBe('institucion-educativa-nandu');
  });

  it('collapses punctuation and trims the edges', () => {
    expect(slugify('  ¡San Martín!  ')).toBe('san-martin');
    expect(slugify('A -- B')).toBe('a-b');
  });

  it('always returns something usable', () => {
    expect(slugify('')).toBe('colegio');
    expect(slugify('¿¡!?')).toBe('colegio');
  });

  it('bounds the length', () => {
    expect(slugify('x'.repeat(200)).length).toBeLessThanOrEqual(60);
  });
});

describe('normalizeEmailDomain', () => {
  it('turns a bare alias into a domain', () => {
    expect(normalizeEmailDomain('aloe')).toBe('aloe.com');
  });

  it('accepts a domain as typed', () => {
    expect(normalizeEmailDomain('aloe.edu.pe')).toBe('aloe.edu.pe');
  });

  it('forgives the ways people paste a domain', () => {
    expect(normalizeEmailDomain('  HTTPS://Aloe.com/algo ')).toBe('aloe.com');
    expect(normalizeEmailDomain('@aloe.com')).toBe('aloe.com');
  });

  it('produces something the domain check accepts', () => {
    for (const raw of ['aloe', 'aloe.com', '@Aloe.EDU.pe', 'https://aloe.com/x']) {
      expect(EMAIL_DOMAIN_REGEX.test(normalizeEmailDomain(raw))).toBe(true);
    }
  });
});

describe('studentEmailDomain', () => {
  it('prefers the domain the school chose', () => {
    expect(studentEmailDomain({ slug: 'angeles', emailDomain: 'angeles.edu.pe' })).toBe('angeles.edu.pe');
  });

  it('falls back to the slug until the school picks one', () => {
    expect(studentEmailDomain({ slug: 'angeles', emailDomain: null })).toBe('angeles.alumno.com');
    expect(studentEmailDomain(undefined)).toBe('colegio.alumno.com');
  });
});

describe('EMAIL_REGEX', () => {
  it('accepts ordinary addresses', () => {
    for (const email of ['marta@colegio.edu.pe', '20265473@aloe.com']) {
      expect(EMAIL_REGEX.test(email)).toBe(true);
    }
  });

  it('rejects what is clearly not one', () => {
    for (const email of ['', 'marta', 'marta@', '@colegio.com', 'marta@colegio', 'a b@c.com']) {
      expect(EMAIL_REGEX.test(email)).toBe(false);
    }
  });
});

// The game runs in the browser, so these numbers arrive from the client.
describe('clampInt', () => {
  it('bounds absurd values instead of storing them', () => {
    expect(clampInt(999_999_999, MAX_CURRENCY)).toBe(MAX_CURRENCY);
    expect(clampInt(5000, MAX_PROGRESS)).toBe(MAX_PROGRESS);
  });

  it('refuses negatives', () => {
    expect(clampInt(-50, MAX_CURRENCY)).toBe(0);
  });

  it('keeps a legitimate value untouched', () => {
    expect(clampInt(22, MAX_PROGRESS)).toBe(22);
    expect(clampInt(1250, MAX_CURRENCY)).toBe(1250);
  });

  it('ignores anything that is not a real number, so the field is left alone', () => {
    for (const value of ['1e9', NaN, Infinity, null, undefined, {}, [], true]) {
      expect(clampInt(value, MAX_CURRENCY)).toBeUndefined();
    }
  });

  it('floors fractions', () => {
    expect(clampInt(10.9, MAX_CURRENCY)).toBe(10);
  });
});

describe('plainObject', () => {
  it('accepts an object', () => {
    expect(plainObject({ solved: 3 })).toEqual({ solved: 3 });
  });

  it('rejects arrays and primitives, which would corrupt a jsonb column', () => {
    for (const value of [[1, 2], 'x', 5, null, undefined]) {
      expect(plainObject(value)).toBeUndefined();
    }
  });
});

describe('cleanMistakes', () => {
  const mistake = (over: Record<string, unknown> = {}) => ({
    problem: 'Un problema', userAnswer: '5', correctAnswer: '7',
    explanation: 'Porque sí', topic: 'Edades', ...over,
  });

  it('keeps a well-formed entry', () => {
    expect(cleanMistakes([mistake()])).toEqual([mistake()]);
  });

  it('caps the list so the column cannot grow without limit', () => {
    const many = Array.from({ length: 200 }, () => mistake());
    expect(cleanMistakes(many)).toHaveLength(MAX_MISTAKES);
  });

  it('truncates long free text', () => {
    const [cleaned] = cleanMistakes([mistake({ problem: 'x'.repeat(5000), explanation: 'y'.repeat(5000) })])!;
    expect(cleaned.problem.length).toBe(600);
    expect(cleaned.explanation.length).toBe(1200);
  });

  it('replaces non-string fields with empty strings rather than storing them', () => {
    const [cleaned] = cleanMistakes([{ problem: 42, topic: { a: 1 }, userAnswer: null }])!;
    expect(cleaned).toEqual({ problem: '', userAnswer: '', correctAnswer: '', explanation: '', topic: '' });
  });

  it('ignores anything that is not a list', () => {
    for (const value of [{}, 'x', 5, null, undefined]) {
      expect(cleanMistakes(value)).toBeUndefined();
    }
  });
});

describe('cleanStudentUpdates', () => {
  const allowed = ['name', 'dni', 'grade', 'section', 'classroom', 'avatar', 'coins', 'tickets', 'progress'];

  it('normalizes text and clamps game values', () => {
    expect(cleanStudentUpdates({
      name: '  Ana Pérez  ', dni: ' 12345678 ', grade: '4to', section: ' A ',
      avatar: ' fox ', coins: -5, tickets: 999_999_999, progress: 101,
    }, allowed)).toEqual({ updates: {
      name: 'Ana Pérez', dni: '12345678', grade: '4to', section: 'A',
      avatar: 'fox', coins: 0, tickets: MAX_CURRENCY, progress: MAX_PROGRESS,
    } });
  });

  it('rejects malformed JSON bodies instead of throwing a server error', () => {
    for (const body of [null, [], 'x', 3]) {
      expect(cleanStudentUpdates(body, allowed)).toHaveProperty('error');
    }
  });

  it('rejects invalid grades and non-numeric progress', () => {
    expect(cleanStudentUpdates({ grade: '6to' }, allowed)).toEqual({ error: 'Grado inválido.' });
    expect(cleanStudentUpdates({ progress: '100' }, allowed)).toHaveProperty('error');
  });

  it('never trusts the derived classroom field from the client', () => {
    expect(cleanStudentUpdates({ classroom: 'Colegio ajeno' }, allowed)).toEqual({ updates: {} });
  });
});

describe('cleanSections', () => {
  it('trims, deduplicates and bounds school sections', () => {
    const raw = [' A ', 'A', ...Array.from({ length: 100 }, (_, i) => `S${i}`)];
    const result = cleanSections(raw)!;
    expect(result[0]).toBe('A');
    expect(result).toHaveLength(MAX_SECTIONS);
  });

  it('rejects non-arrays', () => {
    expect(cleanSections('A')).toBeUndefined();
  });
});
