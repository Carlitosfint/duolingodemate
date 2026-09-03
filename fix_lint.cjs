const fs = require('fs');

// 1. Fix server.ts req types
let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  /app\.get\("\/api\/user", requireAuth, async \(req, res\) => \{/g,
  `app.get("/api/user", requireAuth, async (req: any, res) => {`
);
serverCode = serverCode.replace(
  /app\.post\("\/api\/user\/sync", requireAuth, async \(req, res\) => \{/g,
  `app.post("/api/user/sync", requireAuth, async (req: any, res) => {`
);
serverCode = serverCode.replace(
  /app\.get\("\/api\/teacher\/students", requireAuth, async \(req, res\) => \{/g,
  `app.get("/api/teacher/students", requireAuth, async (req: any, res) => {`
);
fs.writeFileSync('server.ts', serverCode);

// 2. Fix App.tsx state ordering
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

// Just remove the useEffect that references stats and albumsState from where it is and place it AFTER their declarations
const useEffectCode = `  // Save to DB on user state changes
  useEffect(() => {
    if (!firebaseUser || !user) return;
    const syncState = async () => {
      const token = await firebaseUser.getIdToken();
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`
        },
        body: JSON.stringify({
          ...user,
          infiniteProgress,
          stats,
          albums: albumsState
        })
      });
    };
    const timer = setTimeout(syncState, 2000);
    return () => clearTimeout(timer);
  }, [user, infiniteProgress, stats, albumsState, firebaseUser]);`;

// Remove it
appCode = appCode.replace(useEffectCode, '');

// Place it after stats
appCode = appCode.replace(
  /const \[stats, setStats\] = useState<Stats>\(\(\) => \{[\s\S]*?return saved \? JSON\.parse\(saved\) : \{[\s\S]*?\}\s+\}\);/,
  match => match + '\n\n' + useEffectCode
);

fs.writeFileSync('src/App.tsx', appCode);

