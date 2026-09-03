const fs = require('fs');

let puzzleCode = fs.readFileSync('src/components/PuzzleSlice.tsx', 'utf8');
puzzleCode = puzzleCode.replace("import React from 'react';", "import React from 'react';\nimport { Icon } from './CustomIcons';");
puzzleCode = puzzleCode.replace("{emoji}", "<Icon name={emoji} size={48} className=\"text-white opacity-80 mix-blend-overlay\" />");
fs.writeFileSync('src/components/PuzzleSlice.tsx', puzzleCode);

let dataCode = fs.readFileSync('src/data.ts', 'utf8');
dataCode = dataCode.replace("emoji: '💎'", "emoji: 'diamond'");
fs.writeFileSync('src/data.ts', dataCode);

