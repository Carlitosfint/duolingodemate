import { describe, expect, it } from 'vitest';
import { applyClaim, challengeValue, schoolToday, DAILY_CHALLENGES } from './claims.ts';

const codes = { 'PROFE-2026': 5 };
const rich = { coins: 900, tickets: 90, progress: 0, courseProgress: { razonamiento_5to: 40 }, stats: { solved: 80, maxStreak: 12 } };
const ctx = (over: Partial<Parameters<typeof applyClaim>[2]> = {}) => ({ today: '2026-09-24', inputs: rich, codes, ...over });

describe('daily challenges', () => {
  it('grants a completed challenge once', () => {
    const first = applyClaim({}, { kind: 'daily', id: 3 }, ctx());
    expect(first).toMatchObject({ ok: true, reward: { coins: 500, tickets: 0 } });
    const again = applyClaim(first.ok ? first.claims : null, { kind: 'daily', id: 3 }, ctx());
    expect(again).toMatchObject({ ok: false, status: 409 });
  });

  // The old bug: claimed challenges lived in memory, so a reload reset them.
  it('can be claimed again the next day, not the same day', () => {
    const today = applyClaim({}, { kind: 'daily', id: 1 }, ctx());
    const stored = today.ok ? today.claims : null;
    expect(applyClaim(stored, { kind: 'daily', id: 1 }, ctx()).ok).toBe(false);
    expect(applyClaim(stored, { kind: 'daily', id: 1 }, ctx({ today: '2026-09-25' })).ok).toBe(true);
  });

  it('refuses a challenge that is not completed yet', () => {
    const poor = { coins: 3, tickets: 0, progress: 0, courseProgress: {}, stats: { solved: 1, maxStreak: 1 } };
    for (const c of DAILY_CHALLENGES) {
      expect(applyClaim({}, { kind: 'daily', id: c.id }, ctx({ inputs: poor })), c.title).toMatchObject({ ok: false, status: 400 });
    }
  });

  it('pays the reward the server knows, not one the request names', () => {
    const r = applyClaim({}, { kind: 'daily', id: 4, reward: { amount: 99999 } }, ctx());
    expect(r).toMatchObject({ ok: true, reward: { coins: 0, tickets: 10 } });
  });

  it('rejects an unknown challenge', () => {
    expect(applyClaim({}, { kind: 'daily', id: 99 }, ctx())).toMatchObject({ ok: false, status: 400 });
  });

  it('keeps the coupons already redeemed when claiming a challenge', () => {
    const r = applyClaim({ codes: ['PROFE-2026'] }, { kind: 'daily', id: 2 }, ctx());
    expect(r.ok && r.claims.codes).toEqual(['PROFE-2026']);
  });
});

describe('coupon codes', () => {
  it('redeems a valid code once', () => {
    const first = applyClaim({}, { kind: 'code', code: ' PROFE-2026 ' }, ctx());
    expect(first).toMatchObject({ ok: true, reward: { coins: 50, tickets: 0 } });
    expect(applyClaim(first.ok ? first.claims : null, { kind: 'code', code: 'PROFE-2026' }, ctx()))
      .toMatchObject({ ok: false, status: 409, error: 'Ya canjeaste este código.' });
  });

  it('rejects a code that does not exist', () => {
    expect(applyClaim({}, { kind: 'code', code: 'INVENTADO' }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(applyClaim({}, { kind: 'code', code: '' }, ctx())).toMatchObject({ ok: false, status: 400 });
  });

  it('keeps today\'s claimed challenges when redeeming a code', () => {
    const stored = { daily: { date: '2026-09-24', ids: [1, 3] } };
    const r = applyClaim(stored, { kind: 'code', code: 'PROFE-2026' }, ctx());
    expect(r.ok && r.claims.daily).toEqual({ date: '2026-09-24', ids: [1, 3] });
  });
});

describe('robustness', () => {
  it('treats a missing or malformed record as empty', () => {
    for (const stored of [null, undefined, 'x', 5, { codes: 'no', daily: 3 }]) {
      expect(applyClaim(stored, { kind: 'code', code: 'PROFE-2026' }, ctx()).ok, JSON.stringify(stored)).toBe(true);
    }
  });

  it('rejects a request of an unknown kind', () => {
    expect(applyClaim({}, { kind: 'coins', amount: 1e6 }, ctx())).toMatchObject({ ok: false, status: 400 });
    expect(applyClaim({}, null, ctx())).toMatchObject({ ok: false, status: 400 });
  });
});

describe('challengeValue', () => {
  // "Alcanza Nivel 10" used to read only the 3rd-year course.
  it('measures the level on the course the student actually plays', () => {
    expect(challengeValue('level', { progress: 0, courseProgress: { trigonometria: 14 } })).toBe(14);
    expect(challengeValue('level', { progress: 22, courseProgress: {} })).toBe(22);
  });

  it('counts solved exercises, not map position', () => {
    expect(challengeValue('solved', { progress: 0, stats: { solved: 25 } })).toBe(25);
  });
});

describe('schoolToday', () => {
  it('uses Lima time: late evening there is still the same day', () => {
    // 02:00 UTC on the 25th is 21:00 on the 24th in Lima.
    expect(schoolToday(new Date('2026-09-25T02:00:00Z'))).toBe('2026-09-24');
    expect(schoolToday(new Date('2026-09-25T06:00:00Z'))).toBe('2026-09-25');
  });
});
