import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string) {
  const result = await db.insert(users)
    .values({
      uid,
      email,
      name,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        name,
      },
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

export async function getAllStudents() {
  const result = await db.select().from(users).where(eq(users.role, 'student'));
  return result;
}
