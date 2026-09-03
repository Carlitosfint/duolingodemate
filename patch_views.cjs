const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update viewMode type
code = code.replace(
  "const [viewMode, setViewMode] = useState<'map' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher'>('map');",
  "const [viewMode, setViewMode] = useState<'map' | 'practice' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher'>('map');"
);

// Add 'practice' button to Desktop Navigation
code = code.replace(
  /<button onClick=\{\(\) => setViewMode\('map'\)\} className=\{`flex items-center gap-4 \$\{viewMode === 'map' \? 'text-blue-600' : `\$\{currentThemeStyle.textPrimary\} hover:bg-slate-100`\} font-bold p-3 rounded-2xl transition-all relative`\}>\s*\{viewMode === 'map' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50\/80 border-2 border-blue-200 rounded-2xl z-0" transition=\{\{ type: 'spring', stiffness: 300, damping: 30 \}\} \/>\}\s*<Icon name="home" className="relative z-10" \/> <span className="relative z-10">Práctica<\/span>\s*<\/button>/,
  `<button onClick={() => setViewMode('map')} className={\`flex items-center gap-4 \${viewMode === 'map' ? 'text-blue-600' : \`\${currentThemeStyle.textPrimary} hover:bg-slate-100\`} font-bold p-3 rounded-2xl transition-all relative\`}>
    {viewMode === 'map' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
    <Icon name="home" className="relative z-10" /> <span className="relative z-10">Aprender</span>
  </button>
  <button onClick={() => setViewMode('practice')} className={\`flex items-center gap-4 \${viewMode === 'practice' ? 'text-blue-600' : \`\${currentThemeStyle.textPrimary} hover:bg-slate-100\`} font-bold p-3 rounded-2xl transition-all relative\`}>
    {viewMode === 'practice' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
    <Icon name="target" className="relative z-10" /> <span className="relative z-10">Práctica</span>
  </button>`
);

// Replace Map content
const mapContent = `{viewMode === 'map' && (<TabTransition type="swipe" key="map">
                <div key="map" className="flex-1 flex flex-col h-full relative z-10">
                  <div className={\`p-4 border-b-2 z-50 flex items-center justify-between shadow-sm relative \${currentThemeStyle.headerBg}\`}>
                     <div>
                       <h3 className={\`font-black uppercase tracking-widest text-sm \${currentThemeStyle.textPrimary}\`}>Etapa {Math.floor(progress/20) + 1}</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {progress < 20 ? 'Métodos Operativos' : progress < 40 ? 'Criptoaritmética' : progress < 60 ? 'Lógica Recreativa' : progress < 80 ? 'Cronometría Básica' : 'Conteo de Figuras'}
                       </p>
                     </div>
                  </div>
                  
                  <div className="flex-1 relative overflow-hidden">
                     <ProgressMap progress={progress} onNodeClick={(step) => {
                        if (step < progress) {
                          if ((step + 1) % 3 !== 0) {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          } else alert("Ya reclamaste esta recompensa en el pasado.");
                        } else if (step === progress) {
                          if ((step + 1) % 3 === 0) { 
                             if ((Math.floor((step + 1) / 3)) % 7 === 0) {
                               setShowUfoGame(true);
                             } else if ((Math.floor((step + 1) / 3)) % 7 === 3) {
                               setShowPetRace(true);
                             } else {
                               setShowShellGame(true);
                             }
                          } else {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          }
                        }
                     }} />
                  </div>
                </div>
              </TabTransition>)}

              {viewMode === 'practice' && (<TabTransition type="swipe" key="practice">
                <div key="practice" className="flex-1 flex flex-col h-full relative z-10">
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50/50">
                     <h2 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-6">Elige un Tema de Práctica</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                       {[
                         { id: 'metodos', name: 'Métodos Operativos', icon: '🧠', color: 'bg-blue-500' },
                         { id: 'cripto', name: 'Criptoaritmética', icon: '🔢', color: 'bg-emerald-500' },
                         { id: 'logica', name: 'Lógica Recreativa', icon: '🎲', color: 'bg-amber-500' },
                         { id: 'cronometria', name: 'Cronometría Básica', icon: '⏱️', color: 'bg-purple-500' },
                         { id: 'conteo', name: 'Conteo de Figuras', icon: '📐', color: 'bg-rose-500' }
                       ].map(topic => (
                         <div 
                           key={topic.id} 
                           onClick={() => {
                             setSelectedTopic(topic.id);
                             const prob = generateMathProblem(false, topic.id, progress);
                             setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
                             setInputAnswer("");
                             setAnswerState({ type: 'idle', text: null });
                             playClickSound();
                             setViewMode('exercise');
                           }}
                           className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1"
                         >
                            <div className={\`w-14 h-14 \${topic.color} rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform\`}>
                              {topic.icon}
                            </div>
                            <h3 className="font-black text-slate-800 text-lg mb-2">{topic.name}</h3>
                            <p className="text-xs font-bold text-slate-500">Modo Infinito</p>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              </TabTransition>)}`;

code = code.replace(
  /\{viewMode === 'map' && \(\<TabTransition type="swipe" key="map"\>[\s\S]*?<\/TabTransition>\)\}/,
  mapContent
);

// Update calls to generateMathProblem
code = code.replace(
  /const prob = generateMathProblem\(false, 0\);/g,
  "const prob = generateMathProblem(false, null, 0);"
);

code = code.replace(
  /const prob = generateMathProblem\(isGolden, selectedTopic\);/g,
  "const prob = generateMathProblem(isGolden, selectedTopic, user?.progress || 0);"
);

fs.writeFileSync('src/App.tsx', code);
