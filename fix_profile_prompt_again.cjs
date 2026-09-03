const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /const \{ auth \} = await import\('\.\.\/lib\/firebase\.ts'\);/,
  ''
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
