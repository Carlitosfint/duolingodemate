const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /await signInWithPopup\(auth, googleAuthProvider\);\s*setTimeout\(\(\) => window\.location\.reload\(\), 500\);/,
  `await signInWithPopup(auth, googleAuthProvider);`
);

fs.writeFileSync('src/App.tsx', code);
