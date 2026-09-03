const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /DESAFÍO \{\(viewMode === 'infinite_map' \? \(infiniteProgress\[selectedTopic!\] \|\| 0\) : \(user\?\.progress \|\| 0\)\) \+ 1\} - \{\(\(\) => \{[\s\S]*?\}\)\(\)\}/m;

code = code.replace(regex, "DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic!] || 0) : (user?.progress || 0)) + 1} - {currentProblem.data.type.toUpperCase()}");

fs.writeFileSync('src/App.tsx', code);
