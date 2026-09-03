const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add selectedTopic state
code = code.replace(
  "const [viewMode, setViewMode] = useState<'map' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher'>('map');",
  "const [viewMode, setViewMode] = useState<'map' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher'>('map');\n  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);"
);

// 2. Change map view to topics view
const topicsMenu = `
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
                               const prob = generateMathProblem(false, topic.id);
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
`;

code = code.replace(
  /<div className="flex-1 relative overflow-hidden">[\s\S]*?<ProgressMap[\s\S]*?<\/div>/,
  topicsMenu
);

// Remove MarketNewsModal render
code = code.replace(/\{showMarketModal && \([\s\S]*?\}\)/g, '');

// Update loadNextProblem to use selectedTopic
code = code.replace(
  /const prob = generateMathProblem\(isGolden, stats\.solved\);/g,
  "const prob = generateMathProblem(isGolden, selectedTopic);"
);

fs.writeFileSync('src/App.tsx', code);
