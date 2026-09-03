const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<p className="text-xs font-bold text-slate-500">\s*\{activeCourse === 'trigonometria' \? \(\s*progress < 20 \? 'Propiedades de las RT' : progress < 40 \? 'Resolución de Triángulos' : progress < 60 \? 'Ángulos Verticales' : progress < 80 \? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal'\s*\) : \(\s*progress < 20 \? 'Métodos Operativos' : progress < 40 \? 'Criptoaritmética' : progress < 60 \? 'Lógica Recreativa' : progress < 80 \? 'Cronometría Básica' : 'Conteo de Figuras'\s*\)\}\s*<\/p>/m;

const replacement = `<p className="text-xs font-bold text-slate-500">
                         {activeCourse === 'trigonometria' ? (
                           progress < 20 ? 'Propiedades de las RT' : progress < 40 ? 'Resolución de Triángulos' : progress < 60 ? 'Ángulos Verticales' : progress < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal'
                         ) : activeCourse === 'razonamiento_5to' ? (
                           progress < 20 ? 'Planteo Avanzado' : progress < 40 ? 'Edades y Cronometría' : progress < 60 ? 'Lógica Inferencial' : progress < 80 ? 'Fracciones y Mezclas' : 'Mate Financiera'
                         ) : (
                           progress < 20 ? 'Métodos Operativos' : progress < 40 ? 'Criptoaritmética' : progress < 60 ? 'Lógica Recreativa' : progress < 80 ? 'Cronometría Básica' : 'Conteo de Figuras'
                         )}
                       </p>`;

code = code.replace(regex, replacement);

const btnRegex = /<div className="flex bg-slate-100 p-1 rounded-xl">\s*<button \s*onClick=\{\(\) => setActiveCourse\('razonamiento'\)\}\s*className=\{\`flex-1 px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \$\{activeCourse === 'razonamiento' \? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'\}\`\}\s*>\s*Razonamiento\s*<\/button>\s*<button \s*onClick=\{\(\) => setActiveCourse\('trigonometria'\)\}\s*className=\{\`flex-1 px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all \$\{activeCourse === 'trigonometria' \? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'\}\`\}\s*>\s*Trigonometría\s*<\/button>\s*<\/div>/m;

const btnReplacement = `<div className="flex bg-slate-100 p-1 rounded-xl">
                       <button 
                         onClick={() => setActiveCourse('razonamiento')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         RM Básico
                       </button>
                       <button 
                         onClick={() => setActiveCourse('razonamiento_5to')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         RM 5to
                       </button>
                       <button 
                         onClick={() => setActiveCourse('trigonometria')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         Trigonom.
                       </button>
                     </div>`;

code = code.replace(btnRegex, btnReplacement);
fs.writeFileSync('src/App.tsx', code);
