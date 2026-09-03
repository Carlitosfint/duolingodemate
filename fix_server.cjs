const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
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
`;

code = code.replace(
  /  app\.get\("\/api\/teacher\/students", requireAuth, async \(req: any, res\) => \{[\s\S]*?\}\);/,
  match => match + "\n\n" + newEndpoint
);

fs.writeFileSync('server.ts', code);
