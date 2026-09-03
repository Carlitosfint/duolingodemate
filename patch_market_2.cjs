const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/if \(marketEvent\?\.effect === 'adjust_25'\) \{[\s\S]*?\}\n/g, '');
code = code.replace(/\/\/ Progress market countdown[\s\S]*?\/\/ 15% chance to roll dynamic market news[\s\S]*?\n/g, '');
code = code.replace(/\{showMarketNews && marketEvent && \([\s\S]*?\/\>\n\s*\)\}\n/g, '');

fs.writeFileSync('src/App.tsx', code);
