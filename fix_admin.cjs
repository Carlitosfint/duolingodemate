const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{user\.role === 'teacher' && \(/g,
  `{(user.role === 'teacher' || user.role === 'admin') && (`
);

fs.writeFileSync('src/App.tsx', code);

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(
  /if \(user\?\.role !== 'teacher'\) \{/,
  `if (user?.role !== 'teacher' && user?.role !== 'admin') {`
);
fs.writeFileSync('server.ts', serverCode);

