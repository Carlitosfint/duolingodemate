const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix DESAFÍO text
code = code.replace(
  /DESAFÍO \{\(viewMode === 'infinite_map' \? \(infiniteProgress\[selectedTopic!\] \|\| 0\) : \(user\?\.progress \|\| 0\)\) \+ 1\} - \{selectedTopic === 'metodos' \? 'MÉTODOS OPERATIVOS' : selectedTopic === 'cripto' \? 'CRIPTOARITMÉTICA' : selectedTopic === 'logica' \? 'LÓGICA RECREATIVA' : selectedTopic === 'cronometria' \? 'CRONOMETRÍA BÁSICA' : 'CONTEO DE FIGURAS'\}/,
  `DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic!] || 0) : (user?.progress || 0)) + 1} - {(() => {
    const isInf = viewMode === 'infinite_map';
    const p = isInf ? (infiniteProgress[selectedTopic!] || 0) : (user?.progress || 0);
    const t = isInf ? selectedTopic : (p < 20 ? 'metodos' : p < 40 ? 'cripto' : p < 60 ? 'logica' : p < 80 ? 'cronometria' : 'conteo');
    return t === 'metodos' ? 'MÉTODOS OPERATIVOS' : t === 'cripto' ? 'CRIPTOARITMÉTICA' : t === 'logica' ? 'LÓGICA RECREATIVA' : t === 'cronometria' ? 'CRONOMETRÍA BÁSICA' : 'CONTEO DE FIGURAS';
  })()}`
);

// Fix ProgressMap onNodeClick
code = code.replace(
  /if \(\(step \+ 1\) % 3 === 0 && \(step % 20 !== 0\)\) \{[\s\S]*?\} else \{/m,
  `if ((step + 1) % 3 === 0 && (step % 20 !== 0)) { 
                             const cycle = Math.floor((step + 1) / 3);
                             if (cycle % 7 === 0) {
                               setShowShellGame(true);
                             } else if (cycle % 7 === 3) {
                               setShowPetRace(true);
                             } else {
                               openRandomChest('rare');
                               advanceEventProgress();
                             }
                          } else {`
);

// Fix Reclamar Recompensa button
code = code.replace(
  /const isEventNext = \(prog \+ 1\) % 3 === 0 && \(prog % \(viewMode === 'infinite_map' \? 10 : 20\) !== 0\);[\s\S]*?if \(isEventNext\) \{[\s\S]*?return \([\s\S]*?<Button[\s\S]*?onClick=\{.*?\}[\s\S]*?color="amber"[\s\S]*?>/m,
  `const isEventNext = prog > 0 && prog % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);
                  
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
                      >`
);

fs.writeFileSync('src/App.tsx', code);
