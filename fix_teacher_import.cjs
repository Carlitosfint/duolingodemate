const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf8');

code = code.replace(
  /import \{ Card, Icon, Button \} from '\.\.\/App\.tsx';/,
  `import { Card, Button } from './UI.tsx';\nimport { Icon } from './Icon.tsx';`
);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
