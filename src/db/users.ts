import { db } from './index.ts';
import { users } from './schema.ts';
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

export async function getUserState(uid: string) {
  const result = await db.select().from(users).where(eq(users.uid, uid));
  return result[0];
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
