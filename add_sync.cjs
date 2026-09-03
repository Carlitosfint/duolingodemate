const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const syncEffect = `
  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('fin_user', JSON.stringify(user));
      if (firebaseUser) {
        // debounce sync
        const timeout = setTimeout(async () => {
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
          } catch(e) {}
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [user, infiniteProgress, stats, albumsState]);
`;

code = code.replace(
  /  \/\/ Sync to localStorage\s*useEffect\(\(\) => \{\s*if \(user\) localStorage\.setItem\('fin_user', JSON\.stringify\(user\)\);\s*\}, \[user\]\);/,
  syncEffect.trim()
);

fs.writeFileSync('src/App.tsx', code);
