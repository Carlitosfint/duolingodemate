import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import { canManageEnrollment, editableFieldsFor, visibleStudentsFor, ENROLLMENT_FIELDS } from './src/lib/permissions.ts';
import {
  VALID_GRADES, EMAIL_REGEX, EMAIL_DOMAIN_REGEX, MAX_CURRENCY, MAX_PROGRESS,
  slugify, normalizeEmailDomain, studentEmailDomain, generateStudentLocalPart,
  isUniqueViolation, clampInt, clampDelta, cleanSyncMark, plainObject, cleanMistakes, cleanSections, cleanStudentUpdates,
} from './src/lib/validation.ts';
import { passwordProblem } from './src/lib/password.ts';
import { buildTutorPrompt, cleanTutorInput, createRateLimiter } from './src/lib/tutor.ts';
import { applyClaim, schoolToday } from './src/lib/claims.ts';
import { PROMO_CODES } from './src/lib/promoCodes.ts';

// How recent a sign-in must be to change your own password.
const RECENT_SIGN_IN_SECONDS = 10 * 60;

// Readable temp password (no ambiguous 0/O/1/l), handed to the admin
// once at account-creation time and never stored in plain text.
function generateTempPassword(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.randomFillSync(new Uint8Array(10)))
    .map((b) => alphabet[b % alphabet.length])
    .join("");
}

const isDniConflict = isUniqueViolation;

