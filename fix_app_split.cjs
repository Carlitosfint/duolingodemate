const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
let lines = code.split('\n');
let newLines = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return (    <>')) {
    if (lines[i+1] && lines[i+1].includes('<AnimatePresence>')) {
      // we found the bad block
      newLines.push('        return () => clearTimeout(timer);');
      // skip until we see the end of the block
      while (i < lines.length && !lines[i].includes(') => clearTimeout(timer);')) {
        i++;
      }
      continue;
    }
  }
  newLines.push(lines[i]);
}

let newCode = newLines.join('\n');
if (!newCode.includes('<InitialSetup')) {
  newCode = newCode.replace(
    /return \(\s*<div className=\{\`min-h-screen bg-slate-50/m,
    `return (\n    <>\n      <AnimatePresence>\n        {user && !user.setupCompleted && (\n          <InitialSetup initialName={user.name} onComplete={handleInitialSetupComplete} />\n        )}\n      </AnimatePresence>\n      <div className={\`min-h-screen bg-slate-50`
  );
}

fs.writeFileSync('src/App.tsx', newCode);
