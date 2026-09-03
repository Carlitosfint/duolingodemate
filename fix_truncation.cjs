const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<div className=\{\`flex flex-col min-w-0 pr-1\`\}>\s*<h2 className=\{\`font-black text-xs md:text-sm truncate leading-none \$\{currentThemeStyle\.textPrimary\}\`\}>\{user\.name\}<\/h2>/,
  `<div className="flex flex-col min-w-0 pr-1 max-w-[100px] sm:max-w-[180px]">
            <h2 className={\`font-black text-xs md:text-sm truncate leading-none \${currentThemeStyle.textPrimary}\`}>{user.name}</h2>`
);

// wait the regex didn't match perfectly, let's use a simpler replace
code = code.replace(
  /<div className="flex flex-col min-w-0 pr-1">/,
  `<div className="flex flex-col min-w-0 pr-1 max-w-[100px] sm:max-w-[180px]">`
);

fs.writeFileSync('src/App.tsx', code);
