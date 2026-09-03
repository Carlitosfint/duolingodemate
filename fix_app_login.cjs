const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /await signInWithPopup\(auth, googleAuthProvider\);/,
  `await signInWithPopup(auth, googleAuthProvider);\n      setTimeout(() => window.location.reload(), 500);`
);

fs.writeFileSync('src/App.tsx', code);
