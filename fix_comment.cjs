const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\/\/\s*Verify problem type matches user progress once user loadsconst \[selectedTopic, setSelectedTopic\] = useState<string \| null>\(null\);/,
  "  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);"
);

fs.writeFileSync('src/App.tsx', code);
