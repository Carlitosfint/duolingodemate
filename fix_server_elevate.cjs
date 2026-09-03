const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const endpointCode = `
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
`;

code = code.replace(
  /app\.get\("\/api\/teacher\/students", requireAuth, async \(req: any, res\) => \{/,
  endpointCode
);

fs.writeFileSync('server.ts', code);
