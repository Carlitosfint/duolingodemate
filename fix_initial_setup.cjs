const fs = require('fs');
let code = fs.readFileSync('src/components/InitialSetup.tsx', 'utf8');

code = code.replace(/className=\{\\\`/g, "className={`");
code = code.replace(/\\\}\`\}/g, "}`}");

fs.writeFileSync('src/components/InitialSetup.tsx', code);
