const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /hintsType: string;/,
  'hintsType: string;\n  visualData?: any;'
);

fs.writeFileSync('src/types.ts', code);
