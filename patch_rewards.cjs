const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /      let coinsEarned = 50;\n      let ticketsEarned = 10;\n\n      \/\/ Apply buff multipliers\n      if \(\(equipedPet \|\| PET_BUFFS\[0\]\)\.buffType === 'coins'\) coinsEarned \+= \(\(equipedPet \|\| PET_BUFFS\[0\]\)\.value\);\n      if \(\(equipedPet \|\| PET_BUFFS\[0\]\)\.buffType === 'tickets'\) ticketsEarned \+= \(\(equipedPet \|\| PET_BUFFS\[0\]\)\.value\);/,
  `      let isInfiniteMode = selectedTopic !== null;
      let coinsEarned = isInfiniteMode ? 0 : 50;
      let ticketsEarned = 10;

      // Apply buff multipliers
      if (!isInfiniteMode && (equipedPet || PET_BUFFS[0]).buffType === 'coins') coinsEarned += (equipedPet || PET_BUFFS[0]).value;
      if ((equipedPet || PET_BUFFS[0]).buffType === 'tickets') ticketsEarned += (equipedPet || PET_BUFFS[0]).value;`
);

code = code.replace(
  /      setUser\(prev => prev \? \{\n        \.\.\.prev,\n        coins: prev\.coins \+ coinsEarned,\n        tickets: prev\.tickets \+ ticketsEarned,\n        progress: Math\.min\(200, prev\.progress \+ 1\)\n      \} : null\);/,
  `      setUser(prev => prev ? {
        ...prev,
        coins: prev.coins + coinsEarned,
        tickets: prev.tickets + ticketsEarned,
        progress: isInfiniteMode ? prev.progress : Math.min(100, prev.progress + 1)
      } : null);`
);

code = code.replace(
  /      const nextProgress = Math\.min\(200, user\.progress \+ 1\);/,
  `      const nextProgress = isInfiniteMode ? user.progress : Math.min(100, user.progress + 1);`
);

fs.writeFileSync('src/App.tsx', code);
