const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

// Replace md: with lg: for the main layout to prevent squeezing on tablets/split screens
code = code.replace(/md:grid-cols-3/g, 'lg:grid-cols-3');
code = code.replace(/md:col-span-1/g, 'lg:col-span-1');
code = code.replace(/md:col-span-2/g, 'lg:col-span-2');
code = code.replace(/flex flex-col md:flex-row/g, 'flex flex-col lg:flex-row');

// Make the header text handle long names
code = code.replace(
  /<h3 className="text-2xl md:text-3xl font-black text-slate-800">/g,
  '<h3 className="text-2xl lg:text-3xl font-black text-slate-800 break-words line-clamp-2">'
);

// Allow avatar and text to wrap if very narrow, or just ensure text can wrap
code = code.replace(
  /<div className="flex items-center gap-4 text-left">/g,
  '<div className="flex items-center gap-4 text-left max-w-full overflow-hidden">'
);

// Fix the padding for inline mode on mobile
code = code.replace(
  /isInline \? 'flex-1 overflow-y-auto px-8 pb-8'/g,
  "isInline ? 'flex-1 overflow-y-auto px-4 lg:px-8 pb-8'"
);
code = code.replace(
  /isInline \? 'p-8 pt-10 pb-6 shrink-0 mb-0'/g,
  "isInline ? 'p-4 lg:p-8 pt-6 lg:pt-10 pb-6 shrink-0 mb-0'"
);

// Fix overlapping MONEDAS and TICKETS by making them stack on very small widths
code = code.replace(
  /<div className="grid grid-cols-2 gap-2">/g,
  '<div className="grid grid-cols-1 xl:grid-cols-2 gap-2">'
);

// Fix the Logros grid as well
code = code.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">/g,
  '<div className="grid grid-cols-1 xl:grid-cols-2 gap-3">'
);

// Add break-words to the user name div wrapper to ensure it doesn't push flex
code = code.replace(
  /<div>\s*<h3 className="text-2xl lg:text-3xl font-black text-slate-800 break-words line-clamp-2">/g,
  '<div className="flex-1 min-w-0">\n            <h3 className="text-2xl lg:text-3xl font-black text-slate-800 break-words line-clamp-2">'
);


fs.writeFileSync('src/components/ProfileModal.tsx', code);
