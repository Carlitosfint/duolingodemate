const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf8');

code = code.replace(
  /import \{ Icon \} from '\.\/Icon\.tsx';/,
  `import { Icon } from './CustomIcons.tsx';`
);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
