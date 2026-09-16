import { db } from './index.ts';
import { users } from './schema.ts';
import { and, eq } from 'drizzle-orm';

// Accounts are provisioned by a school admin/teacher (see POST
// /api/admin/users), never self-registered, so this always runs with
// the caller's own schoolId — a brand-new row is never created without
// a tenant.
export async function createSchoolUser(params: {
  uid: string;
  email: string;
  name: string;
  schoolId: number;
  role: 'student' | 'teacher' | 'admin';
}) {
  const result = await db.insert(users)
    .values({
      uid: params.uid,
      email: params.email,
      name: params.name,
      schoolId: params.schoolId,
      role: params.role,
    })
    .returning();

  return result[0];
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
