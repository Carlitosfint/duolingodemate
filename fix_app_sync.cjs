const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /role: data\.role \|\| 'student',/,
  `role: data.role || 'student',\n               setupCompleted: data.setupCompleted || false,`
);

fs.writeFileSync('src/App.tsx', code);
