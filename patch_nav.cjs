const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<button onClick=\{\(\) => setViewMode\('map'\)\} className=\{`p-2 rounded-xl flex flex-col items-center gap-1 \$\{viewMode === 'map' \? 'text-blue-500' : 'text-slate-400'\}`\}>\s*<Icon name="home" \/>\s*<span className="text-\[9px\] font-black uppercase tracking-wider">Práctica<\/span>\s*<\/button>/,
  `<button onClick={() => setViewMode('map')} className={\`p-2 rounded-xl flex flex-col items-center gap-1 \${viewMode === 'map' ? 'text-blue-500' : 'text-slate-400'}\`}>
            <Icon name="home" />
            <span className="text-[9px] font-black uppercase tracking-wider">Aprender</span>
          </button>
          <button onClick={() => setViewMode('practice')} className={\`p-2 rounded-xl flex flex-col items-center gap-1 \${viewMode === 'practice' ? 'text-blue-500' : 'text-slate-400'}\`}>
            <Icon name="target" />
            <span className="text-[9px] font-black uppercase tracking-wider">Práctica</span>
          </button>`
);

fs.writeFileSync('src/App.tsx', code);
