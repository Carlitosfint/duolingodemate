const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ MarketNewsModal \} from '\.\/components\/MarketNewsModal';\n/, '');

// Remove state definitions
code = code.replace(/const \[marketEvent, setMarketEvent\] = useState<MarketEvent \| null>\(null\);\n/, '');
code = code.replace(/const \[marketDuration, setMarketDuration\] = useState\(0\);\n/, '');
code = code.replace(/const \[showMarketNews, setShowMarketNews\] = useState\(false\);\n/, '');

// Replace skip cost logic
code = code.replace(
  /if \(marketEvent\?\.effect === 'cheap_skips'\) \{\n\s*skipCost = Math\.round\(skipCost \/ 2\);\n\s*\}/g,
  ''
);

// Replace coinsEarned buff
code = code.replace(
  /if \(marketEvent\?\.effect === 'boost_coins_25'\) coinsEarned = Math\.round\(coinsEarned \* 1\.25\);\n/g,
  ''
);
code = code.replace(
  /if \(marketEvent\?\.effect === 'adjust_25'\) \{\n\s*coinsEarned = Math\.round\(coinsEarned \* 0\.75\);\n\s*ticketsEarned = Math\.round\(ticketsEarned \* 0\.75\);\n\s*\}/g,
  ''
);

// Replace countdown logic
code = code.replace(
  /if \(marketDuration > 0\) \{[\s\S]*?\n\s*\}/,
  ''
);

// Replace skip button text
code = code.replace(
  /<span className="truncate">Saltar \(-\{marketEvent\?\.effect === 'cheap_skips' \? Math\.round\(\(\(equipedPet \|\| PET_BUFFS\[0\]\)\.buffType === 'skip_discount' \? Math\.max\(0, 60 - \(equipedPet \|\| PET_BUFFS\[0\]\)\.value\) : 60\) \/ 2\) : \(\(equipedPet \|\| PET_BUFFS\[0\]\)\.buffType === 'skip_discount' \? Math\.max\(0, 60 - \(equipedPet \|\| PET_BUFFS\[0\]\)\.value\) : 60\)\}\)<\/span>/,
  '<span className="truncate">Saltar (-{((equipedPet || PET_BUFFS[0]).buffType === \'skip_discount\' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60)})</span>'
);

// Remove MarketNewsModal render
code = code.replace(/\{showMarketNews && \(\s*<MarketNewsModal[\s\S]*?\/>\s*\)\}/, '');

fs.writeFileSync('src/App.tsx', code);
