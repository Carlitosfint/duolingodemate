const fs = require('fs');
let code = fs.readFileSync('src/components/Visualizer.tsx', 'utf8');

code = code.replace(
  /<div className="flex flex-col items-center justify-center my-6 overflow-x-auto w-full max-w-full pb-4">/g,
  '<div className="flex flex-col my-6 overflow-x-auto w-full max-w-full pb-4 items-start sm:items-center px-4">'
);

code = code.replace(
  /<div className="flex flex-col my-6 overflow-x-auto w-full max-w-full pb-4 items-start sm:items-center px-4">\s*<div className="flex items-center gap-2 md:gap-3 text-slate-700 font-bold min-w-max">/g,
  '<div className="flex flex-col my-6 overflow-x-auto w-full max-w-full pb-4 px-4">\n        <div className="flex items-center gap-2 md:gap-3 text-slate-700 font-bold w-max mx-auto">'
);

fs.writeFileSync('src/components/Visualizer.tsx', code);
