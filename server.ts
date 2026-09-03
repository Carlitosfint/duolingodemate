import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database endpoints
  const { requireAuth } = await import('./src/middleware/auth.ts');
  const { getUserState, updateUserState, getAllStudents } = await import('./src/db/users.ts');

  app.get("/api/user", requireAuth, async (req: any, res) => {
    try {
      const user = await getUserState(req.user.uid);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user state" });
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

  
  app.post("/api/user/elevate", requireAuth, async (req: any, res) => {
    try {
      const { code } = req.body;
      if (code === 'PROFE2026') {
        const user = await updateUserState(req.user.uid, { role: 'teacher' });
        res.json(user);
      } else if (code === 'ADMIN2026') {
        const user = await updateUserState(req.user.uid, { role: 'admin' });
        res.json(user);
      } else {
        res.status(403).json({ error: "Invalid code" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to elevate role" });
    }
  });

  app.get("/api/teacher/students", requireAuth, async (req: any, res) => {

    try {
      // In a real app we would check if req.user has a teacher role. 
      // For now, we just return all students.
      const user = await getUserState(req.user.uid);
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ error: "Only teachers can view this" });


  app.post("/api/teacher/student/:uid", requireAuth, async (req: any, res) => {
    try {
      const user = await getUserState(req.user.uid);
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ error: "Only teachers can modify students" });
      }
      const targetUid = req.params.uid;
      const updates = req.body;
      const updatedUser = await updateUserState(targetUid, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update student" });
    }
  });

      }
      const students = await getAllStudents();
      res.json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch students" });
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
