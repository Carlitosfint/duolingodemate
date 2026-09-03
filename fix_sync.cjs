const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /const \{ coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted \} = req\.body;\s*const user = await updateUserState\(req\.user\.uid, \{\s*coins, tickets, progress, infiniteProgress, stats, albums, avatar, name\s*\}\);/,
  "const { coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted } = req.body;\n      const user = await updateUserState(req.user.uid, {\n        coins, tickets, progress, infiniteProgress, stats, albums, avatar, name, setupCompleted\n      });"
);

fs.writeFileSync('server.ts', code);
