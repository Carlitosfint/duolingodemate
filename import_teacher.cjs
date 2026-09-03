const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /import \{ ProgressMap \} from '\.\/components\/ProgressMap\.tsx';/,
  `import { ProgressMap } from './components/ProgressMap.tsx';\nimport { TeacherDashboard } from './components/TeacherDashboard.tsx';`
);

fs.writeFileSync('src/App.tsx', code);
