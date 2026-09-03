const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /return \(\s*<>\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>\) => clearTimeout\(timer\);/m;
code = code.replace(regex, `return () => clearTimeout(timer);`);

// If it hasn't been added to the main component return yet:
if (!code.includes('<InitialSetup')) {
  code = code.replace(
    /return \(\s*<div className=\{\`min-h-screen bg-slate-50/m,
    `return (\n    <>\n      <AnimatePresence>\n        {user && !user.setupCompleted && (\n          <InitialSetup initialName={user.name} onComplete={handleInitialSetupComplete} />\n        )}\n      </AnimatePresence>\n      <div className={\`min-h-screen bg-slate-50`
  );
}

fs.writeFileSync('src/App.tsx', code);
