const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const timer = setTimeout\(\(\) => \{ safeToRemove && safeToRemove\(\); \}, 1000\);[\s\S]*?\) => clearTimeout\(timer\);/;
code = code.replace(regex, `const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 1000);\n       return () => clearTimeout(timer);`);

fs.writeFileSync('src/App.tsx', code);
