const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{viewMode === 'practice' && \(<TabTransition type="swipe" key="practice">\s*<div key="practice" className="flex-1 flex flex-col h-full relative z-10">\s*<div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50\/50">\s*<h2 className="text-xl md:text-2xl font-black text-slate-800 text-center mb-6">Elige un Tema de Práctica<\/h2>\s*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">\s*\{\[\s*\{ id: 'metodos', name: 'Métodos Operativos', icon: '🧠', color: 'bg-blue-500' \},\s*\{ id: 'cripto', name: 'Criptoaritmética', icon: '🔢', color: 'bg-emerald-500' \},\s*\{ id: 'logica', name: 'Lógica Recreativa', icon: '🎲', color: 'bg-amber-500' \},\s*\{ id: 'cronometria', name: 'Cronometría Básica', icon: '⏱️', color: 'bg-purple-500' \},\s*\{ id: 'conteo', name: 'Conteo de Figuras', icon: '📐', color: 'bg-rose-500' \}\s*\]\.map\(topic => \(\s*<div\s*key=\{topic\.id\}\s*onClick=\{\(\) => \{\s*setSelectedTopic\(topic\.id\);\s*playClickSound\(\);\s*setViewMode\('infinite_map'\);\s*\}\}\s*className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1"\s*>\s*<div className=\{\`w-14 h-14 \$\{topic\.color\} rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform\`\}>\s*\{topic\.icon\}\s*<\/div>\s*<h3 className="font-black text-slate-800 text-lg mb-2">\{topic\.name\}<\/h3>\s*<p className="text-xs font-bold text-slate-500">Modo Infinito<\/p>\s*<\/div>\s*\)\)\}\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/TabTransition>\)\}/m;

const replacement = `{viewMode === 'practice' && (<TabTransition type="swipe" key="practice">
                <div key="practice" className="flex-1 flex flex-col h-full relative z-10">
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50/50">
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                       <h2 className="text-xl md:text-2xl font-black text-slate-800">Práctica Infinita</h2>
                       <div className="flex bg-slate-200 p-1 rounded-xl">
                         <button 
                           onClick={() => setActiveCourse('razonamiento')}
                           className={\`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \${activeCourse === 'razonamiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Razonamiento
                         </button>
                         <button 
                           onClick={() => setActiveCourse('trigonometria')}
                           className={\`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Trigonometría
                         </button>
                       </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                       {(activeCourse === 'trigonometria' ? [
                         { id: 'propiedades_rt', name: 'Propiedades de las RT', icon: '📐', color: 'bg-indigo-500' },
                         { id: 'resolucion_triangulos', name: 'Resolución de Triángulos', icon: '📐', color: 'bg-teal-500' },
                         { id: 'angulos_verticales', name: 'Ángulos Verticales', icon: '👀', color: 'bg-orange-500' },
                         { id: 'geometria_analitica', name: 'Intro Geometría Analítica', icon: '📍', color: 'bg-cyan-500' },
                         { id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', icon: '🔄', color: 'bg-pink-500' }
                       ] : [
                         { id: 'metodos', name: 'Métodos Operativos', icon: '🧠', color: 'bg-blue-500' },
                         { id: 'cripto', name: 'Criptoaritmética', icon: '🔢', color: 'bg-emerald-500' },
                         { id: 'logica', name: 'Lógica Recreativa', icon: '🎲', color: 'bg-amber-500' },
                         { id: 'cronometria', name: 'Cronometría Básica', icon: '⏱️', color: 'bg-purple-500' },
                         { id: 'conteo', name: 'Conteo de Figuras', icon: '📐', color: 'bg-rose-500' }
                       ]).map(topic => (
                         <div 
                           key={topic.id} 
                           onClick={() => {
                             setSelectedTopic(topic.id);
                             playClickSound();
                             setViewMode('infinite_map');
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

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
