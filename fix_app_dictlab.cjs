const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<DictLabModal isInline=\{true\} \/>/g, `<DictLabModal isInline={true} activeCourse={activeCourse} />`);
code = code.replace(/<DictLabModal\s*onClose=\{\(\) => setShowDictLab\(false\)\}\s*\/>/g, `<DictLabModal onClose={() => setShowDictLab(false)} activeCourse={activeCourse} />`);

fs.writeFileSync('src/App.tsx', code);
