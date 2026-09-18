import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Readable temp password (no ambiguous 0/O/1/l), handed to the admin
// once at account-creation time and never stored in plain text.
function generateTempPassword(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from(crypto.randomFillSync(new Uint8Array(10)))
    .map((b) => alphabet[b % alphabet.length])
    .join("");
}

const VALID_GRADES = ['3ro', '4to', '5to'];

// Deliberately not DNI-based — the login address shouldn't expose the
// student's national ID. {year}{4 random digits}, e.g. "20265473". Not
// guaranteed unique on its own (unlike DNI), so callers must retry on
// a Firebase "already exists" collision — see createStudentAccount.
function generateStudentLocalPart(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `${year}${randomDigits}`;
}

// A school's chosen domain (e.g. "aloe.com" -> 20265473@aloe.com), or
// "{slug}.alumno.com" until it picks one.
function studentEmailDomain(school: { slug: string; emailDomain?: string | null } | undefined): string {
  return school?.emailDomain || `${school?.slug || 'colegio'}.alumno.com`;
}

function isUniqueViolation(error: any): boolean {
  return error?.cause?.code === '23505' || error?.code === '23505';
}
const isDniConflict = isUniqueViolation;

// School staff hierarchy: admin (director) > secretary (matrícula) >
// teacher > student. A secretary can enroll/transfer students — the
// job an admin would otherwise have to do themselves or hand off by
// making that person a full admin — but never creates other staff.
function canManageEnrollment(role: string): boolean {
  return role === 'admin' || role === 'secretary';
}

const EMAIL_DOMAIN_REGEX = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Colegio Ángeles de Jesús" -> "colegio-angeles-de-jesus". Same shape
// as the slugs used in src/db/seed.ts, so both paths produce URLs/
// fallback domains that look the same either way.
function slugify(name: string): string {
  const base = name
    .normalize('NFD').replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'colegio';
}

// The school types just an alias ("aloe") or a full domain ("aloe.com");
// either way we end up with a real-looking domain for student emails.
function normalizeEmailDomain(raw: string): string {
  let domain = raw.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^@/, '').replace(/\/.*$/, '');
  if (domain && !domain.includes('.')) domain += '.com';
  return domain;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database endpoints
  const { requireAuth } = await import('./src/middleware/auth.ts');
  const { getUserState, updateUserState, getAllStudents, createSchoolUser, countStudentsBySection, getUserByDni } = await import('./src/db/users.ts');
  const { getSchool, updateSchool, createSchool, getSchoolBySlug, getSchoolByEmailDomain, deleteSchool } = await import('./src/db/schools.ts');
  const { adminAuth } = await import('./src/lib/firebase-admin.ts');

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

  app.get("/api/user", requireAuth, async (req: any, res) => {
    res.json(req.dbUser);
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
      updates.sections = req.body.sections
        .map((s: any) => String(s).trim())
        .filter(Boolean)
        .filter((s: string, i: number, arr: string[]) => arr.indexOf(s) === i);
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

  app.post("/api/user/sync", requireAuth, async (req: any, res) => {
    try {
      const { coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted, courseProgress } = req.body;
      const user = await updateUserState(req.user.uid, {
        coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted, courseProgress
      });
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
      const customEmail = String(req.body?.email || '').trim();
      if (!firstName || !lastName || !dni || !grade) {
        return res.status(400).json({ error: "Nombre, apellido, DNI y grado son obligatorios." });
      }
      if (!VALID_GRADES.includes(grade)) {
        return res.status(400).json({ error: "Grado inválido." });
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
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    if (!name || !email) {
      return res.status(400).json({ error: "Nombre y correo son obligatorios." });
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

    const results = [];
    for (const raw of students) {
      const firstName = String(raw?.firstName || '').trim();
      const lastName = String(raw?.lastName || '').trim();
      const dni = String(raw?.dni || '').trim();
      const customEmail = String(raw?.email || '').trim();
      const name = `${firstName} ${lastName}`.trim();
      if (!firstName || !lastName || !dni) {
        results.push({ name, status: 'error', error: 'Falta nombre, apellido o DNI.' });
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
      res.json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // Fields a teacher/admin may change on a student through this route.
  // Anything else (role, schoolId, uid, email, id, createdAt) is never
  // read from the body — without this whitelist the old code applied
  // req.body verbatim, so a crafted request could escalate a student to
  // admin or move them to a different school.
  const STUDENT_EDITABLE_FIELDS = [
    'name', 'avatar', 'dni', 'grade', 'section', 'classroom',
    'coins', 'tickets', 'progress',
  ] as const;

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
      const updates: Record<string, any> = {};
      for (const field of STUDENT_EDITABLE_FIELDS) {
        if (field in req.body) updates[field] = req.body[field];
      }
      const updatedUser = await updateUserState(targetUid, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update student" });
    }
  });


  // API endpoint for Gemini proxy
  app.post("/api/gemini", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({ error: error?.message || "Failed to generate content" });
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
