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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database endpoints
  const { requireAuth } = await import('./src/middleware/auth.ts');
  const { getUserState, updateUserState, getAllStudents, createSchoolUser } = await import('./src/db/users.ts');
  const { adminAuth } = await import('./src/lib/firebase-admin.ts');

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

  // Creates one account (student or teacher) inside the caller's own
  // school. Accounts are never self-registered — an admin/teacher makes
  // them, so the schoolId always comes from the caller, never the body.
  app.post("/api/admin/users", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role !== 'admin' && caller.role !== 'teacher') {
      return res.status(403).json({ error: "Solo administradores o profesores pueden crear cuentas." });
    }
    const name = String(req.body?.name || '').trim();
    const email = String(req.body?.email || '').trim();
    const requestedRole =
      req.body?.role === 'admin' ? 'admin' : req.body?.role === 'teacher' ? 'teacher' : 'student';
    if (!name || !email) {
      return res.status(400).json({ error: "Nombre y correo son obligatorios." });
    }
    if ((requestedRole === 'teacher' || requestedRole === 'admin') && caller.role !== 'admin') {
      return res.status(403).json({ error: "Solo un administrador puede crear cuentas de profesor o administrador." });
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

  // Same as above, in bulk (e.g. pasting a class list). Each row is
  // created independently so one bad email doesn't fail the whole batch.
  app.post("/api/admin/users/bulk", requireAuth, async (req: any, res) => {
    const caller = req.dbUser;
    if (caller.role !== 'admin' && caller.role !== 'teacher') {
      return res.status(403).json({ error: "Solo administradores o profesores pueden crear cuentas." });
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
      const name = String(raw?.name || '').trim();
      const email = String(raw?.email || '').trim();
      if (!name || !email) {
        results.push({ name, email, status: 'error', error: 'Falta nombre o correo.' });
        continue;
      }
      try {
        const tempPassword = generateTempPassword();
        const firebaseUser = await adminAuth.createUser({ email, password: tempPassword, displayName: name });
        await createSchoolUser({ uid: firebaseUser.uid, email, name, schoolId: caller.schoolId, role: 'student' });
        results.push({ name, email, tempPassword, status: 'ok' });
      } catch (error: any) {
        results.push({
          name, email, status: 'error',
          error: error?.code === 'auth/email-already-exists' ? 'Ya existe una cuenta con ese correo.' : 'No se pudo crear.',
        });
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

  app.post("/api/teacher/student/:uid", requireAuth, async (req: any, res) => {
    try {
      const caller = req.dbUser;
      if (caller.role !== 'teacher' && caller.role !== 'admin') {
        return res.status(403).json({ error: "Only teachers can modify students" });
      }
      const targetUid = req.params.uid;
      const target = await getUserState(targetUid);
      // Same-school check: without it a teacher could update any uid,
      // including a student from a different school.
      if (!target || target.schoolId !== caller.schoolId) {
        return res.status(404).json({ error: "Student not found" });
      }
      const updates = req.body;
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
