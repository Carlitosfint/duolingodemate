const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// fix the bad replacement around 1146
code = code.replace(
  /<\/div>\s*<\/>\s*\);\s*\}/,
  `</div>\n    );\n  }`
);

// properly replace the end of the file
code = code.replace(
  /<\/div>\s*\);\s*\};\s*\}\s*$/,
  `</div>\n    </>\n  );\n}\n`
);

// If the end of the file is just `</div> ); }`
code = code.replace(
  /<\/div>\s*\);\s*\}\s*$/,
  `</div>\n    </>\n  );\n}\n`
);

fs.writeFileSync('src/App.tsx', code);
