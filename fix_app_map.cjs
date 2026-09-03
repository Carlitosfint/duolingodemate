const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className=\{\`p-4 border-b-2 z-50 flex items-center justify-between shadow-sm relative \$\{currentThemeStyle\.headerBg\}\`\}>\s*<div>\s*<h3 className=\{\`font-black uppercase tracking-widest text-sm \$\{currentThemeStyle\.textPrimary\}\`\}>Etapa \{Math\.floor\(progress\/20\) \+ 1\}<\/h3>\s*<p className="text-xs font-bold text-slate-500">\s*\{progress < 20 \? 'Métodos Operativos' : progress < 40 \? 'Criptoaritmética' : progress < 60 \? 'Lógica Recreativa' : progress < 80 \? 'Cronometría Básica' : 'Conteo de Figuras'\}\s*<\/p>\s*<\/div>\s*<\/div>/m;

const replacement = `<div className={\`p-4 border-b-2 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative \${currentThemeStyle.headerBg}\`}>
                     <div>
                       <h3 className={\`font-black uppercase tracking-widest text-sm \${currentThemeStyle.textPrimary}\`}>Etapa {Math.floor(progress/20) + 1}</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {activeCourse === 'trigonometria' ? (
                           progress < 20 ? 'Propiedades de las RT' : progress < 40 ? 'Resolución de Triángulos' : progress < 60 ? 'Ángulos Verticales' : progress < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal'
                         ) : (
                           progress < 20 ? 'Métodos Operativos' : progress < 40 ? 'Criptoaritmética' : progress < 60 ? 'Lógica Recreativa' : progress < 80 ? 'Cronometría Básica' : 'Conteo de Figuras'
                         )}
                       </p>
                     </div>
                     <div className="flex bg-slate-100 p-1 rounded-xl">
                       <button 
                         onClick={() => setActiveCourse('razonamiento')}
                         className={\`flex-1 px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \${activeCourse === 'razonamiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         Razonamiento
                       </button>
                       <button 
                         onClick={() => setActiveCourse('trigonometria')}
                         className={\`flex-1 px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         Trigonometría
                       </button>
                     </div>
                  </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
