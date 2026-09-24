import { describe, expect, it } from 'vitest';
import { isCorrectAnswer, keyValue, parseAnswer } from './answers.ts';

const values = (raw: string) => parseAnswer(raw).map((p) => p.value);

describe('parseAnswer', () => {
  it('reads plain integers and decimals with a point or a comma', () => {
    expect(values('15')).toEqual([15]);
    expect(values('3.5')).toEqual([3.5]);
    expect(values('3,5')).toEqual([3.5]);
  });

  // parseFloat("-3,5") is -3: the comma used to cut the answer short.
  it('reads a negative decimal with a comma', () => {
    expect(values('-3,5')).toEqual([-3.5]);
  });

  it('reads fractions, including negative ones', () => {
    expect(values('16/3')[0]).toBeCloseTo(16 / 3, 12);
    expect(values('-7/2')).toEqual([-3.5]);
    expect(values('7/-2')).toEqual([-3.5]);
    expect(values('- 7 / 2')).toEqual([-3.5]);
  });

  it('accepts the minus sign phone keyboards produce', () => {
    expect(values('−3,5')).toEqual([-3.5]); // U+2212
    expect(values('–4')).toEqual([-4]);     // en dash
  });

  it('ignores the unit written after the number', () => {
    expect(values('35°')).toEqual([35]);
    expect(values('75%')).toEqual([75]);
    expect(values('12 cm')).toEqual([12]);
    expect(values('14 años')).toEqual([14]);
    expect(values('4,5 m²')).toEqual([4.5]);
    expect(values('4,5 m2')).toEqual([4.5]);
    expect(values('36cm3')).toEqual([36]);
    expect(values('9 u2')).toEqual([9]);
  });

  it('ignores soles written in front, and "x =" before the value', () => {
    expect(values('S/ 120')).toEqual([120]);
    expect(values('S/. 1,050.50')).toEqual([1050.5]);
    expect(values('x = 12')).toEqual([12]);
  });

  it('keeps both readings of "1,050", since either could be meant', () => {
    expect(values('1,050')).toEqual([1.05, 1050]);
    expect(values('1.050')).toEqual([1.05, 1050]);
  });

  it('reads thousands and a decimal mark together, either convention', () => {
    expect(values('1,050.5')).toEqual([1050.5]);
    expect(values('1.050,5')).toEqual([1050.5]);
    expect(values('1,234,567')).toEqual([1234567]);
  });

  it('rejects what is not a number', () => {
    for (const raw of ['', 'hola', '1/0', '3..5', '1,2,3', '12/', '/4', '5 + 3', '2x5', '1 2']) {
      expect(parseAnswer(raw), raw).toEqual([]);
    }
  });

  it('counts the decimals the student wrote, and marks fractions as exact', () => {
    expect(parseAnswer('5.30')[0].decimals).toBe(2);
    expect(parseAnswer('16/3')[0].decimals).toBeNull();
  });
});

describe('isCorrectAnswer', () => {
  it('matches an integer key exactly', () => {
    expect(isCorrectAnswer('15', '15')).toBe(true);
    expect(isCorrectAnswer('15.0', '15')).toBe(true);
    expect(isCorrectAnswer('30/2', '15')).toBe(true);
    expect(isCorrectAnswer('15.04', '15')).toBe(false);
    expect(isCorrectAnswer('14', '15')).toBe(false);
  });

  it('accepts a comma or a fraction for a decimal key', () => {
    for (const answer of ['-3.5', '-3,5', '−3,5', '-7/2', '-3.50']) {
      expect(isCorrectAnswer(answer, '-3.5'), answer).toBe(true);
    }
    expect(isCorrectAnswer('-3', '-3.5')).toBe(false);
    expect(isCorrectAnswer('-3.4', '-3.5')).toBe(false);
  });

  // The sector-area problems: r²θ/360 is often not exact.
  describe('a key that is a fraction (16/3 = 5.333…)', () => {
    it('accepts the fraction and any correct rounding', () => {
      for (const answer of ['16/3', '5.3', '5,3', '5.33', '5.333', '32/6']) {
        expect(isCorrectAnswer(answer, '16/3'), answer).toBe(true);
      }
    });

    it('rejects a wrong rounding and a different number', () => {
      for (const answer of ['5.34', '5.4', '5', '16', '6']) {
        expect(isCorrectAnswer(answer, '16/3'), answer).toBe(false);
      }
    });
  });

  // The old ±0.05 tolerance accepted 0.65 for 0.6.
  it('is not fooled by a nearby value on a small key', () => {
    expect(isCorrectAnswer('0.65', '0.6')).toBe(false);
    expect(isCorrectAnswer('0.6', '0.6')).toBe(true);
    expect(isCorrectAnswer('3/5', '0.6')).toBe(true);
  });

  it('rounds half away from zero, as taught in school', () => {
    expect(isCorrectAnswer('2.7', '2.65')).toBe(true);
    expect(isCorrectAnswer('-2.7', '-2.65')).toBe(true);
  });

  it('takes whichever reading of an ambiguous answer is right', () => {
    expect(isCorrectAnswer('1,050', '1050')).toBe(true);
    expect(isCorrectAnswer('1.050', '1050')).toBe(true);
    expect(isCorrectAnswer('S/ 1,050', '1050')).toBe(true);
  });

  it('marks as wrong anything that is not a number', () => {
    expect(isCorrectAnswer('no sé', '15')).toBe(false);
    expect(isCorrectAnswer('', '15')).toBe(false);
    expect(isCorrectAnswer(undefined, '15')).toBe(false);
  });

  it('never accepts anything against a broken key', () => {
    expect(isCorrectAnswer('15', 'undefined')).toBe(false);
    expect(isCorrectAnswer('15', '')).toBe(false);
  });
});

describe('keyValue', () => {
  it('reads every key format the generators produce', () => {
    expect(keyValue('15')).toBe(15);
    expect(keyValue('-3.5')).toBe(-3.5);
    expect(keyValue('16/3')).toBeCloseTo(5.3333, 4);
    expect(keyValue(12)).toBe(12);
  });
});
