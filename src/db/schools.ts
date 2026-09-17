import { db } from './index.ts';
import { schools } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getSchool(schoolId: number) {
  const result = await db.select().from(schools).where(eq(schools.id, schoolId));
  return result[0];
}
