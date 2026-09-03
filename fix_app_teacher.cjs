const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { TeacherDashboard }')) {
  code = code.replace(
    /import \{ ProfileModal \} from '\.\/components\/ProfileModal';/,
    "import { ProfileModal } from './components/ProfileModal';\nimport { TeacherDashboard } from './components/TeacherDashboard';"
  );
}

const navAdd = `
                 {(user?.role === 'teacher' || user?.role === 'admin') && (
                   <button onClick={() => setViewMode('teacher_dash')} className={\`flex items-center gap-4 \${viewMode === 'teacher_dash' ? 'text-blue-600' : \`\${currentThemeStyle.textPrimary} hover:bg-slate-100\`} font-bold p-3 rounded-2xl transition-all relative\`}>
                      {viewMode === 'teacher_dash' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                      <Icon name="users" className="relative z-10" /> <span className="relative z-10">Alumnos</span>
                   </button>
                 )}
`;

if (!code.includes("setViewMode('teacher_dash')")) {
  code = code.replace(
    /                 <\/button>\n                 <\/nav>/,
    "                 </button>" + navAdd + "              </nav>"
  );
}

const tabAdd = `
              {viewMode === 'teacher_dash' && (<TabTransition type="swipe" key="teacher_dash">
                <div key="teacher_dash" className="flex-1 relative bg-white/50 overflow-hidden p-8 overflow-y-auto">
                  <TeacherDashboard />
                </div>
              </TabTransition>)}
`;

if (!code.includes("viewMode === 'teacher_dash'")) {
  code = code.replace(
    /\{viewMode === 'profile' && \(<TabTransition type="diagonal" key="profile">[\s\S]*?<\/TabTransition>\)\}/,
    match => match + "\n" + tabAdd
  );
}

const viewModeType = /const \[viewMode, setViewMode\] = useState<'map' \| 'practice' \| 'infinite_map' \| 'exercise' \| 'codice' \| 'album' \| 'shop' \| 'mistakes' \| 'profile' \| 'teacher'>\('map'\);/;
code = code.replace(
  viewModeType,
  "const [viewMode, setViewMode] = useState<'map' | 'practice' | 'infinite_map' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher' | 'teacher_dash'>('map');"
);

fs.writeFileSync('src/App.tsx', code);
