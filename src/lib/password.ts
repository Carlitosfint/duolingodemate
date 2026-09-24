// What a password has to be. Shared by the server, which enforces it, and
// by the change-password screen, which shows each rule ticking as the
// person types — so both always agree on what "valid" means.

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

// The first things a 14-year-old tries when told "letters and numbers".
// Not a real breach list, just the obvious ones in this context.
const COMMON = new Set([
  'password1', 'password123', 'contraseña1', 'contrasena1', 'contraseña123', 'contrasena123',
  'qwerty123', 'abc12345', 'abcd1234', 'a1234567', '12345678a', 'asdf1234',
  'colegio123', 'colegio2026', 'alumno123', 'peru1234', 'peru2026', 'iloveyou1', 'teamo123',
]);

export interface PasswordIdentity {
  email?: string | null;
  dni?: string | null;
}

export interface PasswordCheck {
  id: 'length' | 'mix' | 'personal';
  label: string;
  ok: boolean;
}

const LETTER = /[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]/;
const DIGIT = /\d/;

export function passwordChecks(password: string, identity: PasswordIdentity = {}): PasswordCheck[] {
  const lower = password.toLowerCase();
  const dni = (identity.dni || '').trim().toLowerCase();
  // The part before the @ is the student's login code (20265473) or, for
  // staff, their name — either way something the whole class can see.
  const local = (identity.email || '').split('@')[0].trim().toLowerCase();
  const containsPersonal = (dni.length >= 6 && lower.includes(dni)) || (local.length >= 5 && lower.includes(local));
  return [
    {
      id: 'length',
      label: `Al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      ok: password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH,
    },
    { id: 'mix', label: 'Letras y números', ok: LETTER.test(password) && DIGIT.test(password) },
    { id: 'personal', label: 'Que no incluya tu DNI ni tu correo', ok: password.length > 0 && !containsPersonal },
  ];
}

// null when the password is acceptable; otherwise the message to show.
export function passwordProblem(password: unknown, identity: PasswordIdentity = {}): string | null {
  if (typeof password !== 'string' || password.length === 0) return 'Escribe una contraseña.';
  if (password.length > MAX_PASSWORD_LENGTH) return `La contraseña puede tener como máximo ${MAX_PASSWORD_LENGTH} caracteres.`;
  if (password.trim() !== password) return 'La contraseña no puede empezar ni terminar con espacios.';
  const failed = passwordChecks(password, identity).find((c) => !c.ok);
  if (failed?.id === 'length') return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  if (failed?.id === 'mix') return 'La contraseña debe tener letras y números.';
  if (failed?.id === 'personal') return 'La contraseña no puede incluir tu DNI ni tu correo: es lo primero que alguien probaría.';
  if (COMMON.has(password.toLowerCase())) return 'Esa contraseña es demasiado común. Elige otra.';
  return null;
}
