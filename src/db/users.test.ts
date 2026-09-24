import { beforeAll, describe, expect, it } from 'vitest';

// Real Postgres (PGlite, in memory), the same engine as local development.
// Set before importing the database module, which reads it at load time.
process.env.LOCAL_DATA_DIR = 'memory';
delete process.env.SQL_HOST;

const { databaseReady, db } = await import('./index.ts');
const { applyUserSync, createSchoolUser, getUserState, updateUserState, writeClaim } = await import('./users.ts');
const { schools } = await import('./schema.ts');

const MAX = 10_000_000;
let schoolId: number;
let n = 0;

async function student(coins = 0, tickets = 0) {
  const uid = `u${++n}`;
  await createSchoolUser({ uid, email: `${uid}@test.pe`, name: `Alumno ${n}`, schoolId, role: 'student', dni: `7000000${n}`, grade: '5to' });
  if (coins || tickets) await updateUserState(uid, { coins, tickets });
  return uid;
}

beforeAll(async () => {
  await databaseReady;
  const [school] = await db.insert(schools).values({ name: 'Colegio de prueba', slug: 'prueba', sections: ['A'] }).returning();
  schoolId = school.id;
});

describe('applyUserSync', () => {
  it('adds the change to what is stored, instead of overwriting it', async () => {
    const uid = await student(100, 10);
    const row = await applyUserSync(uid, {}, { coins: 30, tickets: -4 }, MAX);
    expect([row.coins, row.tickets]).toEqual([130, 6]);
  });

  // The bug this replaces: the device sent its own total, 350, and the 100
  // the teacher had just given was gone.
  it('keeps a reward granted on the server while the device was out of date', async () => {
    const uid = await student(350);
    await applyUserSync(uid, {}, { coins: 100 }, MAX);        // the teacher's reward
    const row = await applyUserSync(uid, {}, { coins: 20 }, MAX); // the student's own +20
    expect(row.coins).toBe(470);
  });

  it('never goes below zero or above the limit', async () => {
    const uid = await student(50);
    expect((await applyUserSync(uid, {}, { coins: -500 }, MAX)).coins).toBe(0);
    expect((await applyUserSync(uid, {}, { coins: MAX }, MAX)).coins).toBe(MAX);
  });

  it('writes the other fields as given, alongside the change', async () => {
    const uid = await student(10);
    const row = await applyUserSync(uid, { progress: 7, setupCompleted: true }, { coins: 5 }, MAX);
    expect([row.progress, row.setupCompleted, row.coins]).toEqual([7, true, 15]);
  });

  it('leaves coins and tickets alone when no change is sent for them', async () => {
    const uid = await student(40, 4);
    const row = await applyUserSync(uid, { progress: 3 }, {}, MAX);
    expect([row.coins, row.tickets]).toEqual([40, 4]);
  });

  it('applies concurrent changes one after the other, losing none', async () => {
    const uid = await student(0);
    await Promise.all(Array.from({ length: 20 }, () => applyUserSync(uid, {}, { coins: 5 }, MAX)));
    expect((await getUserState(uid))!.coins).toBe(100);
  });
});

describe('applyUserSync with a batch number', () => {
  const mark = (seq: number, device = 'dispositivo-a') => ({ device, seq });

  // A batch sent as the tab closed: it landed, but the device never saw
  // the answer and sends it again next session.
  it('applies a resent batch only once', async () => {
    const uid = await student(100);
    await applyUserSync(uid, {}, { coins: 30 }, MAX, mark(1));
    const again = await applyUserSync(uid, {}, { coins: 30 }, MAX, mark(1));
    expect(again.coins).toBe(130);
  });

  it('still writes the other fields of a resent batch', async () => {
    const uid = await student(100);
    await applyUserSync(uid, { progress: 4 }, { coins: 30 }, MAX, mark(1));
    const again = await applyUserSync(uid, { progress: 5 }, { coins: 30 }, MAX, mark(1));
    expect([again.coins, again.progress]).toEqual([130, 5]);
  });

  it('applies each new batch', async () => {
    const uid = await student(0);
    await applyUserSync(uid, {}, { coins: 10 }, MAX, mark(1));
    await applyUserSync(uid, {}, { coins: 10 }, MAX, mark(2));
    expect((await applyUserSync(uid, {}, { coins: 10 }, MAX, mark(3))).coins).toBe(30);
  });

  it('ignores an old batch that arrives late', async () => {
    const uid = await student(0);
    await applyUserSync(uid, {}, { coins: 10 }, MAX, mark(5));
    expect((await applyUserSync(uid, {}, { coins: 99 }, MAX, mark(4))).coins).toBe(10);
  });

  it('counts each device separately', async () => {
    const uid = await student(0);
    await applyUserSync(uid, {}, { coins: 10 }, MAX, mark(1, 'tablet-0001'));
    const row = await applyUserSync(uid, {}, { coins: 5 }, MAX, mark(1, 'laptop-0001'));
    expect(row.coins).toBe(15);
    expect(row.syncMarks).toEqual({ 'tablet-0001': 1, 'laptop-0001': 1 });
  });
});

describe('writeClaim', () => {
  const claimed = { codes: ['PROFE-2026'] };

  it('records the claim and pays it in one go', async () => {
    const uid = await student(10);
    const before = (await getUserState(uid))!.claims;
    const row = await writeClaim(uid, before, claimed, { coins: 50, tickets: 0 }, MAX);
    expect(row!.coins).toBe(60);
    expect(row!.claims).toEqual(claimed);
  });

  // Two taps on "Canjear" at once: both decided on the same unclaimed
  // record. Only the first may pay.
  it('pays once when two claims race on the same record', async () => {
    const uid = await student(0);
    const before = (await getUserState(uid))!.claims;
    const [a, b] = await Promise.all([
      writeClaim(uid, before, claimed, { coins: 50, tickets: 0 }, MAX),
      writeClaim(uid, before, claimed, { coins: 50, tickets: 0 }, MAX),
    ]);
    expect([a, b].filter(Boolean)).toHaveLength(1);
    expect((await getUserState(uid))!.coins).toBe(50);
  });

  it('refuses to write over claims that changed since they were read', async () => {
    const uid = await student(0);
    expect(await writeClaim(uid, { codes: ['OTRO'] }, claimed, { coins: 50, tickets: 0 }, MAX)).toBeNull();
  });
});

describe('createSchoolUser', () => {
  // Every account starts with a password someone else chose.
  it('marks a new account as having to change its password', async () => {
    const uid = await student();
    expect((await getUserState(uid))!.mustChangePassword).toBe(true);
  });
});
