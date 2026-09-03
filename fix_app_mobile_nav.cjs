const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const mobileNavAdd = `
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <button onClick={() => setViewMode('teacher_dash')} className={\`p-2 rounded-xl flex flex-col items-center gap-1 \${viewMode === 'teacher_dash' ? 'text-blue-500' : 'text-slate-400'}\`}>
              <Icon name="users" />
              <span className="text-[9px] font-black uppercase tracking-wider">Alumnos</span>
            </button>
          )}
`;

if (!code.includes("span className=\"text-[9px] font-black uppercase tracking-wider\">Alumnos</span>")) {
  code = code.replace(
    /          <button onClick=\{\(\) => setViewMode\('profile'\)\} className=\{\`p-2 rounded-xl flex flex-col items-center gap-1 \$\{viewMode === 'profile' \? 'text-blue-500' : 'text-slate-400'\}\`\}>\n            <Icon name="user" \/>\n            <span className="text-\[9px\] font-black uppercase tracking-wider">Perfil<\/span>\n          <\/button>/,
    match => match + "\n" + mobileNavAdd
  );
  fs.writeFileSync('src/App.tsx', code);
}
