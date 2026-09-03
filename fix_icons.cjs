const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change album icon to folder
code = code.replace(
  /onClick=\{\(\) => \{ playClickSound\(\); setShowAlbum\(true\); \}\}\s*className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg md:text-xl border-2 border-amber-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"\s*title="Álbumes"\s*>\s*<Icon name="star" size=\{18\} className="inline-block" \/>/g,
  `onClick={() => { playClickSound(); setShowAlbum(true); }}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg md:text-xl border-2 border-amber-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"
             title="Álbumes"
           >
             <Icon name="folder" size={18} className="inline-block" />`
);

fs.writeFileSync('src/App.tsx', code);
