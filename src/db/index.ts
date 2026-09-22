import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite';
import { Pool } from 'pg';
import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import path from 'node:path';
import * as schema from './schema.ts';
import { sql } from 'drizzle-orm';

declare global {
  var _postgresPool: Pool | undefined;
}

export const isEmbeddedDatabase = !process.env.SQL_HOST && process.env.NODE_ENV !== 'production';

// Supabase (and most managed Postgres) require SSL on the connection.
// Local/dev Postgres usually doesn't support it at all, so it's opt-out
// via SQL_SSL=false rather than opt-in.
const sslEnabled = process.env.SQL_SSL !== 'false';

export const createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new Pool({
      host: process.env.SQL_HOST,
      port: process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      ssl: sslEnabled ? { rejectUnauthorized: false } : false,
      max: 10,
      connectionTimeoutMillis: 15000,
    });

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

function createDatabase() {
  if (!isEmbeddedDatabase) {
    if (!process.env.SQL_HOST) {
      throw new Error('SQL_HOST es obligatorio en producción. Configura las variables SQL_* antes de iniciar.');
    }
    return { database: drizzle(createPool(), { schema }), ready: Promise.resolve() };
  }

  // A real PostgreSQL engine, embedded in the Node process. This keeps local
  // development usable after a fresh clone without silently changing the
  // production database path or requiring Docker/Postgres to be installed.
  const localDataDirectory = path.resolve('.local-data');
  fs.mkdirSync(localDataDirectory, { recursive: true });
  const client = new PGlite(path.join(localDataDirectory, 'postgres'));
  const ready = client.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id serial PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      sections jsonb DEFAULT '[]'::jsonb,
      email_domain text,
      contact_name text,
      contact_email text,
      contact_phone text,
      ruc text,
      students_estimate integer,
      plan text DEFAULT 'piloto',
      status text DEFAULT 'active',
      created_at timestamp DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS schools_email_domain_unique
      ON schools (email_domain) WHERE email_domain IS NOT NULL;

    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      uid text NOT NULL UNIQUE,
      school_id integer NOT NULL REFERENCES schools(id),
      email text NOT NULL,
      name text,
      avatar text,
      role text DEFAULT 'student',
      dni text,
      grade text,
      section text,
      coins integer DEFAULT 0,
      tickets integer DEFAULT 0,
      progress integer DEFAULT 0,
      infinite_progress jsonb DEFAULT '{}'::jsonb,
      course_progress jsonb DEFAULT '{}'::jsonb,
      stats jsonb DEFAULT '{"solved":0,"failedAttempts":0,"totalGenerations":0,"boostsTriggered":0,"maxStreak":0,"distractions":0,"goldenWins":0,"legendaryWins":0,"supernovas":0,"exerciseTimes":[],"ticketsByTopic":{}}'::jsonb,
      albums jsonb DEFAULT '{}'::jsonb,
      mistakes jsonb DEFAULT '[]'::jsonb,
      created_at timestamp DEFAULT now(),
      setup_completed boolean DEFAULT false,
      classroom text DEFAULT '',
      classrooms jsonb DEFAULT '[]'::jsonb,
      active boolean DEFAULT true NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_dni_unique
      ON users (dni) WHERE dni IS NOT NULL;
  `).then(() => {
    console.log(`Base de datos local lista en ${localDataDirectory}`);
  });
  return { database: drizzlePglite(client, { schema }), ready };
}

// Both drivers expose the same Drizzle query surface. The annotation avoids
// leaking a union of two driver-specific session types into every repository.
const created = createDatabase();
export const db: ReturnType<typeof drizzle> = created.database as ReturnType<typeof drizzle>;
export const databaseReady = created.ready;

export async function checkDatabase() {
  await databaseReady;
  await db.execute(sql`select 1`);
}
