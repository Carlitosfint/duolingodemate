import { db } from './index.ts';
import { users } from './schema.ts';
import { and, eq, sql } from 'drizzle-orm';

// Accounts are provisioned by a school admin (see POST /api/admin/users),
// never self-registered, so this always runs with the caller's own
// schoolId — a brand-new row is never created without a tenant.
export async function createSchoolUser(params: {
  uid: string;
  email: string;
  name: string;
  schoolId: number;
  role: 'student' | 'teacher' | 'admin';
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
    .where(and(eq(users.schoolId, schoolId), eq(users.grade, grade), eq(users.role, 'student')))
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

export async function getAllStudents(schoolId: number) {
  const result = await db.select().from(users)
    .where(and(eq(users.role, 'student'), eq(users.schoolId, schoolId)));
  return result;
}
