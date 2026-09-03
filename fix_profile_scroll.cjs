const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /<div className="fixed inset-0 bg-black\/85 z-\[300\] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto no-scrollbar">\s*\{content\}\s*<\/div>/,
  `<div className="fixed inset-0 bg-black/85 z-[300] p-4 md:p-8 backdrop-blur-md overflow-y-auto no-scrollbar flex flex-col items-center">
      <div className="my-auto w-full flex justify-center">
        {content}
      </div>
    </div>`
);

// Also remove max-h-[55vh] from the inner wrapper so it shows fully!
code = code.replace(
  /'max-h-\[55vh\] overflow-y-auto pr-2'/,
  `'overflow-visible'`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
