const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const prob = generateMathProblem\(false, null, 0\);/,
  "const prob = generateMathProblem(false, null, user?.progress || 0);"
);

fs.writeFileSync('src/App.tsx', code);
