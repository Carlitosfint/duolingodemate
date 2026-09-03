const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace "DESAFÍO #{progress.level}"
code = code.replace(
  /DESAFÍO #\{progress\.level\}/,
  `DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic] || 0) : (user?.progress || 0)) + 1} - ${"{"}selectedTopic === 'metodos' ? 'MÉTODOS OPERATIVOS' : selectedTopic === 'cripto' ? 'CRIPTOARITMÉTICA' : selectedTopic === 'logica' ? 'LÓGICA RECREATIVA' : selectedTopic === 'cronometria' ? 'CRONOMETRÍA BÁSICA' : 'CONTEO DE FIGURAS'{"}"}`
);

// Replace "Siguiente desafío" logic
const replacementButton = `
                {currentProblem.solved && (() => {
                  const prog = viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic] || 0) : (user?.progress || 0);
                  const isEventNext = (prog + 1) % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);
                  
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
                                setShowUfoGame(true);
                            } else if (cycle % 7 === 3) {
                                setShowPetRace(true);
                            } else {
                                setShowShellGame(true);
                            }
                          }, 300);
                        }} 
                        color="amber" 
                        className="w-full mt-4 py-4 text-base font-black uppercase tracking-widest animate-pulse shadow-[0_4px_0_#d97706] active:shadow-none active:translate-y-1"
                      >
                        <Icon name="gift" size={18} className="inline-block" />️ Reclamar Recompensa
                      </Button>
                    );
                  }
                  
                  return (
                    <Button 
                      type="button"
                      onClick={loadNextProblem} 
                      color="green" 
                      className="w-full mt-4 py-4 text-base font-black uppercase tracking-widest animate-bounce"
                    >
                      <Icon name="arrow_right" size={18} className="inline-block" />️ Siguiente desafío
                    </Button>
                  );
                })()}
`;

code = code.replace(
  /\{currentProblem\.solved && \([\s\S]*?<\/Button>\n\s*\)\}/,
  replacementButton.trim()
);

// Re-enable minigames in map nodes
code = code.replace(/console\.log\('UFO'\);/g, 'setShowUfoGame(true);');
code = code.replace(/console\.log\('Pet'\);/g, 'setShowPetRace(true);');
code = code.replace(/console\.log\('Shell'\);/g, 'setShowShellGame(true);');

fs.writeFileSync('src/App.tsx', code);
