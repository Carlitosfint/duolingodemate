const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /import \{ Avatar \} from '\.\/Avatar';/,
  `import { Avatar } from './Avatar';\nimport { auth } from '../lib/firebase.ts';`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
