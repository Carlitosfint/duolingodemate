const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
  // Save to DB on user state changes
  useEffect(() => {
    if (!firebaseUser || !user) return;
    const syncState = async () => {
      try {
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
      } catch (e) {
        console.error(e);
      }
    };
    const timer = setTimeout(syncState, 2000);
    return () => clearTimeout(timer);
  }, [user, infiniteProgress, stats, albumsState, firebaseUser]);
`;

code = code.replace(
  /const \[stats, setStats\] = useState<Stats>\(\(\) => \{[\s\S]*?return saved \? JSON\.parse\(saved\) : \{[\s\S]*?\}\s+\}\);/,
  match => match + '\n\n' + effectCode
);

fs.writeFileSync('src/App.tsx', code);
