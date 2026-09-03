const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<motion\.div layout transition=\{\{ layout: \{ duration: 0\.35, ease: \[0\.16, 1, 0\.3, 1\] \} \}\} className=\{\`rounded-\[2rem\] border-2 p-5 shadow-sm \$\{currentThemeStyle\.cardBg\} overflow-hidden\`\}>/,
  '<motion.div layout transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} className={`rounded-[2rem] border-2 p-5 shadow-sm ${currentThemeStyle.cardBg}`}>\n'
);

fs.writeFileSync('src/App.tsx', code);
