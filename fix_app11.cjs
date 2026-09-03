const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const cycle = Math\.floor\(\(step \+ 1\) \/ 3\);/g,
  `const cycle = Math.floor(step / 3);`
);

fs.writeFileSync('src/App.tsx', code);
