const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressMap.tsx', 'utf8');

code = code.replace(
  /const isSpecial = \(step \+ 1\) % 3 === 0;/,
  'const isSpecial = (step + 1) % 3 === 0 && (step % 20 !== 0);'
);

fs.writeFileSync('src/components/ProgressMap.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /if \(\(step \+ 1\) % 3 === 0\) \{/g,
  'if ((step + 1) % 3 === 0 && (step % 20 !== 0)) {'
);
appCode = appCode.replace(
  /if \(\(step \+ 1\) % 3 !== 0\) \{/g,
  'if ((step + 1) % 3 !== 0 || (step % 20 === 0)) {'
);

fs.writeFileSync('src/App.tsx', appCode);
