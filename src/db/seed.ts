import 'dotenv/config';
import { db } from './index.ts';
import { schools } from './schema.ts';
import { eq } from 'drizzle-orm';

// One-time setup per school onboarded onto the platform. Run with:
// npx tsx src/db/seed.ts
async function seedSchool(name: string, slug: string, sections: string[]) {
  const existing = await db.select().from(schools).where(eq(schools.slug, slug));
  if (existing[0]) {
    console.log(`Ya existe el colegio "${existing[0].name}" (id ${existing[0].id}, slug "${slug}").`);
    return existing[0];
  }
  const [created] = await db.insert(schools).values({ name, slug, sections }).returning();
  console.log(`Colegio creado: "${created.name}" (id ${created.id}, slug "${slug}", secciones: ${JSON.stringify(sections)}).`);
  return created;
}

seedSchool('Colegio Ángeles de Jesús', 'angeles-de-jesus', ['A', 'B'])
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
