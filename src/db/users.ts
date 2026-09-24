import { db } from './index.ts';
import { schools, users } from './schema.ts';
import { and, eq, ne, sql } from 'drizzle-orm';

// Accounts are provisioned by a school admin (see POST /api/admin/users),
// never self-registered, so this always runs with the caller's own
// schoolId — a brand-new row is never created without a tenant.
export async function createSchoolUser(params: {
  uid: string;
  email: string;
  name: string;
  schoolId: number;
  role: 'student' | 'teacher' | 'secretary' | 'admin';
  dni?: string;
  grade?: string;
  section?: string | null;
  classroom?: string;
}) {
  const result = await db.insert(users)
    .values({
      uid: params.uid,
      email: params.email,
      name: params.name,
      schoolId: params.schoolId,
      role: params.role,
      dni: params.dni,
      grade: params.grade,
      section: params.section,
      classroom: params.classroom,
      // Explicit rather than left to the column default: every account
      // created here comes with a temporary password someone else has seen.
      mustChangePassword: true,
    })
    .returning();

  return result[0];
}

// How many students of a given grade at this school are already in each
// section — used to put the next enrollment in whichever section is
// currently smallest, so sections fill up evenly regardless of the
// order students are registered in.
export async function countStudentsBySection(schoolId: number, grade: string) {
  const rows = await db
    .select({ section: users.section, count: sql<number>`count(*)::int` })
    .from(users)
    // Students on leave don't occupy a seat: counting them would make a
    // section look full and push every new enrollment into the other one.
    .where(and(eq(users.schoolId, schoolId), eq(users.grade, grade), eq(users.role, 'student'), eq(users.active, true)))
    .groupBy(users.section);
  return rows;
}

export async function updateUserState(uid: string, data: Partial<typeof users.$inferInsert>) {
  const result = await db.update(users)
    .set(data)
    .where(eq(users.uid, uid))
    .returning();
  return result[0];
}

// Writes a sync from the student's device. Coins and tickets arrive as
// changes, not totals, and are added in the database itself: a total from
// the device would erase anything granted on the server meanwhile — a
// teacher's reward given while the student is playing.
//
// With `mark`, the change is applied only if this device hasn't had a batch
// with that number applied before; the other fields are written either way
// (they're values, not changes, so repeating them is harmless).
export async function applyUserSync(
  uid: string,
  data: Partial<typeof users.$inferInsert>,
  deltas: { coins?: number; tickets?: number },
  max: number,
  mark?: { device: string; seq: number },
) {
  const hasDelta = deltas.coins !== undefined || deltas.tickets !== undefined;
  const set: Record<string, unknown> = { ...data };
  if (deltas.coins !== undefined) {
    set.coins = sql`GREATEST(0, LEAST(${max}, COALESCE(${users.coins}, 0) + ${deltas.coins}))`;
  }
  if (deltas.tickets !== undefined) {
    set.tickets = sql`GREATEST(0, LEAST(${max}, COALESCE(${users.tickets}, 0) + ${deltas.tickets}))`;
  }
  if (hasDelta && mark) {
    set.syncMarks = sql`jsonb_set(COALESCE(${users.syncMarks}, '{}'::jsonb), ARRAY[${mark.device}]::text[], to_jsonb(${mark.seq}::int), true)`;
    const applied = await db.update(users)
      .set(set as Partial<typeof users.$inferInsert>)
      .where(and(
        eq(users.uid, uid),
        sql`COALESCE((${users.syncMarks} ->> ${mark.device})::int, 0) < ${mark.seq}`,
      ))
      .returning();
    if (applied[0]) return applied[0];
    // Already applied: this is the same batch again.
    return Object.keys(data).length > 0 ? updateUserState(uid, data) : getUserState(uid);
  }
  if (Object.keys(set).length === 0) return getUserState(uid);
  const result = await db.update(users)
    .set(set as Partial<typeof users.$inferInsert>)
    .where(eq(users.uid, uid))
    .returning();
  return result[0];
}

// Records a claimed reward and pays it, in one statement — and only if the
// stored claims are still the ones the claim was decided on. Two requests
// for the same reward at once would otherwise both see it unclaimed.
// null: the claims changed in between; decide again and retry.
export async function writeClaim(
  uid: string,
  before: unknown,
  after: unknown,
  reward: { coins: number; tickets: number },
  max: number,
) {
  const set: Record<string, unknown> = {
    claims: after,
    coins: sql`GREATEST(0, LEAST(${max}, COALESCE(${users.coins}, 0) + ${reward.coins}))`,
    tickets: sql`GREATEST(0, LEAST(${max}, COALESCE(${users.tickets}, 0) + ${reward.tickets}))`,
  };
  const result = await db.update(users)
    .set(set as Partial<typeof users.$inferInsert>)
    .where(and(
      eq(users.uid, uid),
      sql`${users.claims} IS NOT DISTINCT FROM ${before === undefined || before === null ? null : JSON.stringify(before)}::jsonb`,
    ))
    .returning();
  return result[0] ?? null;
}

export async function getUserState(uid: string) {
  const result = await db.select().from(users).where(eq(users.uid, uid));
  return result[0];
}

// Local-only bootstrap used after a fresh clone. Firebase still authenticates
// the credentials; this only supplies the development profile/database row
// that would normally already exist in Supabase in a deployed environment.
export async function ensureLocalUser(params: { uid: string; email: string; name: string }) {
  const existing = await getUserState(params.uid);
  if (existing) return existing;

  await db.insert(schools).values({
    name: 'Colegio Ángeles de Jesús',
    slug: 'angeles-de-jesus-local',
    sections: ['A', 'B'],
    status: 'active',
  }).onConflictDoNothing({ target: schools.slug });

  const [school] = await db.select().from(schools).where(eq(schools.slug, 'angeles-de-jesus-local'));
  if (!school) throw new Error('No se pudo preparar el colegio local.');

  const requestedRole = process.env.LOCAL_DEV_ROLE;
  const role = requestedRole === 'admin' || requestedRole === 'teacher' || requestedRole === 'secretary'
    ? requestedRole
    : 'student';

  await db.insert(users).values({
    uid: params.uid,
    email: params.email,
    name: params.name,
    schoolId: school.id,
    role,
    // This is the developer's own Firebase account, with a password they
    // chose. Forcing a change here would change their real password.
    mustChangePassword: false,
  }).onConflictDoNothing({ target: users.uid });

  return getUserState(params.uid);
}

// DNI is unique platform-wide, so this is the lookup used to detect a
// student transferring in from another school on this same platform.
export async function getUserByDni(dni: string) {
  const result = await db.select().from(users).where(eq(users.dni, dni));
  return result[0];
}

export async function getAllStudents(schoolId: number) {
  const result = await db.select().from(users)
    .where(and(eq(users.role, 'student'), eq(users.schoolId, schoolId)));
  return result;
}

// Everyone at the school who isn't a student. Without this the admin could
// create a teacher and then never see the account again — no way to reset
// their password or give them leave.
export async function getSchoolStaff(schoolId: number) {
  const result = await db.select({
    uid: users.uid,
    name: users.name,
    email: users.email,
    role: users.role,
    active: users.active,
    classrooms: users.classrooms,
    createdAt: users.createdAt,
  })
    .from(users)
    .where(and(eq(users.schoolId, schoolId), ne(users.role, 'student')));
  return result;
}

// Guards against a school deactivating its last way in.
export async function countActiveAdmins(schoolId: number) {
  const result = await db.select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(and(eq(users.schoolId, schoolId), eq(users.role, 'admin'), eq(users.active, true)));
  return result[0]?.count ?? 0;
}
