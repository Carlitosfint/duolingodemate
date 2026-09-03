const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setViewMode\('map'\)\}\s*className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 hover:scale-105 active:scale-95 transition-all shadow-sm ml-1 indestructible-btn"\s*title="Volver al Mapa"/,
  `onClick={() => setViewMode(selectedTopic ? 'infinite_map' : 'map')}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 hover:scale-105 active:scale-95 transition-all shadow-sm ml-1 indestructible-btn"
             title="Volver al Mapa"`
);

fs.writeFileSync('src/App.tsx', code);
