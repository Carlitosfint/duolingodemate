import { db } from './index.ts';
import { schools, users } from './schema.ts';
import { desc, eq, sql } from 'drizzle-orm';

export async function getSchool(schoolId: number) {
  const result = await db.select().from(schools).where(eq(schools.id, schoolId));
  return result[0];
}

export async function getSchoolBySlug(slug: string) {
  const result = await db.select().from(schools).where(eq(schools.slug, slug));
  return result[0];
}

export async function getSchoolByEmailDomain(emailDomain: string) {
  const result = await db.select().from(schools).where(eq(schools.emailDomain, emailDomain));
  return result[0];
}

export async function updateSchool(schoolId: number, data: Partial<typeof schools.$inferInsert>) {
  const result = await db.update(schools).set(data).where(eq(schools.id, schoolId)).returning();
  return result[0];
}

// Every school plus headcounts, for the platform operator's console.
// Deliberately aggregate: the operator runs the platform, they have no
// business reading a student's name, DNI, progress or mistakes, so this
// counts rows instead of returning them.
export async function getSchoolsOverview() {
  const counts = await db
    .select({
      schoolId: users.schoolId,
      role: users.role,
      active: users.active,
      count: sql<number>`count(*)::int`,
    })
    .from(users)
    .groupBy(users.schoolId, users.role, users.active);

  const all = await db.select().from(schools).orderBy(desc(schools.createdAt));

  return all.map((school) => {
    const rows = counts.filter((c) => c.schoolId === school.id);
    const sum = (predicate: (r: typeof rows[number]) => boolean) =>
      rows.filter(predicate).reduce((n, r) => n + r.count, 0);
    return {
      ...school,
      students: sum((r) => r.role === 'student'),
      activeStudents: sum((r) => r.role === 'student' && r.active !== false),
      staff: sum((r) => r.role !== 'student'),
      activeStaff: sum((r) => r.role !== 'student' && r.active !== false),
    };
  });
}

export async function createSchool(data: typeof schools.$inferInsert) {
  const result = await db.insert(schools).values(data).returning();
  return result[0];
}

export async function deleteSchool(schoolId: number) {
  await db.delete(schools).where(eq(schools.id, schoolId));
}
