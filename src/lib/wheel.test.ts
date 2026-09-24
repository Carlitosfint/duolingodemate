import { describe, expect, it } from 'vitest';
import { pickPrize, prizeUnderPointer, sliceBounds, spinTo } from './wheel.ts';
import { roulettePrizes } from '../data.ts';

describe('sliceBounds', () => {
  it('lays slices out by probability, covering the whole wheel', () => {
    const bounds = sliceBounds(roulettePrizes);
    expect(bounds[0]).toEqual({ start: 0, end: 108 });  // 30%
    expect(bounds[1].start).toBeCloseTo(108, 9);
    expect(bounds[bounds.length - 1].end).toBeCloseTo(360, 9);
  });
});

describe('spinTo', () => {
  // The bug: the wheel stopped on one prize and the student got another.
  it('always stops on the prize that is awarded, from any starting rotation', () => {
    let rotation = 0;
    for (let i = 0; i < 2000; i++) {
      const index = i % roulettePrizes.length;
      rotation = spinTo(rotation, roulettePrizes, index, Math.random());
      expect(prizeUnderPointer(roulettePrizes, rotation), `giro ${i}`).toBe(index);
    }
  });

  it('still stops on the right prize when the wheel starts somewhere odd', () => {
    for (const start of [37, -120, 1234.5, 359.99]) {
      for (let index = 0; index < roulettePrizes.length; index++) {
        expect(prizeUnderPointer(roulettePrizes, spinTo(start, roulettePrizes, index, 0.5))).toBe(index);
      }
    }
  });

  it('turns forward, several full turns', () => {
    const next = spinTo(100, roulettePrizes, 3, 0.2);
    expect(next - 100).toBeGreaterThanOrEqual(5 * 360);
    expect(next - 100).toBeLessThan(6 * 360);
  });

  it('never lands on the edge between two slices', () => {
    for (const rand of [0, 0.999999]) {
      for (let index = 0; index < roulettePrizes.length; index++) {
        const rotation = spinTo(0, roulettePrizes, index, rand);
        const angle = ((-rotation % 360) + 360) % 360;
        const { start, end } = sliceBounds(roulettePrizes)[index];
        expect(angle - start).toBeGreaterThan((end - start) * 0.1);
        expect(end - angle).toBeGreaterThan((end - start) * 0.1);
      }
    }
  });
});

describe('pickPrize', () => {
  it('follows the probabilities', () => {
    const counts = new Array(roulettePrizes.length).fill(0);
    const N = 100_000;
    for (let i = 0; i < N; i++) counts[pickPrize(roulettePrizes, (i + 0.5) / N)]++;
    roulettePrizes.forEach((p, i) => expect(counts[i] / N).toBeCloseTo(p.prob / 100, 3));
  });

  it('handles the ends of the range', () => {
    expect(pickPrize(roulettePrizes, 0)).toBe(0);
    expect(pickPrize(roulettePrizes, 0.99999)).toBe(roulettePrizes.length - 1);
  });
});
