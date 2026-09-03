const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('<InitialSetup initialName')) {
  code = code.replace(
    /return \(\s*<div className=\{\`min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans select-none/m,
    `return (\n    <>\n      <AnimatePresence>\n        {user && !user.setupCompleted && (\n          <InitialSetup initialName={user.name} onComplete={handleInitialSetupComplete} />\n        )}\n      </AnimatePresence>\n      <div className={\`min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans select-none`
  );
  
  code = code.replace(
    /<\/div>\n\s*\);\n\s*\}\n*$/m,
    `</div>\n    </>\n  );\n}\n`
  );

  fs.writeFileSync('src/App.tsx', code);
}
