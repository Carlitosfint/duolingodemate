import { db } from './index.ts';
import { schools } from './schema.ts';
import { eq } from 'drizzle-orm';

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

export async function createSchool(data: typeof schools.$inferInsert) {
  const result = await db.insert(schools).values(data).returning();
  return result[0];
}

export async function deleteSchool(schoolId: number) {
  await db.delete(schools).where(eq(schools.id, schoolId));
}
