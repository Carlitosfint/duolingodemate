const fs = require('fs');
let code = fs.readFileSync('src/components/DailyChallengesModal.tsx', 'utf8');

// Item background
code = code.replace(
  /className=\{\`flex items-center gap-3\.5 p-3 rounded-2xl transition-colors border border-slate-200\/50 dark:border-slate-700\/50 \$\{isClaimed \? 'opacity-60 bg-slate-50\/50 dark:bg-slate-800\/50' : 'bg-white dark:bg-slate-800 shadow-sm'\}\`\}/g,
  "className={`flex items-center gap-3.5 p-3 rounded-2xl transition-colors border border-black/5 ${isClaimed ? 'opacity-60 bg-black/5' : 'bg-black/5 shadow-sm'}`}"
);

// Close button
code = code.replace(
  /className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"/g,
  'className={`w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors ${currentThemeStyle.textPrimary}`}'
);

// Hecho badge
code = code.replace(
  /className="text-xs font-black text-green-500 uppercase shrink-0 bg-green-50 dark:bg-green-900\/30 px-2 py-1 rounded-md"/g,
  'className="text-xs font-black text-emerald-500 uppercase shrink-0 bg-emerald-500/10 px-2 py-1 rounded-md"'
);

// Progress numeric badge
code = code.replace(
  /className="font-bold text-xs text-slate-400 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md"/g,
  'className={`font-bold text-xs shrink-0 bg-black/10 px-2 py-1 rounded-md ${currentThemeStyle.textSecondary}`}'
);

// Progress bar container
code = code.replace(
  /className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2\.5 mt-2 overflow-hidden border border-slate-200\/50"/g,
  'className="w-full bg-black/10 rounded-full h-2.5 mt-2 overflow-hidden border border-black/5"'
);

// Reward text
code = code.replace(
  /className="font-bold text-xs text-slate-400 flex items-center gap-1 mt-0\.5"/g,
  'className={`font-bold text-xs flex items-center gap-1 mt-0.5 ${currentThemeStyle.textSecondary}`}'
);

fs.writeFileSync('src/components/DailyChallengesModal.tsx', code);
