const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/const GlobalRipple = \(\) => {/g, 'function GlobalRipple() {');
fs.writeFileSync('src/App.tsx', code);
