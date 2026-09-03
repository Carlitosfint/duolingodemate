const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "    setAnswerState({ type: 'idle', text: null });\n              }\n  };",
  "    setAnswerState({ type: 'idle', text: null });\n  };"
);

fs.writeFileSync('src/App.tsx', code);
