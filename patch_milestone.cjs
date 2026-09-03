const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const nextProgress = Math\.min\(200, progress \+ 1\);/g,
  'const nextProgress = Math.min(100, progress + 1);'
);

code = code.replace(
  /type: 'correct',\n\s*text: <span className="flex items-center gap-1 flex-wrap justify-center">¡Correcto! \+\{coinsEarned\} <Icon name="coins" size=\{18\} \/> \| \+\{ticketsEarned\} <Icon name="ticket" size=\{18\} \/> \{speedText\} \{boostText\} \{goldenText\}<\/span>/,
  `type: 'correct',
        text: <span className="flex items-center gap-1 flex-wrap justify-center">¡Correcto! {coinsEarned > 0 && <><span className="text-amber-500">+{coinsEarned}</span> <Icon name="coins" size={18} className="text-amber-500" /> |</>} <span className="text-blue-500">+{ticketsEarned}</span> <Icon name="ticket" size={18} className="text-blue-500" /> {speedText} {boostText} {goldenText}</span>`
);

fs.writeFileSync('src/App.tsx', code);
