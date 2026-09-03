const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<div className=\{\`p-4 border-b-2 z-50 flex items-center justify-between shadow-sm relative \$\{currentThemeStyle\.headerBg\}\`\}>[\s\S]*?<\/div>\s*<\/div>/,
  ''
);

// Replace Aprender text
code = code.replace(/>Aprender</g, '>Práctica<');

fs.writeFileSync('src/App.tsx', code);
