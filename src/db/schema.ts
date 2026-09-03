import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  avatar: text('avatar'),
  role: text('role').default('student'), // 'student' or 'teacher'
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
});
