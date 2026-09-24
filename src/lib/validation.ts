// Normalizing and bounding whatever arrives from a client. Extracted from
// server.ts so each rule can be tested directly.

export const VALID_GRADES = ['3ro', '4to', '5to'];

export const EMAIL_DOMAIN_REGEX = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_CURRENCY = 10_000_000;
export const MAX_PROGRESS = 100;
export const MAX_MISTAKES = 50;
export const MAX_NAME_LENGTH = 120;
export const MAX_DNI_LENGTH = 20;
export const MAX_SECTION_LENGTH = 20;
export const MAX_SECTIONS = 40;

// "Colegio Ángeles de Jesús" -> "colegio-angeles-de-jesus". Same shape as
// the slugs seeded by hand in src/db/seed.ts, so both paths produce URLs and
// fallback domains that look alike.
export function slugify(name: string): string {
  const base = name
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'colegio';
}

// The school types either an alias ("aloe") or a full domain ("aloe.com");
// either way we end up with a real-looking domain for student emails.
export function normalizeEmailDomain(raw: string): string {
  let domain = raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^@/, '').replace(/\/.*$/, '');
  if (domain && !domain.includes('.')) domain += '.com';
  return domain;
}

// A school's chosen domain (e.g. "aloe.com" -> 20265473@aloe.com), or
// "{slug}.alumno.com" until it picks one.
export function studentEmailDomain(school: { slug?: string; emailDomain?: string | null } | undefined): string {
  return school?.emailDomain || `${school?.slug || 'colegio'}.alumno.com`;
}

// Deliberately not DNI-based — a login address shouldn't expose the
// student's national ID. {year}{4 random digits}, e.g. "20265473". Not
// unique on its own, so callers retry on a Firebase collision.
export function generateStudentLocalPart(now: Date = new Date()): string {
  return `${now.getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
}

export function isUniqueViolation(error: any): boolean {
  return error?.cause?.code === '23505' || error?.code === '23505';
}

// The game runs in the browser, so these numbers arrive from the client.
// Clamped rather than trusted: a student poking at the endpoint can still be
// wrong, but not absurd (negative coins, progress past the end of the map).
export function clampInt(value: unknown, max: number): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.min(max, Math.max(0, Math.floor(value)));
}

// A change to a balance ("+30 coins since the last sync"), as opposed to the
// balance itself. Bounded both ways; the column is clamped again on write.
export function clampDelta(value: unknown, max: number): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(-max, Math.min(max, Math.trunc(value)));
}

// Which device sent a sync batch, and its number — so the server can tell
// a batch it already applied (resent after a lost answer) from a new one.
export function cleanSyncMark(body: any): { device: string; seq: number } | undefined {
  const device = body?.deviceId;
  const seq = body?.seq;
  if (typeof device !== 'string' || !/^[a-z0-9-]{8,40}$/i.test(device)) return undefined;
  if (typeof seq !== 'number' || !Number.isInteger(seq) || seq < 1 || seq > 2_147_483_647) return undefined;
  return { device, seq };
}

export function plainObject(value: unknown): Record<string, any> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, any>) : undefined;
}

// Free text written by the client, so each field is length-capped and the
// list is trimmed: without a bound this column grows without limit.
export function cleanMistakes(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  const str = (v: any, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  return value.slice(0, MAX_MISTAKES).map((m: any) => ({
    problem: str(m?.problem, 600),
    userAnswer: str(m?.userAnswer, 60),
    correctAnswer: str(m?.correctAnswer, 60),
    explanation: str(m?.explanation, 1200),
    topic: str(m?.topic, 60),
  }));
}

export type StudentUpdateResult =
  | { updates: Record<string, unknown>; error?: never }
  | { updates?: never; error: string };

// Validates editable student fields before they reach Drizzle.
export function cleanStudentUpdates(body: unknown, allowedFields: readonly string[]): StudentUpdateResult {
  const input = plainObject(body);
  if (!input) return { error: 'El cuerpo de la solicitud debe ser un objeto JSON.' };

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (!(field in input) || field === 'classroom') continue;
    const value = input[field];

    if (field === 'coins' || field === 'tickets' || field === 'progress') {
      const cleaned = clampInt(value, field === 'progress' ? MAX_PROGRESS : MAX_CURRENCY);
      if (cleaned === undefined) return { error: `${field} debe ser un número válido.` };
      updates[field] = cleaned;
      continue;
    }
    if (field === 'name') {
      if (typeof value !== 'string' || !value.trim()) return { error: 'El nombre no puede quedar vacío.' };
      updates.name = value.trim().slice(0, MAX_NAME_LENGTH);
      continue;
    }
    if (field === 'dni') {
      if (typeof value !== 'string' || !value.trim()) return { error: 'El DNI no puede quedar vacío.' };
      updates.dni = value.trim().slice(0, MAX_DNI_LENGTH);
      continue;
    }
    if (field === 'grade') {
      if (typeof value !== 'string' || !VALID_GRADES.includes(value)) return { error: 'Grado inválido.' };
      updates.grade = value;
      continue;
    }
    if (field === 'section') {
      if (value !== null && typeof value !== 'string') return { error: 'Sección inválida.' };
      updates.section = typeof value === 'string' && value.trim()
        ? value.trim().slice(0, MAX_SECTION_LENGTH)
        : null;
      continue;
    }
    if (field === 'avatar') {
      if (typeof value !== 'string' || !value.trim()) return { error: 'Avatar inválido.' };
      updates.avatar = value.trim().slice(0, 40);
    }
  }
  return { updates };
}

export function cleanSections(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .map((section) => typeof section === 'string' ? section.trim().slice(0, MAX_SECTION_LENGTH) : '')
    .filter(Boolean)
    .filter((section, index, all) => all.indexOf(section) === index)
    .slice(0, MAX_SECTIONS);
}
