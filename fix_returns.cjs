const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

code = code.replace(
  /hintsType: 'numeric'\s*};\s*}/g,
  `hintsType: 'numeric',
    visualData
  };
}`
);

fs.writeFileSync('src/utils/math.ts', code);
