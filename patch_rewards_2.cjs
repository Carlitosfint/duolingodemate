const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /setUser\(prev => prev \? \{\n\s*\.\.\.prev,\n\s*coins: prev\.coins \+ coinsEarned,\n\s*tickets: prev\.tickets \+ ticketsEarned,\n\s*progress: isInfiniteMode \? prev\.progress : Math\.min\(100, prev\.progress \+ 1\)\n\s*\} : null\);/,
  `setUser(prev => prev ? {
        ...prev,
        coins: prev.coins + coinsEarned,
        tickets: prev.tickets + ticketsEarned,
        progress: isInfiniteMode ? prev.progress : Math.min(100, prev.progress + 1)
      } : null);
      if (isInfiniteMode && selectedTopic) {
        setInfiniteProgress(prev => ({
          ...prev,
          [selectedTopic]: (prev[selectedTopic] || 0) + 1
        }));
      }`
);

fs.writeFileSync('src/App.tsx', code);
