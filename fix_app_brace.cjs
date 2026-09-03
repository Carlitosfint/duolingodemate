const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /    <\/div>\n  \);\nfunction GlobalRipple/,
  `    </div>\n    </>\n  );\n}\nfunction GlobalRipple`
);

fs.writeFileSync('src/App.tsx', code);
