const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /import \{ ProgressMap \} from '\.\/components\/ProgressMap';/,
  `import { ProgressMap } from './components/ProgressMap';\nimport { InitialSetup } from './components/InitialSetup';`
);

code = code.replace(
  /export default function App\(\) \{/,
  `export default function App() {`
);

const setupLogic = `
  const handleInitialSetupComplete = (name: string, avatar: string) => {
    if (user) {
      setUser({ ...user, name, avatar, setupCompleted: true });
    }
  };
`;

code = code.replace(
  /export default function App\(\) \{/,
  `export default function App() {\n${setupLogic}`
);

const renderLogic = `
      <AnimatePresence>
        {user && !user.setupCompleted && (
          <InitialSetup 
            initialName={user.name} 
            onComplete={handleInitialSetupComplete} 
          />
        )}
      </AnimatePresence>
`;

code = code.replace(
  /return \(/,
  `return (\n    <>
${renderLogic}`
);

code = code.replace(
  /<\/div>\n    \);\n  \};\n\n  \/\/ Easy shortcuts/m,
  `</div>\n    );\n  };\n\n  // Easy shortcuts`
);

// We need to properly wrap the main return in <> ... </>
// The main return looks like:
// return (
//    <div className={`min-h-screen bg-slate-50 relative ...
// Let's replace the last </div> with </div></>

code = code.replace(
  /<\/div>\n\s*\);\n\s*\}\n*$/m,
  `</div>\n    </>\n  );\n}\n`
);

fs.writeFileSync('src/App.tsx', code);
