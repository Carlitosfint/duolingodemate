const fs = require('fs');
let code = fs.readFileSync('src/components/DictLabModal.tsx', 'utf8');

// Update TABS config
const oldTabsConfig = `const TABS = {
    razonamiento: [
      { id: 'metodos', label: 'Métodos', icon: '🦀' },
      { id: 'cripto', label: 'Criptoaritmética', icon: '🔢' },
      { id: 'logica', label: 'Lógica', icon: '🧠' },
      { id: 'cronometria', label: 'Cronometría', icon: '⏱️' },
      { id: 'conteo', label: 'Conteo', icon: '📐' }
    ],
    razonamiento_5to: [
      { id: 'edades', label: 'Edades', icon: '👨‍👦' },
      { id: 'cronometria', label: 'Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' },
      { id: 'planteo', label: 'Planteo Ecuaciones', icon: '📊' }
    ],
    trigonometria: [
      { id: 'rt', label: 'Propiedades RT', icon: '📐' },
      { id: 'triangulos', label: 'Triángulos Notables', icon: '🔺' },
      { id: 'verticales', label: 'Ángulos Verticales', icon: '👁️' },
      { id: 'geo_ana', label: 'Geometría Analítica', icon: '📈' },
      { id: 'pos_norm', label: 'Posición Normal', icon: '🔄' }
    ]
  };`;
  
const newTabsConfig = `const TABS = {
    razonamiento: [
      { id: 'metodos', label: 'Métodos', icon: '🦀' },
      { id: 'cripto', label: 'Criptoaritmética', icon: '🔢' },
      { id: 'logica', label: 'Lógica', icon: '🧠' },
      { id: 'cronometria', label: 'Cronometría', icon: '⏱️' },
      { id: 'conteo', label: 'Conteo', icon: '📐' }
    ],
    razonamiento_5to: [
      { id: 'edades', label: 'Edades', icon: '👨‍👦' },
      { id: 'cronometria', label: 'Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' },
      { id: 'planteo', label: 'Planteo Ecuaciones', icon: '📊' }
    ],
    geometria_5to: [
      { id: 'metrica', label: 'Rel. Métricas', icon: '📏' },
      { id: 'areas', label: 'Áreas Tri/Cuad', icon: '📐' },
      { id: 'circulos', label: 'Sup. Circulares', icon: '⭕' },
      { id: 'espacio', label: 'Geo. Espacio', icon: '🧊' },
      { id: 'solidos', label: 'Sólidos', icon: '🎲' }
    ],
    trigonometria: [
      { id: 'rt', label: 'Propiedades RT', icon: '📐' },
      { id: 'triangulos', label: 'Triángulos Notables', icon: '🔺' },
      { id: 'verticales', label: 'Ángulos Verticales', icon: '👁️' },
      { id: 'geo_ana', label: 'Geometría Analítica', icon: '📈' },
      { id: 'pos_norm', label: 'Posición Normal', icon: '🔄' }
    ]
  };`;

code = code.replace(oldTabsConfig, newTabsConfig);

// Insert content for geometria_5to
const geoContent = `
            {activeCourse === 'geometria_5to' && activeTab === 'metrica' && (
              <div className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-200">
                <h4 className="font-black text-rose-900 text-lg mb-2">Relaciones Métricas</h4>
                <p className="text-rose-800 text-sm font-bold mb-4">Triángulos Rectángulos y Circunferencias.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li><strong>Triángulo Rectángulo:</strong> h² = m × n (La altura al cuadrado es el producto de las proyecciones).</li>
                  <li><strong>Teorema de las Cuerdas:</strong> El producto de los segmentos de una cuerda es igual al producto de los segmentos de la otra.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'geometria_5to' && activeTab === 'areas' && (
              <div className="bg-pink-50 p-5 rounded-2xl border-2 border-pink-200">
                <h4 className="font-black text-pink-900 text-lg mb-2">Áreas de Regiones</h4>
                <p className="text-pink-800 text-sm font-bold mb-4">Relación de áreas y fórmula trigonométrica.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li><strong>Mediana:</strong> Divide al triángulo en dos regiones equivalentes (de igual área).</li>
                  <li><strong>Área Trigonométrica:</strong> S = (a × b × sen(θ)) / 2.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'geometria_5to' && activeTab === 'circulos' && (
              <div className="bg-fuchsia-50 p-5 rounded-2xl border-2 border-fuchsia-200">
                <h4 className="font-black text-fuchsia-900 text-lg mb-2">Superficies Circulares</h4>
                <p className="text-fuchsia-800 text-sm font-bold mb-4">Sectores y Coronas.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li><strong>Sector Circular:</strong> S = (π × r² × θ) / 360°.</li>
                  <li><strong>Corona Circular:</strong> S = π(R² - r²). Diferencia de áreas entre dos círculos concéntricos.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'geometria_5to' && activeTab === 'espacio' && (
              <div className="bg-purple-50 p-5 rounded-2xl border-2 border-purple-200">
                <h4 className="font-black text-purple-900 text-lg mb-2">Geometría del Espacio</h4>
                <p className="text-purple-800 text-sm font-bold mb-4">Tres Perpendiculares y Rectas.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li><strong>Recta Perpendicular a un Plano:</strong> Es perpendicular a TODAS las rectas del plano que pasen por el pie de la perpendicular.</li>
                  <li>Usa el <strong>Teorema de Pitágoras</strong> en el espacio (Triángulos rectángulos espaciales).</li>
                </ul>
              </div>
            )}
            {activeCourse === 'geometria_5to' && activeTab === 'solidos' && (
              <div className="bg-violet-50 p-5 rounded-2xl border-2 border-violet-200">
                <h4 className="font-black text-violet-900 text-lg mb-2">Sólidos y Poliedros</h4>
                <p className="text-violet-800 text-sm font-bold mb-4">Cubos y Cilindros.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li><strong>Cubo (Hexaedro Regular):</strong> Tiene 6 caras cuadradas congruentes. Área = 6a².</li>
                  <li><strong>Cilindro (Volumen):</strong> V = π × r² × h (Área de la base por la altura).</li>
                </ul>
              </div>
            )}
`;

// Inject before {activeCourse === 'trigonometria' && activeTab === 'rt' && (
code = code.replace(
  /\{activeCourse === 'trigonometria' && activeTab === 'rt' && \(/,
  geoContent + `            {activeCourse === 'trigonometria' && activeTab === 'rt' && (`
);

// Fallback logic check if user.course is handled properly:
// TABS[activeCourse || 'razonamiento']
// In DictLabModal:
// const currentTabs = activeCourse === 'trigonometria' ? TABS.trigonometria : activeCourse === 'razonamiento_5to' ? TABS.razonamiento_5to : TABS.razonamiento;
const oldCurrentTabs = `const currentTabs = activeCourse === 'trigonometria' ? TABS.trigonometria : activeCourse === 'razonamiento_5to' ? TABS.razonamiento_5to : TABS.razonamiento;`;
const newCurrentTabs = `const currentTabs = activeCourse === 'trigonometria' ? TABS.trigonometria : activeCourse === 'geometria_5to' ? TABS.geometria_5to : activeCourse === 'razonamiento_5to' ? TABS.razonamiento_5to : TABS.razonamiento;`;
code = code.replace(oldCurrentTabs, newCurrentTabs);

fs.writeFileSync('src/components/DictLabModal.tsx', code);
