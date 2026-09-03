const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

code = code.replace(
  /createdAt: timestamp\('created_at'\)\.defaultNow\(\),/,
  `createdAt: timestamp('created_at').defaultNow(),\n  setupCompleted: boolean('setup_completed').default(false),`
);

fs.writeFileSync('src/db/schema.ts', code);
