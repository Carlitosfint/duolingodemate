const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace all courseProgress accesses with a helper or just add geometria_5to
const getProgressCode = `const getCourseProgress = (c, u) => {
    if (c === 'trigonometria') return u?.courseProgress?.trigonometria || 0;
    if (c === 'razonamiento_5to') return u?.courseProgress?.razonamiento_5to || 0;
    if (c === 'geometria_5to') return u?.courseProgress?.geometria_5to || 0;
    return u?.progress || 0;
  };`;

if (!code.includes('getCourseProgress')) {
  code = code.replace(/export default function App\(\) \{/, `export default function App() {\n  ${getProgressCode}`);
}

// Replace in-line progress checks
code = code.replace(/const pLevel = activeCourse === 'trigonometria' \? \(user\.courseProgress\?\.trigonometria \|\| 0\) : activeCourse === 'razonamiento_5to' \? \(user\.courseProgress\?\.razonamiento_5to \|\| 0\) : user\.progress;/g, `const pLevel = getCourseProgress(activeCourse, user);`);

code = code.replace(/const prob = generateMathProblem\(isGolden, selectedTopic, activeCourse === 'trigonometria' \? \(user\?\.courseProgress\?\.trigonometria \|\| 0\) : activeCourse === 'razonamiento_5to' \? \(user\?\.courseProgress\?\.razonamiento_5to \|\| 0\) : \(user\?\.progress \|\| 0\), activeCourse\);/g, `const prob = generateMathProblem(isGolden, selectedTopic, getCourseProgress(activeCourse, user), activeCourse);`);

code = code.replace(/const nextProgress = isInfiniteMode \? \(activeCourse === 'trigonometria' \? \(user\.courseProgress\?\.trigonometria \|\| 0\) : activeCourse === 'razonamiento_5to' \? \(user\.courseProgress\?\.razonamiento_5to \|\| 0\) : user\.progress\) : Math\.min\(100, \(activeCourse === 'trigonometria' \? \(user\.courseProgress\?\.trigonometria \|\| 0\) : activeCourse === 'razonamiento_5to' \? \(user\.courseProgress\?\.razonamiento_5to \|\| 0\) : user\.progress\) \+ 1\);/g, `const nextProgress = isInfiniteMode ? getCourseProgress(activeCourse, user) : Math.min(100, getCourseProgress(activeCourse, user) + 1);`);

code = code.replace(/const progress = activeCourse === 'trigonometria' \? \(user\?\.courseProgress\?\.trigonometria \|\| 0\) : activeCourse === 'razonamiento_5to' \? \(user\?\.courseProgress\?\.razonamiento_5to \|\| 0\) : \(user\?\.progress \|\| 0\);/g, `const progress = getCourseProgress(activeCourse, user);`);

// Update expectedType
const oldExpectedType = `if (activeCourse === 'trigonometria') {
        expectedType = pLevel < 20 ? 'Propiedades de las RT' : pLevel < 40 ? 'Resolución de Triángulos' : pLevel < 60 ? 'Ángulos Verticales' : pLevel < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal';
      } else if (activeCourse === 'razonamiento_5to') {
        expectedType = pLevel < 17 ? 'Edades' : pLevel < 34 ? 'Cronometría' : pLevel < 51 ? 'Lógica Inferencial' : pLevel < 68 ? 'Fracciones y Mezclas' : pLevel < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones';
      } else {
        expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      }`;
      
const newExpectedType = `if (activeCourse === 'trigonometria') {
        expectedType = pLevel < 20 ? 'Propiedades de las RT' : pLevel < 40 ? 'Resolución de Triángulos' : pLevel < 60 ? 'Ángulos Verticales' : pLevel < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal';
      } else if (activeCourse === 'geometria_5to') {
        expectedType = pLevel < 20 ? 'Relaciones Métricas' : pLevel < 40 ? 'Áreas de Regiones' : pLevel < 60 ? 'Superficies Circulares' : pLevel < 80 ? 'Geometría del Espacio' : 'Sólidos y Poliedros';
      } else if (activeCourse === 'razonamiento_5to') {
        expectedType = pLevel < 17 ? 'Edades' : pLevel < 34 ? 'Cronometría' : pLevel < 51 ? 'Lógica Inferencial' : pLevel < 68 ? 'Fracciones y Mezclas' : pLevel < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones';
      } else {
        expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      }`;

code = code.replace(oldExpectedType, newExpectedType);

// Fix DB saving logic for activeCourse
const oldSaveLogic = `if (activeCourse === 'trigonometria') {
          user.courseProgress = { ...user.courseProgress, trigonometria: nextProgress };
        }
        if (activeCourse === 'razonamiento_5to') {
          user.courseProgress = { ...user.courseProgress, razonamiento_5to: nextProgress };
        }`;
        
const newSaveLogic = `if (activeCourse === 'trigonometria') {
          user.courseProgress = { ...user.courseProgress, trigonometria: nextProgress };
        }
        if (activeCourse === 'geometria_5to') {
          user.courseProgress = { ...user.courseProgress, geometria_5to: nextProgress };
        }
        if (activeCourse === 'razonamiento_5to') {
          user.courseProgress = { ...user.courseProgress, razonamiento_5to: nextProgress };
        }`;
        
code = code.replace(oldSaveLogic, newSaveLogic);
code = code.replace(oldSaveLogic, newSaveLogic); // replace again just in case there are 2 occurrences

// Progress Map visuals
const oldMapVisual = `{activeCourse === 'trigonometria' ? (
                           progress < 20 ? 'Propiedades de las RT' : progress < 40 ? 'Resolución de Triángulos' : progress < 60 ? 'Ángulos Verticales' : progress < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal'
                         ) : activeCourse === 'razonamiento_5to' ? (
                           progress < 17 ? 'Edades' : progress < 34 ? 'Cronometría' : progress < 51 ? 'Lógica Inferencial' : progress < 68 ? 'Fracciones y Mezclas' : progress < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones'
                         ) : (
                           progress < 20 ? 'Métodos Operativos' : progress < 40 ? 'Criptoaritmética' : progress < 60 ? 'Lógica Recreativa' : progress < 80 ? 'Cronometría Básica' : 'Conteo de Figuras'
                         )}`;
                         
const newMapVisual = `{activeCourse === 'trigonometria' ? (
                           progress < 20 ? 'Propiedades de las RT' : progress < 40 ? 'Resolución de Triángulos' : progress < 60 ? 'Ángulos Verticales' : progress < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal'
                         ) : activeCourse === 'geometria_5to' ? (
                           progress < 20 ? 'Relaciones Métricas' : progress < 40 ? 'Áreas de Regiones' : progress < 60 ? 'Superficies Circulares' : progress < 80 ? 'Geometría del Espacio' : 'Sólidos y Poliedros'
                         ) : activeCourse === 'razonamiento_5to' ? (
                           progress < 17 ? 'Edades' : progress < 34 ? 'Cronometría' : progress < 51 ? 'Lógica Inferencial' : progress < 68 ? 'Fracciones y Mezclas' : progress < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones'
                         ) : (
                           progress < 20 ? 'Métodos Operativos' : progress < 40 ? 'Criptoaritmética' : progress < 60 ? 'Lógica Recreativa' : progress < 80 ? 'Cronometría Básica' : 'Conteo de Figuras'
                         )}`;
                         
code = code.replace(oldMapVisual, newMapVisual);

// Map Tabs
const oldMapTabs = `<button
                         onClick={() => setActiveCourse('razonamiento_5to')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         RM 5to
                       </button>
                       <button
                         onClick={() => setActiveCourse('trigonometria')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         Trigo 4to
                       </button>`;
                       
const newMapTabs = `<button
                         onClick={() => setActiveCourse('razonamiento_5to')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         RM 5to
                       </button>
                       <button
                         onClick={() => setActiveCourse('geometria_5to')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'geometria_5to' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         Geo 5to
                       </button>
                       <button
                         onClick={() => setActiveCourse('trigonometria')}
                         className={\`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                       >
                         Trigo 4to
                       </button>`;

code = code.replace(oldMapTabs, newMapTabs);

// Practice Tabs
const oldPracticeTabs = `<button
                           onClick={() => setActiveCourse('razonamiento_5to')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Razonamiento 5to
                         </button>
                         <button
                           onClick={() => setActiveCourse('trigonometria')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Trigonometría
                         </button>`;
                         
const newPracticeTabs = `<button
                           onClick={() => setActiveCourse('razonamiento_5to')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Razonamiento 5to
                         </button>
                         <button
                           onClick={() => setActiveCourse('geometria_5to')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'geometria_5to' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Geometría 5to
                         </button>
                         <button
                           onClick={() => setActiveCourse('trigonometria')}
                           className={\`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all \${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                         >
                           Trigonometría
                         </button>`;
                         
code = code.replace(oldPracticeTabs, newPracticeTabs);

// Practice Topics Grid
const oldPracticeGrid = `{(activeCourse === 'trigonometria' ? [
                         { id: 'propiedades_rt', name: 'Propiedades RT', icon: '📐', color: 'bg-indigo-500' },
                         { id: 'resolucion_triangulos', name: 'Resolución Triángulos', icon: '🔺', color: 'bg-purple-500' },
                         { id: 'angulos_verticales', name: 'Ángulos Verticales', icon: '👁️', color: 'bg-blue-500' },
                         { id: 'geometria_analitica', name: 'Geometría Analítica', icon: '📈', color: 'bg-fuchsia-500' },
                         { id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', icon: '🔄', color: 'bg-rose-500' }
                       ] : activeCourse === 'razonamiento_5to' ? [`;
                       
const newPracticeGrid = `{(activeCourse === 'geometria_5to' ? [
                         { id: 'relaciones_metricas', name: 'Relaciones Métricas', icon: '📏', color: 'bg-rose-500' },
                         { id: 'areas_regiones', name: 'Áreas de Regiones', icon: '📐', color: 'bg-pink-500' },
                         { id: 'superficies_circulares', name: 'Superficies Circulares', icon: '⭕', color: 'bg-fuchsia-500' },
                         { id: 'geometria_espacio', name: 'Geometría del Espacio', icon: '🧊', color: 'bg-purple-500' },
                         { id: 'solidos_poliedros', name: 'Sólidos y Poliedros', icon: '🎲', color: 'bg-violet-500' }
                       ] : activeCourse === 'trigonometria' ? [
                         { id: 'propiedades_rt', name: 'Propiedades RT', icon: '📐', color: 'bg-indigo-500' },
                         { id: 'resolucion_triangulos', name: 'Resolución Triángulos', icon: '🔺', color: 'bg-purple-500' },
                         { id: 'angulos_verticales', name: 'Ángulos Verticales', icon: '👁️', color: 'bg-blue-500' },
                         { id: 'geometria_analitica', name: 'Geometría Analítica', icon: '📈', color: 'bg-fuchsia-500' },
                         { id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', icon: '🔄', color: 'bg-rose-500' }
                       ] : activeCourse === 'razonamiento_5to' ? [`;

code = code.replace(oldPracticeGrid, newPracticeGrid);

fs.writeFileSync('src/App.tsx', code);
