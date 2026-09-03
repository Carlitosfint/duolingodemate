const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /if \(Math\.random\(\) < 0\.15\) \{[\s\S]*?\}\n\s*\}\n/g,
  '\n'
);

fs.writeFileSync('src/App.tsx', code);
