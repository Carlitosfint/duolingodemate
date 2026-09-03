const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const isEventNext = prog > 0 && prog % 3 === 0 && \(prog % \(viewMode === 'infinite_map' \? 10 : 20\) !== 0\);/g,
  `const isEventNext = (prog + 1) % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);`
);

fs.writeFileSync('src/App.tsx', code);
