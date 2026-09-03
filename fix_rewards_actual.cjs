const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the rewards calculation in handleCorrect
const handleCorrectRewardCalculation = `
      // Computes bases reward
      let coinsEarned = isInfiniteMode ? 20 : 0;
      let ticketsEarned = 10;
      
      // Apply buff multipliers
      if ((equipedPet || PET_BUFFS[0]).buffType === 'coins') coinsEarned += (equipedPet || PET_BUFFS[0]).value;
      if ((equipedPet || PET_BUFFS[0]).buffType === 'tickets') ticketsEarned += (equipedPet || PET_BUFFS[0]).value;
            
      // Golden modifiers
      if (currentProblem.data.isGolden) {
        coinsEarned *= 2;
        ticketsEarned *= 2;
      }
`;

code = code.replace(
  /\/\/ Computes bases reward[\s\S]*?\/\/ Golden modifiers\s*if \(currentProblem\.data\.isGolden\) \{/m,
  handleCorrectRewardCalculation + "      if (currentProblem.data.isGolden) {"
);

fs.writeFileSync('src/App.tsx', code);
