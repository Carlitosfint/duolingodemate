const fs = require('fs');

let code = fs.readFileSync('src/components/AlbumModal.tsx', 'utf8');
code = code.replace(
  /<div className=\{`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 flex items-center justify-center text-6xl select-none`\}>\s*\{album.emoji\}\s*<\/div>/,
  `<div className={\`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 flex items-center justify-center text-6xl select-none\`}>
    <Icon name={album.emoji} size={64} className="text-white" />
  </div>`
);
code = code.replace(
  /<div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 shadow-md">\s*\{album.emoji\}\s*<\/div>/,
  `<div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 shadow-md">
    <Icon name={album.emoji} size={28} className="text-white" />
  </div>`
);
fs.writeFileSync('src/components/AlbumModal.tsx', code);
