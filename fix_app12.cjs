const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `                     <ProgressMap progress={progress} onNodeClick={(step) => {
                        if (step < progress) {
                          if ((step + 1) % 3 !== 0 || (step % 20 === 0)) {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          } else alert("Ya reclamaste esta recompensa en el pasado.");
                        } else if (step === progress) {
                          if ((step + 1) % 3 === 0 && (step % 20 !== 0)) { 
                             const cycle = Math.floor(step / 3);
                             if (cycle % 7 === 0) {
                               setShowShellGame(true);
                             } else if (cycle % 7 === 3) {
                               setShowPetRace(true);
                             } else {
                               openRandomChest('rare');
                               advanceEventProgress();
                             }
                          } else {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          }
                        }
                     }} />`;

code = code.replace(/<ProgressMap progress=\{progress\} onNodeClick=\{\(step\) => \{[\s\S]*?\}\} \/>/m, replacement);

fs.writeFileSync('src/App.tsx', code);