async function startServer() {
  const app = express();
  // Hosts other than the current one (Render, Railway, Cloud Run run
  // directly) say which port to listen on through PORT.
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Database endpoints
  const { requireAuth, requirePlatformAdmin, isPlatformAdminEmail } = await import('./src/middleware/auth.ts');
  const { databaseReady, checkDatabase, isEmbeddedDatabase } = await import('./src/db/index.ts');
  const { getUserState, updateUserState, applyUserSync, writeClaim, getAllStudents, createSchoolUser, countStudentsBySection, getUserByDni, countActiveAdmins, getSchoolStaff } = await import('./src/db/users.ts');
  const { getSchool, updateSchool, createSchool, getSchoolBySlug, getSchoolByEmailDomain, deleteSchool, getSchoolsOverview } = await import('./src/db/schools.ts');
  const { adminAuth } = await import('./src/lib/firebase-admin.ts');
  await databaseReady;

  app.get('/api/health', async (_req, res) => {
    try {
      await checkDatabase();
      res.json({ status: 'ok', database: isEmbeddedDatabase ? 'embedded' : 'postgres' });
    } catch (error) {
      console.error('Health check de base de datos falló:', error);
      res.status(503).json({ status: 'error', database: 'unavailable' });
    }
  });

  // Section with the fewest students of this grade at this school right
  // now — keeps sections balanced no matter what order students enroll
  // in. Returns null if the school doesn't use sections.
  async function assignSection(schoolId: number, grade: string, sections: string[]): Promise<string | null> {
    if (!sections || sections.length === 0) return null;
    const counts = await countStudentsBySection(schoolId, grade);
    const countBySection = new Map(counts.map((c) => [c.section, c.count]));
    let best = sections[0];
    let bestCount = countBySection.get(best) ?? 0;
    for (const s of sections) {
      const c = countBySection.get(s) ?? 0;
      if (c < bestCount) { best = s; bestCount = c; }
    }
    return best;
  }

  async function createStudentAccount(params: {
    schoolId: number; firstName: string; lastName: string; dni: string; grade: string; customEmail: string;
  }) {
    const { schoolId, firstName, lastName, dni, grade, customEmail } = params;
    const name = `${firstName} ${lastName}`;
    const school = await getSchool(schoolId);
    const section = await assignSection(schoolId, grade, school?.sections || []);
    const tempPassword = generateTempPassword();

    let email = customEmail;
    let firebaseUser;
    if (email) {
      firebaseUser = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
    } else {
      // The random local part isn't guaranteed unique on its own (unlike
      // the old DNI-based one), so retry with a fresh one on collision.
      const domain = studentEmailDomain(school);
      const MAX_ATTEMPTS = 10;
      let lastError: any;
      for (let attempt = 0; attempt < MAX_ATTEMPTS && !firebaseUser; attempt++) {
        const candidate = `${generateStudentLocalPart()}@${domain}`;
        try {
          firebaseUser = await adminAuth.createUser({ email: candidate, password: tempPassword, displayName: name });
          email = candidate;
        } catch (err: any) {
          if (err?.code !== 'auth/email-already-exists') throw err;
          lastError = err;
        }
      }
      if (!firebaseUser) throw lastError;
    }

    try {
      const dbUser = await createSchoolUser({
        uid: firebaseUser.uid, email: email!, name, schoolId, role: 'student',
        dni, grade, section, classroom: section ? `${grade} ${section}` : grade,
      });
      return { dbUser, tempPassword, email: email! };
    } catch (error) {
      // The Firebase account exists (email/password work) but has no DB
      // row and the caller never sees the password — e.g. a DNI conflict,
      // caught only now that we try to insert. Without this, that email
      // is permanently stuck: taken in Firebase, unusable everywhere else.
      await adminAuth.deleteUser(firebaseUser.uid).catch((e) => console.error('Rollback (firebase user) falló:', e));
      throw error;
    }
  }

  // Appends "-2", "-3"... until the slug is free. A brand-new school
  // registering itself is the only caller that doesn't already know its
  // slug is unique (every other slug in the codebase is seeded by hand).
  async function resolveUniqueSlug(base: string): Promise<string> {
    let candidate = base;
    for (let n = 2; await getSchoolBySlug(candidate); n++) {
      candidate = `${base}-${n}`;
    }
    return candidate;
  }

  // Public: how a new school joins the platform. No auth — there's no
  // account yet. Creates the school row, the founding admin's Firebase
  // account (their real contact email, not a generated alias — this is
  // staff, like any teacher/secretary created later), and their DB user
  // row, in that order so a failure partway through never leaves a
  // school with no admin able to log into it: if a later step fails, the
  // steps already done are unwound (best-effort) before returning.
  app.post("/api/schools/register", async (req: any, res) => {
    // Honeypot: a field real users never see or fill (hidden off-screen in
    // the form). Any value here means a bot filled every field blindly —
    // reject without hinting why, before touching the DB or Firebase.
    if (String(req.body?.website || '').trim()) {
      return res.status(400).json({ error: "No se pudo procesar tu solicitud." });
    }

    const schoolName = String(req.body?.schoolName || '').trim().slice(0, 200);
    const emailAliasRaw = String(req.body?.emailAlias || '').trim().slice(0, 100);
    const contactName = String(req.body?.contactName || '').trim().slice(0, 200);
    const contactEmail = String(req.body?.contactEmail || '').trim().toLowerCase().slice(0, 200);
    const contactPhone = String(req.body?.contactPhone || '').trim().slice(0, 30);
    const ruc = String(req.body?.ruc || '').trim().slice(0, 20);
    const studentsEstimateRaw = req.body?.studentsEstimate;

    if (!schoolName || !emailAliasRaw || !contactName || !contactEmail || !contactPhone) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }
    if (!EMAIL_REGEX.test(contactEmail)) {
      return res.status(400).json({ error: "El correo de contacto no es válido." });
    }
    const emailDomain = normalizeEmailDomain(emailAliasRaw);
    if (!EMAIL_DOMAIN_REGEX.test(emailDomain)) {
      return res.status(400).json({ error: 'El alias de correo no es válido (ej. "aloe" o "aloe.com").' });
    }
    let studentsEstimate: number | null = null;
    if (studentsEstimateRaw !== undefined && studentsEstimateRaw !== null && studentsEstimateRaw !== '') {
      const n = Number(studentsEstimateRaw);
      if (!Number.isFinite(n) || n < 0) {
        return res.status(400).json({ error: "La cantidad de alumnos no es válida." });
      }
      studentsEstimate = Math.round(n);
    }

    if (await getSchoolByEmailDomain(emailDomain)) {
      return res.status(409).json({ error: "Ese alias de correo ya lo usa otro colegio. Elige otro." });
    }

    const slug = await resolveUniqueSlug(slugify(schoolName));

    let school;
    try {
      school = await createSchool({
        name: schoolName,
        slug,
        emailDomain,
        sections: [],
        contactName,
        contactEmail,
        contactPhone,
        ruc: ruc || null,
        studentsEstimate,
        plan: 'piloto',
        status: 'active',
      });
    } catch (error: any) {
      console.error(error);
      if (isUniqueViolation(error)) {
        return res.status(409).json({ error: "Ese alias de correo ya lo usa otro colegio. Elige otro." });
      }
      return res.status(500).json({ error: "No se pudo registrar el colegio." });
    }

    const tempPassword = generateTempPassword();
    let firebaseUser;
    try {
      firebaseUser = await adminAuth.createUser({ email: contactEmail, password: tempPassword, displayName: contactName });
    } catch (error: any) {
      console.error(error);
      await deleteSchool(school.id).catch((e) => console.error('Rollback (school) falló:', e));
      if (error?.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo de contacto." });
      }
      return res.status(500).json({ error: "No se pudo crear la cuenta del administrador." });
    }

    let dbUser;
    try {
      dbUser = await createSchoolUser({
        uid: firebaseUser.uid, email: contactEmail, name: contactName, schoolId: school.id, role: 'admin',
      });
    } catch (error) {
      console.error(error);
      await adminAuth.deleteUser(firebaseUser.uid).catch((e) => console.error('Rollback (firebase user) falló:', e));
      await deleteSchool(school.id).catch((e) => console.error('Rollback (school) falló:', e));
      return res.status(500).json({ error: "No se pudo crear la cuenta del administrador." });
    }

    res.json({ school, admin: dbUser, tempPassword });
  });

  // ---- Platform console ----
  // Whoever runs the platform, not a school. Nothing here returns student
  // rows: the operator needs to know a school exists, how big it is and
  // whether it should keep working — not who studies there.
  const SCHOOL_STATUSES = ['active', 'suspended'];

  app.get("/api/platform/me", async (req: any, res) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.json({ isPlatformAdmin: false });
    try {
      const decoded = await adminAuth.verifyIdToken(header.split('Bearer ')[1]);
      res.json({ isPlatformAdmin: isPlatformAdminEmail(decoded.email), email: decoded.email });
    } catch {
      res.json({ isPlatformAdmin: false });
    }
  });

  app.get("/api/platform/schools", requirePlatformAdmin, async (_req: any, res) => {
    try {
      res.json(await getSchoolsOverview());
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudieron cargar los colegios." });
    }
  });

  app.post("/api/platform/schools/:id/status", requirePlatformAdmin, async (req: any, res) => {
    const status = req.body?.status;
    if (!SCHOOL_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Estado inválido." });
    }
    try {
      const schoolId = Number(req.params.id);
      if (!Number.isInteger(schoolId)) return res.status(400).json({ error: "Colegio inválido." });
      const school = await getSchool(schoolId);
      if (!school) return res.status(404).json({ error: "No existe ese colegio." });
      const updated = await updateSchool(schoolId, { status });
      res.json({ school: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo cambiar el estado del colegio." });
    }
  });

  app.post("/api/platform/schools/:id/plan", requirePlatformAdmin, async (req: any, res) => {
    const plan = String(req.body?.plan || '').trim().slice(0, 40);
    if (!plan) return res.status(400).json({ error: "Indica el plan." });
    try {
      const schoolId = Number(req.params.id);
      if (!Number.isInteger(schoolId)) return res.status(400).json({ error: "Colegio inválido." });
      const school = await getSchool(schoolId);
      if (!school) return res.status(404).json({ error: "No existe ese colegio." });
      const updated = await updateSchool(schoolId, { plan });
      res.json({ school: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo cambiar el plan." });
    }
  });

  app.get("/api/user", requireAuth, async (req: any, res) => {
    // The school's name rides along so the app can say where the student
    // is — the welcome screen used to name one particular school for every
    // student on the platform.
    res.json({ ...req.dbUser, schoolName: req.school?.name ?? null });
  });

  // Sets the caller's own password. Done here, not with the client SDK's
  // updatePassword, so that the "must change" flag can only be cleared by
  // a password that really changed: an endpoint that just cleared the flag
  // would let anyone keep the temporary password the whole class saw.
  app.post("/api/user/password", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    const newPassword = req.body?.newPassword;
    const problem = passwordProblem(newPassword, { email: caller.email, dni: caller.dni });
    if (problem) {
      return res.status(400).json({ error: problem });
    }
    // An unlocked session left open on a shared computer shouldn't be
    // enough to take over the account, so this needs a sign-in from the
    // last few minutes — the same rule Firebase applies to its own
    // password change. The client re-asks for the current password.
    const authTime = Number(req.user?.auth_time) || 0;
    if (Date.now() / 1000 - authTime > RECENT_SIGN_IN_SECONDS) {
      return res.status(401).json({
        error: 'Por seguridad, escribe otra vez tu contraseña actual.',
        code: 'requires_recent_login',
      });
    }
    try {
      await adminAuth.updateUser(caller.uid, { password: newPassword });
      await updateUserState(caller.uid, { mustChangePassword: false });
      res.json({ ok: true });
    } catch (error: any) {
      // Only the code: the request body holds the new password.
      console.error('Cambio de contraseña falló:', error?.code || error?.message || 'error');
      res.status(500).json({ error: 'No se pudo cambiar la contraseña. Intenta de nuevo.' });
    }
  });

  // Read-only for any staff role (secretary/teacher enroll or manage
  // students and may want to see the current domain/sections); only
  // admin can change it, below.
  app.get("/api/school", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role === 'student') {
      return res.status(403).json({ error: "No autorizado." });
    }
    try {
      const school = await getSchool(caller.schoolId);
      res.json(school);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo cargar el colegio." });
    }
  });

  app.post("/api/school/settings", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede cambiar la configuración del colegio." });
    }
    const updates: { emailDomain?: string | null; sections?: string[] } = {};
    if (typeof req.body?.emailDomain === 'string') {
      const domain = req.body.emailDomain.trim().toLowerCase();
      if (domain && !EMAIL_DOMAIN_REGEX.test(domain)) {
        return res.status(400).json({ error: 'El dominio no parece válido (ej. "aloe.com").' });
      }
      updates.emailDomain = domain || null;
    }
    if (Array.isArray(req.body?.sections)) {
      updates.sections = cleanSections(req.body.sections);
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Nada que actualizar." });
    }
    try {
      const updated = await updateSchool(caller.schoolId, updates);
      res.json(updated);
    } catch (error: any) {
      console.error(error);
      if (isUniqueViolation(error)) {
        return res.status(409).json({ error: "Ese dominio de correo ya lo usa otro colegio en la plataforma." });
      }
      res.status(500).json({ error: "No se pudo actualizar la configuración." });
    }
  });

  // The game runs in the browser, so these numbers arrive from the client.
  // They're clamped rather than trusted verbatim: a student poking at the
  // endpoint can still be wrong, but not absurd (negative coins, progress
  // past the end of the map, a million tickets). Enrollment fields — role,
  // schoolId, dni, grade, section, email — are never read from the body, so
  // this route can't be used to change who you are or what school you're in.
  app.post("/api/user/sync", requireAuth, async (req: any, res) => {
    try {
      const body = req.body || {};
      // Current clients send coin and ticket changes ("+30 since last
      // time"); the database adds them. A total is still accepted from a
      // tab opened before this version, which knows no other way.
      // A change is only accepted with the device's batch number, so that
      // one resent after a lost answer is recognised and not added twice.
      const mark = cleanSyncMark(body);
      const deltas = mark
        ? { coins: clampDelta(body.coinsDelta, MAX_CURRENCY), tickets: clampDelta(body.ticketsDelta, MAX_CURRENCY) }
        : { coins: undefined, tickets: undefined };
      const updates: Record<string, any> = {
        coins: deltas.coins === undefined ? clampInt(body.coins, MAX_CURRENCY) : undefined,
        tickets: deltas.tickets === undefined ? clampInt(body.tickets, MAX_CURRENCY) : undefined,
        progress: clampInt(body.progress, MAX_PROGRESS),
        infiniteProgress: plainObject(body.infiniteProgress),
        courseProgress: plainObject(body.courseProgress),
        stats: plainObject(body.stats),
        albums: plainObject(body.albums),
        mistakes: cleanMistakes(body.mistakes),
        avatar: typeof body.avatar === 'string' ? body.avatar.slice(0, 40) : undefined,
        // No `name`: it's enrollment data, which only the admin and the
        // secretary may change. Accepting it here let a student rename
        // themselves on the teacher's roster from the setup screen — and
        // undo every correction the secretary made, on each sync.
        setupCompleted: typeof body.setupCompleted === 'boolean' ? body.setupCompleted : undefined,
      };
      for (const key of Object.keys(updates)) {
        if (updates[key] === undefined) delete updates[key];
      }
      if (Object.keys(updates).length === 0 && deltas.coins === undefined && deltas.tickets === undefined) {
        return res.status(400).json({ error: "Nada que sincronizar." });
      }
      const user = await applyUserSync(req.user.uid, updates, deltas, MAX_CURRENCY, mark);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update user state" });
    }
  });

  // Creates one account (student, teacher or admin) inside the caller's
  // own school. Accounts are never self-registered — only an admin makes
  // them (registering students isn't a teacher duty), so the schoolId
  // always comes from the caller, never the body.
  app.post("/api/admin/users", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (!canManageEnrollment(caller.role)) {
      return res.status(403).json({ error: "Solo un administrador o secretario puede crear cuentas." });
    }
    const requestedRole =
      req.body?.role === 'admin' ? 'admin'
      : req.body?.role === 'secretary' ? 'secretary'
      : req.body?.role === 'teacher' ? 'teacher'
      : 'student';

    // Only the top admin creates staff (teacher/secretary/admin) — a
    // secretary can enroll students but never appoints other staff.
    if (requestedRole !== 'student' && caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede crear cuentas de profesor, secretario o administrador." });
    }

    if (requestedRole === 'student') {
      const firstName = String(req.body?.firstName || '').trim();
      const lastName = String(req.body?.lastName || '').trim();
      const dni = String(req.body?.dni || '').trim();
      const grade = String(req.body?.grade || '');
      const customEmail = String(req.body?.email || '').trim().toLowerCase();
      if (!firstName || !lastName || !dni || !grade) {
        return res.status(400).json({ error: "Nombre, apellido, DNI y grado son obligatorios." });
      }
      if (!VALID_GRADES.includes(grade)) {
        return res.status(400).json({ error: "Grado inválido." });
      }
      if (customEmail && !EMAIL_REGEX.test(customEmail)) {
        return res.status(400).json({ error: "El correo no es válido." });
      }
      try {
        const { dbUser, tempPassword } = await createStudentAccount({
          schoolId: caller.schoolId, firstName, lastName, dni, grade, customEmail,
        });
        return res.json({ user: dbUser, tempPassword });
      } catch (error: any) {
        console.error(error);
        if (error?.code === 'auth/email-already-exists') {
          return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
        }
        if (isDniConflict(error)) {
          return res.status(409).json({
            error: "Ya existe una cuenta con ese DNI en la plataforma.",
            code: "dni_exists",
          });
        }
        return res.status(500).json({ error: "No se pudo crear la cuenta." });
      }
    }

    // Teacher / admin: simpler shape, no enrollment fields.
    const name = String(req.body?.name || '').trim().slice(0, 120);
    const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 200);
    if (!name || !email) {
      return res.status(400).json({ error: "Nombre y correo son obligatorios." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "El correo no es válido." });
    }
    let staffFirebaseUser: { uid: string } | undefined;
    try {
      const tempPassword = generateTempPassword();
      staffFirebaseUser = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
      const dbUser = await createSchoolUser({
        uid: staffFirebaseUser.uid, email, name, schoolId: caller.schoolId, role: requestedRole,
      });
      res.json({ user: dbUser, tempPassword });
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
      }
      // The DB insert failed after the Firebase account was already
      // created — without cleanup that email is stuck forever (taken in
      // Firebase, no row anywhere, and the caller never saw the password).
      if (staffFirebaseUser) {
        await adminAuth.deleteUser(staffFirebaseUser.uid).catch((e) => console.error('Rollback (firebase user) falló:', e));
      }
      res.status(500).json({ error: "No se pudo crear la cuenta." });
    }
  });

  // Moves an existing student (found by DNI, unique platform-wide) into
  // the caller's school — the path for a legitimate transfer from
  // another school on this platform, instead of rejecting as a
  // duplicate. Keeps uid/email/progress; only the enrollment (school,
  // grade, section) changes.
  app.post("/api/admin/users/transfer", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (!canManageEnrollment(caller.role)) {
      return res.status(403).json({ error: "Solo un administrador o secretario puede transferir alumnos." });
    }
    const dni = String(req.body?.dni || '').trim();
    const grade = String(req.body?.grade || '');
    if (!dni || !grade) {
      return res.status(400).json({ error: "DNI y grado son obligatorios." });
    }
    if (!VALID_GRADES.includes(grade)) {
      return res.status(400).json({ error: "Grado inválido." });
    }
    try {
      const existing = await getUserByDni(dni);
      if (!existing || existing.role !== 'student') {
        return res.status(404).json({ error: "No existe un alumno con ese DNI." });
      }
      if (existing.schoolId === caller.schoolId) {
        return res.status(400).json({ error: "Ese DNI ya pertenece a un alumno de tu propio colegio." });
      }
      const school = await getSchool(caller.schoolId);
      const section = await assignSection(caller.schoolId, grade, school?.sections || []);
      const updated = await updateUserState(existing.uid, {
        schoolId: caller.schoolId,
        grade,
        section,
        classroom: section ? `${grade} ${section}` : grade,
      });
      res.json({ user: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo transferir al alumno." });
    }
  });

  // Same as above, in bulk (e.g. pasting a class list). Each row is
  // created independently so one bad email doesn't fail the whole batch.
  app.post("/api/admin/users/bulk", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (!canManageEnrollment(caller.role)) {
      return res.status(403).json({ error: "Solo un administrador o secretario puede crear cuentas." });
    }
    const grade = String(req.body?.grade || '');
    if (!VALID_GRADES.includes(grade)) {
      return res.status(400).json({ error: "Selecciona el grado de esta carga." });
    }
    const students = req.body?.students;
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Envía al menos un alumno." });
    }
    if (students.length > 200) {
      return res.status(400).json({ error: "Máximo 200 alumnos por carga." });
    }

    const results: Array<{ name: string; status: string; email?: string; tempPassword?: string; error?: string }> = [];
    for (const raw of students) {
      const firstName = String(raw?.firstName || '').trim();
      const lastName = String(raw?.lastName || '').trim();
      const dni = String(raw?.dni || '').trim();
      const customEmail = String(raw?.email || '').trim().toLowerCase();
      const name = `${firstName} ${lastName}`.trim();
      if (!firstName || !lastName || !dni) {
        results.push({ name, status: 'error', error: 'Falta nombre, apellido o DNI.' });
        continue;
      }
      if (customEmail && !EMAIL_REGEX.test(customEmail)) {
        results.push({ name, status: 'error', error: 'El correo no es válido.' });
        continue;
      }
      try {
        const { tempPassword, email } = await createStudentAccount({
          schoolId: caller.schoolId, firstName, lastName, dni, grade, customEmail,
        });
        results.push({ name, email, tempPassword, status: 'ok' });
      } catch (error: any) {
        const message = error?.code === 'auth/email-already-exists'
          ? 'Ya existe una cuenta con ese correo.'
          : isDniConflict(error)
          ? 'Ya existe una cuenta con ese DNI en la plataforma.'
          : 'No se pudo crear.';
        results.push({ name, status: 'error', error: message });
      }
    }
    res.json({ results });
  });

  app.get("/api/teacher/students", requireAuth, async (req: any, res) => {
    try {
      const caller = req.dbUser;
      if (caller.role !== 'teacher' && caller.role !== 'admin' && caller.role !== 'secretary') {
        return res.status(403).json({ error: "Only teachers can view this" });
      }
      const students = await getAllStudents(caller.schoolId);
      res.json(visibleStudentsFor(caller, students));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // A daily challenge or a coupon code. Decided and paid here, at most once
  // (see src/lib/claims.ts): both used to be settled in the browser, where
  // a reload reset the challenges and a coupon could be cashed forever.
  app.post("/api/user/claim", requireAuth, async (req: any, res) => {
    try {
      let row = req.dbUser;
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) row = await getUserState(row.uid);
        const result = applyClaim(row.claims, req.body, { today: schoolToday(), inputs: row, codes: PROMO_CODES });
        if (!result.ok) return res.status(result.status).json({ error: result.error });
        const updated = await writeClaim(row.uid, row.claims, result.claims, result.reward, MAX_CURRENCY);
        if (updated) return res.json({ user: updated, reward: result.reward });
      }
      res.status(409).json({ error: "Intenta de nuevo en un momento." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo reclamar el premio." });
    }
  });

  // A reward from the teacher: coins and/or tickets added to what the
  // student has, in the database. The panel used to send the new total it
  // had worked out from a list loaded minutes earlier, which erased
  // whatever the student had earned (or spent) since.
  const MAX_AWARD = 10_000;
  app.post("/api/teacher/student/:uid/award", requireAuth, async (req: any, res) => {
    try {
      const caller = req.dbUser;
      if (caller.role !== 'teacher' && caller.role !== 'admin' && caller.role !== 'secretary') {
        return res.status(403).json({ error: "Solo el personal del colegio puede premiar." });
      }
      const target = await getUserState(req.params.uid);
      if (!target || target.schoolId !== caller.schoolId || target.role !== 'student') {
        return res.status(404).json({ error: "No se encontró a ese alumno en tu colegio." });
      }
      if (visibleStudentsFor(caller, [target]).length === 0) {
        return res.status(403).json({ error: "Ese alumno no pertenece a tus salones." });
      }
      if (target.active === false) {
        return res.status(400).json({ error: "Ese alumno está de baja." });
      }
      const amount = (value: unknown) => {
        const n = clampInt(value, MAX_AWARD);
        return n ? n : undefined;
      };
      const deltas = { coins: amount(req.body?.coins), tickets: amount(req.body?.tickets) };
      if (deltas.coins === undefined && deltas.tickets === undefined) {
        return res.status(400).json({ error: "Indica cuántas monedas o tickets dar." });
      }
      const updated = await applyUserSync(target.uid, {}, deltas, MAX_CURRENCY);
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo entregar el premio." });
    }
  });

  // Fields a teacher/admin may change on a student through this route.
  // Anything else (role, schoolId, uid, email, id, createdAt) is never
  // read from the body — without this whitelist the old code applied
  // req.body verbatim, so a crafted request could escalate a student to
  // admin or move them to a different school.
  app.post("/api/teacher/student/:uid", requireAuth, async (req: any, res) => {
    try {
      const caller = req.dbUser;
      if (caller.role !== 'teacher' && caller.role !== 'admin' && caller.role !== 'secretary') {
        return res.status(403).json({ error: "Only teachers can modify students" });
      }
      const targetUid = req.params.uid;
      const target = await getUserState(targetUid);
      // Same-school check: without it a teacher could update any uid,
      // including a student from a different school. Role check: this
      // route is for students only, not for editing a fellow teacher/admin.
      if (!target || target.schoolId !== caller.schoolId || target.role !== 'student') {
        return res.status(404).json({ error: "Student not found" });
      }
      // A teacher assigned to specific classrooms can't reach around them.
      if (visibleStudentsFor(caller, [target]).length === 0) {
        return res.status(403).json({ error: "Ese alumno no pertenece a tus salones." });
      }
      const allowed = editableFieldsFor(caller.role);
      // Rejected rather than silently dropped: a teacher who tries to fix a
      // DNI should be told it isn't theirs to change, not watch it revert.
      const body = plainObject(req.body);
      if (!body) return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
      const forbidden = ENROLLMENT_FIELDS.filter((f) => f in body && !allowed.includes(f));
      if (forbidden.length > 0) {
        return res.status(403).json({
          error: "Los datos de matrícula (nombre, DNI, grado y sección) solo los cambia el administrador o el secretario.",
        });
      }
      const cleaned = cleanStudentUpdates(body, allowed);
      if ('error' in cleaned) return res.status(400).json({ error: cleaned.error });
      const updates: Record<string, any> = cleaned.updates;

      // Classroom is derived from grade + section on the server, so the
      // enrollment cannot contain contradictory values supplied by a client.
      if ('grade' in updates || 'section' in updates || 'classroom' in body) {
        const school = await getSchool(caller.schoolId);
        const grade = String(updates.grade ?? target.grade ?? '');
        const section = updates.section === null ? '' : String(updates.section ?? target.section ?? '');
        if (section && Array.isArray(school?.sections) && !school.sections.includes(section)) {
          return res.status(400).json({ error: 'La sección no existe en este colegio.' });
        }
        updates.classroom = section ? `${grade} ${section}`.trim() : grade;
      }
      if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'Nada que actualizar.' });
      const updatedUser = await updateUserState(targetUid, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update student" });
    }
  });

  // What the classroom is getting wrong, by topic. Aggregated here rather
  // than shipping every student's mistakes to the browser: the teacher wants
  // the pattern ("half of 5to A misses Mezclas"), not 300 individual misses.
  app.get("/api/teacher/mistakes", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role !== 'teacher' && caller.role !== 'admin' && caller.role !== 'secretary') {
      return res.status(403).json({ error: "No autorizado." });
    }
    try {
      const classroom = typeof req.query.classroom === 'string' ? req.query.classroom : '';
      const students = visibleStudentsFor(caller, await getAllStudents(caller.schoolId));
      const scoped = students.filter((s: any) =>
        s.active !== false && (!classroom || s.classroom === classroom)
      );

      const byTopic = new Map<string, { topic: string; misses: number; students: Set<string> }>();
      for (const student of scoped) {
        const mistakes = Array.isArray(student.mistakes) ? student.mistakes : [];
        for (const m of mistakes as any[]) {
          const topic = (m?.topic || '').trim() || 'Sin tema';
          if (!byTopic.has(topic)) byTopic.set(topic, { topic, misses: 0, students: new Set() });
          const entry = byTopic.get(topic)!;
          entry.misses += 1;
          entry.students.add(student.uid);
        }
      }

      const topics = Array.from(byTopic.values())
        .map((t) => ({ topic: t.topic, misses: t.misses, students: t.students.size }))
        .sort((a, b) => b.misses - a.misses);

      res.json({ topics, studentsConsidered: scoped.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudieron cargar los errores del salón." });
    }
  });

  // Staff roster. Admin only: a secretary handles enrollment, not who works
  // at the school, and a teacher has no business listing their colleagues'
  // accounts.
  app.get("/api/admin/staff", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede ver las cuentas del personal." });
    }
    try {
      const staff = await getSchoolStaff(caller.schoolId);
      res.json(staff);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo cargar el personal del colegio." });
    }
  });

  // Which classrooms a teacher is responsible for. Admin only, and only on
  // teachers: an admin or secretary works across the whole school by
  // definition, so scoping them would mean nothing.
  app.post("/api/admin/users/:uid/classrooms", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede asignar salones." });
    }
    const raw = req.body?.classrooms;
    if (!Array.isArray(raw)) {
      return res.status(400).json({ error: "Envía la lista de salones." });
    }
    const classrooms = raw
      .map((c: any) => String(c).trim().slice(0, 40))
      .filter(Boolean)
      .filter((c: string, i: number, arr: string[]) => arr.indexOf(c) === i)
      .slice(0, 40);
    try {
      const target = await getUserState(req.params.uid);
      if (!target || target.schoolId !== caller.schoolId) {
        return res.status(404).json({ error: "No se encontró esa cuenta en tu colegio." });
      }
      if (target.role !== 'teacher') {
        return res.status(400).json({ error: "Los salones solo se asignan a profesores." });
      }
      const updated = await updateUserState(target.uid, { classrooms });
      res.json({ user: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudieron guardar los salones." });
    }
  });

  // Gives someone leave, or brings them back. Soft on purpose: deleting the
  // row would take the student's history with it, and their DNI may still be
  // needed to transfer them to another school on the platform. The Firebase
  // account is disabled alongside so they can't sign in at all.
  app.post("/api/admin/users/:uid/active", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    const targetUid = req.params.uid;
    const active = req.body?.active;
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: "Falta indicar si la cuenta queda activa o de baja." });
    }
    try {
      const target = await getUserState(targetUid);
      if (!target || target.schoolId !== caller.schoolId) {
        return res.status(404).json({ error: "No se encontró esa cuenta en tu colegio." });
      }
      const allowed = target.role === 'student'
        ? canManageEnrollment(caller.role)
        : caller.role === 'admin';
      if (!allowed) {
        return res.status(403).json({ error: "No tienes permiso para dar de baja esa cuenta." });
      }
      // Locking yourself out would leave the school with no way back in if
      // you're its only admin.
      if (target.uid === caller.uid) {
        return res.status(400).json({ error: "No puedes darte de baja a ti mismo." });
      }
      if (target.role === 'admin' && !active) {
        const admins = await countActiveAdmins(caller.schoolId);
        if (admins <= 1) {
          return res.status(400).json({ error: "Es el único administrador activo del colegio. Nombra a otro antes de darlo de baja." });
        }
      }

      await adminAuth.updateUser(targetUid, { disabled: !active }).catch((e) => {
        // Missing in Firebase (already removed by hand) shouldn't block the
        // row from being marked — the DB flag is what gates access anyway.
        if (e?.code !== 'auth/user-not-found') throw e;
      });
      const updated = await updateUserState(targetUid, { active });
      res.json({ user: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo actualizar el estado de la cuenta." });
    }
  });

  // Issues a fresh temporary password. Students can't use the "forgot your
  // password" email: their address is generated on the school's domain
  // (20265473@colegio.com) and no such mailbox exists, so without this an
  // account is locked out permanently the first time a student forgets.
  app.post("/api/admin/users/:uid/reset-password", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    const targetUid = req.params.uid;
    try {
      const target = await getUserState(targetUid);
      // Scoped to the caller's own school; a 404 either way so this can't be
      // used to probe which uids exist elsewhere on the platform.
      if (!target || target.schoolId !== caller.schoolId) {
        return res.status(404).json({ error: "No se encontró esa cuenta en tu colegio." });
      }
      // A secretary handles enrollment, so they reset students. Resetting
      // staff — including another admin — stays with the admin.
      const allowed = target.role === 'student'
        ? canManageEnrollment(caller.role)
        : caller.role === 'admin';
      if (!allowed) {
        return res.status(403).json({ error: "No tienes permiso para restablecer esa contraseña." });
      }
      // Resetting your own password here would be a way to lock yourself out
      // of an active session for no reason; use the email flow instead.
      if (target.uid === caller.uid) {
        return res.status(400).json({ error: 'Para tu propia cuenta usa "¿Olvidaste tu contraseña?" en el login.' });
      }

      const tempPassword = generateTempPassword();
      await adminAuth.updateUser(targetUid, { password: tempPassword });
      // Whoever resets it sees it; the student makes their own on next login.
      await updateUserState(targetUid, { mustChangePassword: true });
      res.json({ tempPassword, name: target.name, email: target.email });
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/user-not-found') {
        return res.status(404).json({ error: "Esa cuenta ya no existe en el sistema de acceso." });
      }
      res.status(500).json({ error: "No se pudo restablecer la contraseña." });
    }
  });


  // The AI tutor. Behind auth, and the prompt is assembled here from the
  // problem and the student's question (src/lib/tutor.ts): this used to
  // forward whatever text it received, which made it a general-purpose
  // chatbot on the school's API key for anyone with an account.
  const tutorAllowance = createRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000 });
  app.post("/api/tutor", requireAuth, async (req: any, res) => {
    const input = cleanTutorInput(req.body);
    if (!input) {
      return res.status(400).json({ error: "Escribe una pregunta sobre el reto." });
    }
    if (!tutorAllowance(req.dbUser.uid)) {
      return res.status(429).json({ error: "Hiciste muchas preguntas seguidas. Intenta resolverlo un rato y vuelve en unos minutos." });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "El tutor no está disponible en este momento." });
    }
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        // Configurable so a retired model can be swapped without a release.
        model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
        contents: buildTutorPrompt(input),
      });
      const text = response.text?.trim();
      if (!text) throw new Error("respuesta vacía");
      res.json({ text });
    } catch (error: any) {
      console.error("Tutor IA falló:", error?.message || error);
      res.status(502).json({ error: "El tutor no pudo responder. Intenta de nuevo en un momento." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
