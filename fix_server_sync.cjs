const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const \{ coins, tickets, progress, infiniteProgress, stats, albums, avatar, name \} = req\.body;/,
  `const { coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted } = req.body;`
);

code = code.replace(
  /coins, tickets, progress, infiniteProgress, stats, albums, avatar, name/,
  `coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted`
);

fs.writeFileSync('server.ts', code);
