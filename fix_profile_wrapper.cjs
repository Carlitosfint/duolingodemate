const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /<div className="fixed inset-0 bg-black\/85 z-\[300\] p-4 md:p-8 backdrop-blur-md overflow-y-auto no-scrollbar flex flex-col items-center">\s*<div className="my-auto w-full flex justify-center">\s*\{content\}\s*<\/div>\s*<\/div>/,
  `<div className="fixed inset-0 bg-black/85 z-[300] p-4 md:p-8 backdrop-blur-md overflow-y-auto no-scrollbar">
      <div className="min-h-full flex items-center justify-center py-8">
        {content}
      </div>
    </div>`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
