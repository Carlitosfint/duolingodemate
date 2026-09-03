const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /export interface UserState \{/,
  `export interface UserState {\n  setupCompleted?: boolean;`
);

fs.writeFileSync('src/types.ts', code);
