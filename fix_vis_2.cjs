const fs = require('fs');
let code = fs.readFileSync('src/components/Visualizer.tsx', 'utf8');

code = code.replace(
  /<div className="flex flex-col my-6 overflow-x-auto w-full max-w-full pb-4 px-4">\s*<div className="flex items-center gap-2 md:gap-3 text-slate-700 font-bold w-max mx-auto">/g,
  '<div className="my-6 w-full max-w-full overflow-x-auto pb-4">\n        <div className="flex items-center gap-2 md:gap-3 text-slate-700 font-bold w-max px-4 lg:mx-auto">'
);

fs.writeFileSync('src/components/Visualizer.tsx', code);
