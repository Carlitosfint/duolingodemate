const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex bg-slate-200 p-1 rounded-xl">\s*<button \s*onClick=\{\(\) => setActiveCourse\('razonamiento'\)\}\s*className=\{\`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \$\{activeCourse === 'razonamiento' \? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'\}\`\}\s*>\s*Razonamiento\s*<\/button>\s*<button \s*onClick=\{\(\) => setActiveCourse\('trigonometria'\)\}\s*className=\{\`px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \$\{activeCourse === 'trigonometria' \? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'\}\`\}\s*>\s*Trigonometría\s*<\/button>\s*<\/div>/m;

const replacement = `<div className="flex bg-slate-200 p-1 rounded-xl">
                         <button 
                           onClick={() => setActiveCourse('razonamiento')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           RM Básico
                         </button>
                         <button 
                           onClick={() => setActiveCourse('razonamiento_5to')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           RM 5to
                         </button>
                         <button 
                           onClick={() => setActiveCourse('trigonometria')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Trigonometría
                         </button>
                       </div>`;
                       
code = code.replace(regex, replacement);

const topicsRegex = /\{\(activeCourse === 'trigonometria' \? \[\s*\{ id: 'propiedades_rt', name: 'Propiedades de las RT', icon: '📐', color: 'bg-indigo-500' \},\s*\{ id: 'resolucion_triangulos', name: 'Resolución de Triángulos', icon: '📐', color: 'bg-teal-500' \},\s*\{ id: 'angulos_verticales', name: 'Ángulos Verticales', icon: '👀', color: 'bg-orange-500' \},\s*\{ id: 'geometria_analitica', name: 'Intro Geometría Analítica', icon: '📍', color: 'bg-cyan-500' \},\s*\{ id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', icon: '🔄', color: 'bg-pink-500' \}\s*\] : \[\s*\{ id: 'metodos', name: 'Métodos Operativos', icon: '🧠', color: 'bg-blue-500' \},\s*\{ id: 'cripto', name: 'Criptoaritmética', icon: '🔢', color: 'bg-emerald-500' \},\s*\{ id: 'logica', name: 'Lógica Recreativa', icon: '🎲', color: 'bg-amber-500' \},\s*\{ id: 'cronometria', name: 'Cronometría Básica', icon: '⏱️', color: 'bg-purple-500' \},\s*\{ id: 'conteo', name: 'Conteo de Figuras', icon: '📐', color: 'bg-rose-500' \}\s*\]\)\.map/m;

const topicsReplacement = `{(activeCourse === 'trigonometria' ? [
                         { id: 'propiedades_rt', name: 'Propiedades de las RT', icon: '📐', color: 'bg-indigo-500' },
                         { id: 'resolucion_triangulos', name: 'Resolución de Triángulos', icon: '📐', color: 'bg-teal-500' },
                         { id: 'angulos_verticales', name: 'Ángulos Verticales', icon: '👀', color: 'bg-orange-500' },
                         { id: 'geometria_analitica', name: 'Intro Geometría Analítica', icon: '📍', color: 'bg-cyan-500' },
                         { id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', icon: '🔄', color: 'bg-pink-500' }
                       ] : activeCourse === 'razonamiento_5to' ? [
                         { id: 'planteo_avanzado', name: 'Planteo Avanzado', icon: '📊', color: 'bg-emerald-500' },
                         { id: 'edades_cronometria', name: 'Edades y Cronometría', icon: '⏳', color: 'bg-blue-500' },
                         { id: 'logica_inferencial', name: 'Lógica Inferencial', icon: '🧠', color: 'bg-violet-500' },
                         { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', icon: '🧪', color: 'bg-amber-500' },
                         { id: 'matematica_financiera', name: 'Mate Financiera', icon: '💰', color: 'bg-rose-500' }
                       ] : [
                         { id: 'metodos', name: 'Métodos Operativos', icon: '🧠', color: 'bg-blue-500' },
                         { id: 'cripto', name: 'Criptoaritmética', icon: '🔢', color: 'bg-emerald-500' },
                         { id: 'logica', name: 'Lógica Recreativa', icon: '🎲', color: 'bg-amber-500' },
                         { id: 'cronometria', name: 'Cronometría Básica', icon: '⏱️', color: 'bg-purple-500' },
                         { id: 'conteo', name: 'Conteo de Figuras', icon: '📐', color: 'bg-rose-500' }
                       ]).map`;
                       
code = code.replace(topicsRegex, topicsReplacement);
fs.writeFileSync('src/App.tsx', code);
