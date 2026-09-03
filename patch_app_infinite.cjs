const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const \[viewMode, setViewMode\] = useState<'map' \| 'practice' \| 'exercise' \| 'codice' \| 'album' \| 'shop' \| 'mistakes' \| 'profile' \| 'teacher'>\('map'\);/,
  "const [viewMode, setViewMode] = useState<'map' | 'practice' | 'infinite_map' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher'>('map');"
);

// We need to change the onClick for practice grid items
code = code.replace(
  /onClick=\{\(\) => \{\s*setSelectedTopic\(topic\.id\);\s*const prob = generateMathProblem\(false, topic\.id, progress\);\s*setCurrentProblem\(\{ data: prob, solved: false, timestamp: Date\.now\(\) \}\);\s*setInputAnswer\(""\);\s*setAnswerState\(\{ type: 'idle', text: null \}\);\s*playClickSound\(\);\s*setViewMode\('exercise'\);\s*\}\}/g,
  `onClick={() => {
                             setSelectedTopic(topic.id);
                             playClickSound();
                             setViewMode('infinite_map');
                           }}`
);

// And we need to add the infinite_map view
const infiniteMapContent = `{viewMode === 'infinite_map' && selectedTopic && (<TabTransition type="swipe" key="infinite_map">
                <div key="infinite_map" className="flex-1 flex flex-col h-full relative z-10">
                  <div className={\`p-4 border-b-2 z-50 flex items-center justify-between shadow-sm relative \${currentThemeStyle.headerBg}\`}>
                     <div>
                       <h3 className={\`font-black uppercase tracking-widest text-sm \${currentThemeStyle.textPrimary}\`}>Modo Infinito</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {selectedTopic === 'metodos' ? 'Métodos Operativos' : selectedTopic === 'cripto' ? 'Criptoaritmética' : selectedTopic === 'logica' ? 'Lógica Recreativa' : selectedTopic === 'cronometria' ? 'Cronometría Básica' : 'Conteo de Figuras'}
                       </p>
                     </div>
                     <button onClick={() => setViewMode('practice')} className="p-2 bg-slate-200/50 rounded-lg hover:bg-slate-300/50 transition-colors">
                       <Icon name="x" size={20} className="text-slate-600" />
                     </button>
                  </div>
                  
                  <div className="flex-1 relative overflow-hidden">
                     <ProgressMap 
                       progress={infiniteProgress[selectedTopic] || 0} 
                       isInfiniteMode={true}
                       totalStepsOverride={200}
                       onNodeClick={(step) => {
                        const curProg = infiniteProgress[selectedTopic] || 0;
                        if (step < curProg) {
                          if ((step + 1) % 3 !== 0) {
                            const prob = generateMathProblem(false, selectedTopic, step);
                            setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
                            setInputAnswer("");
                            setAnswerState({ type: 'idle', text: null });
                            setViewMode('exercise');
                          } else alert("Ya reclamaste esta recompensa en el pasado.");
                        } else if (step === curProg) {
                          if ((step + 1) % 3 === 0 && (step % 10 !== 0)) { 
                             if ((Math.floor((step + 1) / 3)) % 7 === 0) {
                               setShowUfoGame(true);
                             } else if ((Math.floor((step + 1) / 3)) % 7 === 3) {
                               setShowPetRace(true);
                             } else {
                               setShowShellGame(true);
                             }
                          } else {
                            const prob = generateMathProblem(false, selectedTopic, step);
                            setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
                            setInputAnswer("");
                            setAnswerState({ type: 'idle', text: null });
                            setViewMode('exercise');
                          }
                        }
                     }} />
                  </div>
                </div>
              </TabTransition>)}
              
              {viewMode === 'practice'`;

code = code.replace(/\{viewMode === 'practice'/g, infiniteMapContent);

fs.writeFileSync('src/App.tsx', code);
