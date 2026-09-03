const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/setShowUfoGame\(true\);/g, "setShowShellGame(true);");

fs.writeFileSync('src/App.tsx', code);
