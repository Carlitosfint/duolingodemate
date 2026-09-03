const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effectCodeRegex = /\s*\/\/\s*Verify problem type matches user progress once user loads\s*useEffect\(\(\) => \{\s*if \(user && viewMode === 'exercise' && !selectedTopic\) \{[\s\S]*?\}, \[user\?\.progress, viewMode, selectedTopic\]\);\s*/;

const match = code.match(effectCodeRegex);
if (match) {
  code = code.replace(match[0], "");
  
  const selectedTopicRegex = /const \[selectedTopic, setSelectedTopic\] = useState<string \| null>\(null\);/;
  code = code.replace(selectedTopicRegex, m => m + "\n\n" + match[0].trim());
  
  fs.writeFileSync('src/App.tsx', code);
}
