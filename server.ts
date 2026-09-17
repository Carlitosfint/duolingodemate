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

function normalizeNamePart(value: string): string {
  return (
    value
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
      .trim()
      .split(/\s+/)[0] // first word only
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '') || ''
  );
}

// "Marian Martinez" -> marianmar@alumno.com. On a collision, retried
// once with the DNI's last 4 digits appended, which is always unique.
function generateStudentEmail(firstName: string, lastName: string, dni: string, withDniSuffix = false): string {
  const base = normalizeNamePart(firstName) + normalizeNamePart(lastName).slice(0, 3);
  const local = withDniSuffix ? base + dni.replace(/\D/g, '').slice(-4) : base;
  return `${local}@alumno.com`;
}

function isDniConflict(error: any): boolean {
  return error?.cause?.code === '23505' || error?.code === '23505';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database endpoints
  const { requireAuth } = await import('./src/middleware/auth.ts');
  const { getUserState, updateUserState, getAllStudents, createSchoolUser, countStudentsBySection, getUserByDni } = await import('./src/db/users.ts');
  const { getSchool } = await import('./src/db/schools.ts');
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

    let email = customEmail || generateStudentEmail(firstName, lastName, dni);
    let firebaseUser;
    try {
      firebaseUser = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
    } catch (err: any) {
      if (!customEmail && err?.code === 'auth/email-already-exists') {
        email = generateStudentEmail(firstName, lastName, dni, true);
        firebaseUser = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
      } else {
        throw err;
      }
    }

    const dbUser = await createSchoolUser({
      uid: firebaseUser.uid, email, name, schoolId, role: 'student',
      dni, grade, section, classroom: section ? `${grade} ${section}` : grade,
    });
    return { dbUser, tempPassword, email };
  }

  app.get("/api/user", requireAuth, async (req: any, res) => {
    res.json(req.dbUser);
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
    if (caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede crear cuentas." });
    }
    const requestedRole =
      req.body?.role === 'admin' ? 'admin' : req.body?.role === 'teacher' ? 'teacher' : 'student';

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
    try {
      const tempPassword = generateTempPassword();
      const firebaseUser = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
      const dbUser = await createSchoolUser({
        uid: firebaseUser.uid, email, name, schoolId: caller.schoolId, role: requestedRole,
      });
      res.json({ user: dbUser, tempPassword });
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
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
    if (caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede transferir alumnos." });
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
    if (caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede crear cuentas." });
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
      if (caller.role !== 'teacher' && caller.role !== 'admin') {
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
      if (caller.role !== 'teacher' && caller.role !== 'admin') {
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
