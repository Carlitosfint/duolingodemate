import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb, boolean, uniqueIndex } from 'drizzle-orm/pg-core';

// A tenant: one row per school using the platform. Every school-scoped
// table (users, and anything added later) carries a schoolId and every
// query must filter by it — that's what keeps schools' data isolated
// from each other on this shared database.
export const schools = pgTable('schools', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  // Section labels available to every grade at this school (e.g.
  // ["A", "B"]). Empty means the school doesn't use sections at all.
  sections: jsonb('sections').$type<string[]>().default([]),
  // Full domain the school chose for auto-generated student emails
  // (e.g. "aloe.com" -> 20265473@aloe.com). Null falls back to
  // "{slug}.alumno.com" until the school picks one.
  emailDomain: text('email_domain'),
  // Set at self-registration (see POST /api/schools/register). Kept for
  // billing/support contact even after the founding admin changes their
  // own name — never shown to students or used for login.
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  ruc: text('ruc'),
  studentsEstimate: integer('students_estimate'),
  plan: text('plan').default('piloto'),
  // 'active' | 'suspended'. Every self-registered school starts active
  // (the "payment" step is a placeholder for now); this is what a real
  // payment gateway would flip on a failed charge later.
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // Two schools sharing a domain would generate colliding student login
  // emails, so this is enforced the same way DNI is: unique, but only
  // where actually set (a school with no domain yet falls back to
  // "{slug}.alumno.com", which is already unique via the slug itself).
  emailDomainUnique: uniqueIndex('schools_email_domain_unique')
    .on(table.emailDomain)
    .where(sql`${table.emailDomain} is not null`),
})).enableRLS();

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  schoolId: integer('school_id').notNull().references(() => schools.id),
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  role: text('role').default('student'), // 'student' | 'teacher' | 'admin'
  // Student-only enrollment fields. National ID — required for
  // students, unique per school (catches double-registering the same
  // person by mistake); null for teacher/admin accounts.
  dni: text('dni'),
  grade: text('grade'), // '3ro' | '4to' | '5to'
  section: text('section'), // one of schools.sections, auto-assigned at creation
  coins: integer('coins').default(0),
  tickets: integer('tickets').default(0),
  progress: integer('progress').default(0),
  infiniteProgress: jsonb('infinite_progress').default({}),
  courseProgress: jsonb('course_progress').default({}),
  stats: jsonb('stats').default({
    solved: 0,
    failedAttempts: 0,
    totalGenerations: 0,
    boostsTriggered: 0,
    maxStreak: 0,
    distractions: 0,
    goldenWins: 0,
    legendaryWins: 0,
    supernovas: 0,
    exerciseTimes: [],
    ticketsByTopic: {}
  }),
  albums: jsonb('albums').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  setupCompleted: boolean('setup_completed').default(false),
  classroom: text('classroom').default(''),
  // Soft deactivation for someone who left the school (or an account
  // created by mistake). Deleting the row outright would take their
  // history with it and free a DNI that may still matter for a transfer,
  // so the row stays and the session is refused instead.
  active: boolean('active').default(true).notNull(),
}, (table) => ({
  // A DNI identifies one real person platform-wide, not per school — so
  // this is unique across every school, not scoped to schoolId. Partial:
  // only applies where dni is set, so teacher/admin rows (dni null)
  // never collide with each other or with students.
  dniUnique: uniqueIndex('users_dni_unique')
    .on(table.dni)
    .where(sql`${table.dni} is not null`),
})).enableRLS();

export const schoolsRelations = relations(schools, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  school: one(schools, { fields: [users.schoolId], references: [schools.id] }),
}));
