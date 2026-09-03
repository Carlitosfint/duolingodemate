const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /<div className="space-y-2">\s*<div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 font-black text-xs sm:text-sm">\s*<span className="text-slate-500 shrink-0">MONEDAS<\/span>\s*<span className="text-amber-500 text-base sm:text-lg flex items-center gap-1\.5 shrink-0 font-black"><Icon name="coins" size=\{20\} className="inline-block" \/> \{user\.coins\}<\/span>\s*<\/div>\s*<div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-100 font-black text-xs sm:text-sm">\s*<span className="text-slate-500 shrink-0">TICKETS<\/span>\s*<span className="text-blue-500 text-base sm:text-lg flex items-center gap-1\.5 shrink-0 font-black"><Icon name="ticket" size=\{20\} className="inline-block" \/> \{user\.tickets\}<\/span>\s*<\/div>\s*<\/div>/,
  `<div className="grid grid-cols-2 gap-2">
    <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-100 font-black text-xs text-center">
      <span className="text-slate-400 mb-1 text-[10px]">MONEDAS</span>
      <span className="text-amber-500 text-base sm:text-lg flex items-center gap-1 font-black"><Icon name="coins" size={18} className="inline-block" /> {user.coins}</span>
    </div>
    <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-100 font-black text-xs text-center">
      <span className="text-slate-400 mb-1 text-[10px]">TICKETS</span>
      <span className="text-blue-500 text-base sm:text-lg flex items-center gap-1 font-black"><Icon name="ticket" size={18} className="inline-block" /> {user.tickets}</span>
    </div>
  </div>`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
