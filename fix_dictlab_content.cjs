const fs = require('fs');
let code = fs.readFileSync('src/components/DictLabModal.tsx', 'utf8');

const oldDictTabs = `razonamiento_5to: [
      { id: 'edades', label: 'Edades y Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' },
      { id: 'planteo', label: 'Planteo Ecuaciones', icon: '📊' }
    ]`;

const newDictTabs = `razonamiento_5to: [
      { id: 'edades', label: 'Edades', icon: '👨‍👦' },
      { id: 'cronometria', label: 'Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' },
      { id: 'planteo', label: 'Planteo Ecuaciones', icon: '📊' }
    ]`;

code = code.replace(oldDictTabs, newDictTabs);

const oldEdadesContent = `{activeCourse === 'razonamiento_5to' && activeTab === 'edades' && (
              <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                <h4 className="font-black text-blue-900 text-lg mb-2">Edades (3 Tiempos) y Cronometría</h4>
                <p className="text-blue-800 text-sm font-bold mb-4">Los problemas de edades en 5to casi siempre usan la tabla de "Pasado - Presente - Futuro".</p>
                <div className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700 mb-2">
                  La diferencia de edades de dos personas es CONSTANTE en el tiempo.
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700">
                  En Cronometría (relojes): Ángulo θ = |30H - 11M/2|.
                </div>
              </div>
            )}`;

const newEdadesContent = `{activeCourse === 'razonamiento_5to' && activeTab === 'edades' && (
              <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                <h4 className="font-black text-blue-900 text-lg mb-2">Edades (3 Tiempos)</h4>
                <p className="text-blue-800 text-sm font-bold mb-4">Los problemas de edades en 5to casi siempre usan la tabla de "Pasado - Presente - Futuro".</p>
                <div className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700 mb-2">
                  1. La diferencia de edades de dos personas es CONSTANTE en el tiempo.
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 text-sm font-bold text-slate-700">
                  2. La suma en aspa de edades simétricas también es constante.
                </div>
              </div>
            )}
            {activeCourse === 'razonamiento_5to' && activeTab === 'cronometria' && (
              <div className="bg-sky-50 p-5 rounded-2xl border-2 border-sky-200">
                <h4 className="font-black text-sky-900 text-lg mb-2">Cronometría Avanzada</h4>
                <p className="text-sky-800 text-sm font-bold mb-4">Relojes, ángulos, campanadas y adelantos/atrasos.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li><strong>Ángulos:</strong> θ = |30H - 11M/2|. Si el resultado es mayor a 180°, réstalo de 360°.</li>
                  <li><strong>Campanadas:</strong> El tiempo NO se cuenta por campanadas, sino por los INTERVALOS entre ellas (N campanadas = N-1 intervalos).</li>
                </ul>
              </div>
            )}`;

code = code.replace(oldEdadesContent, newEdadesContent);

fs.writeFileSync('src/components/DictLabModal.tsx', code);
