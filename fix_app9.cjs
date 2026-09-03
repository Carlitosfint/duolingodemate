const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                  const isEventNext = (prog + 1) % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);
                  
                  if (isEventNext) {
                    return (
                      <Button 
                        type="button"
                        onClick={() => {
                          playClickSound();
                          const cycle = Math.floor((prog + 1) / 3);
                          setViewMode(viewMode === 'infinite_map' ? 'infinite_map' : 'map');
                          setTimeout(() => {
                            if (cycle % 7 === 0) {
                                setShowShellGame(true);
                            } else if (cycle % 7 === 3) {
                                setShowPetRace(true);
                            } else {
                                setShowShellGame(true);
                            }
                          }, 300);
                        }} 
                        color="amber" 
                        className="w-full mt-4 py-4 text-base font-black uppercase tracking-widest animate-pulse shadow-[0_4px_0_#d97706] active:shadow-none active:translate-y-1"
                      >`;

const replacementStr = `                  const isEventNext = prog > 0 && prog % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);
                  
                  if (isEventNext) {
                    return (
                      <Button 
                        type="button"
                        onClick={() => {
                          playClickSound();
                          const cycle = Math.floor(prog / 3);
                          setTimeout(() => {
                            if (cycle % 7 === 0) {
                                setShowShellGame(true);
                            } else if (cycle % 7 === 3) {
                                setShowPetRace(true);
                            } else {
                                openRandomChest('rare');
                                advanceEventProgress();
                            }
                          }, 300);
                        }} 
                        color="amber" 
                        className="w-full mt-4 py-4 text-base font-black uppercase tracking-widest animate-pulse shadow-[0_4px_0_#d97706] active:shadow-none active:translate-y-1"
                      >`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
