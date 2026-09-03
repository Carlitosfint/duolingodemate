const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<ShellGameMinigame \n\s*onFinish=\{onFinishShellGame\}\n\s*playClick=\{playClickSound\}\n\s*playCatch=\{playCatchSound\}\n\s*playTick=\{playRouletteTick\}\n\s*playRainbow=\{playRainbowSound\}\n\s*playError=\{playErrorAlertSound\}\n\s*\/>/g, 
  `<ShellGameMinigame 
          onFinish={onFinishShellGame}
          playClick={playClickSound}
          playCatch={playCatchSound}
          playTick={playRouletteTick}
          playRainbow={playRainbowSound}
          playError={playErrorAlertSound}
        />`);

code = code.replace(/<PetRaceMinigame \n\s*onFinish=\{onFinishPetRace\}\n\s*playClick=\{playClickSound\}\n\s*playCatch=\{playCatchSound\}\n\s*playTick=\{playRouletteTick\}\n\s*playRainbow=\{playRainbowSound\}\n\s*\/>/g,
  `<PetRaceMinigame 
          onFinish={onFinishPetRace}
          playClick={playClickSound}
          playCatch={playCatchSound}
          playTick={playRouletteTick}
          playRainbow={playRainbowSound}
        />`);
        
// Check where UfoGame is used and ensure it takes playError if needed

fs.writeFileSync('src/App.tsx', code);
