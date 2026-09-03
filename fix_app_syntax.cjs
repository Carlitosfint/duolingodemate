const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const badBlock = `        return (    <>
      <AnimatePresence>
        {user && !user.setupCompleted && (
          <InitialSetup 
            initialName={user.name} 
            onComplete={handleInitialSetupComplete} 
          />
        )}
      </AnimatePresence>) => clearTimeout(timer);`;

const goodBlock = `        return () => clearTimeout(timer);`;

code = code.replace(badBlock, goodBlock);

// Now let's inject the AnimatePresence at the very beginning of the main App return.
// The main App return looks like:
// return (
//    <div className={`min-h-screen bg-slate-50 relative overflow-hidden flex flex-col font-sans select-none ...
// Let's find it.

code = code.replace(
  /return \(\s*<div className=\{\`min-h-screen bg-slate-50/m,
  `return (\n    <>\n      <AnimatePresence>\n        {user && !user.setupCompleted && (\n          <InitialSetup initialName={user.name} onComplete={handleInitialSetupComplete} />\n        )}\n      </AnimatePresence>\n      <div className={\`min-h-screen bg-slate-50`
);

fs.writeFileSync('src/App.tsx', code);
