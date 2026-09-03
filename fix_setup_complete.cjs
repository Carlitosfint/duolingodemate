const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  const handleInitialSetupComplete = async (name: string, avatar: string) => {
    if (user) {
      const newUser = { ...user, name, avatar, setupCompleted: true };
      setUser(newUser);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: \`Bearer \${token}\`
            },
            body: JSON.stringify(newUser)
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  };
`;

code = code.replace(
  /  const handleInitialSetupComplete = \(name: string, avatar: string\) => \{\s*if \(user\) \{\s*setUser\(\{ \.\.\.user, name, avatar, setupCompleted: true \}\);\s*\}\s*\};/,
  replacement.trim()
);

fs.writeFileSync('src/App.tsx', code);
