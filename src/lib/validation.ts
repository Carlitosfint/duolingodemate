// Normalizing and bounding whatever arrives from a client. Extracted from
// server.ts so each rule can be tested directly.

export const VALID_GRADES = ['3ro', '4to', '5to'];

export const EMAIL_DOMAIN_REGEX = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_CURRENCY = 10_000_000;
export const MAX_PROGRESS = 100;
export const MAX_MISTAKES = 50;

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
