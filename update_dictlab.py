import re

with open('src/components/DictLabModal.tsx', 'r') as f:
    content = f.read()

# I will replace the allTabs definition, currentTabs definition, and the <AnimatePresence> block.
# Wait, let's just rewrite the whole DictLabModal.tsx to make it easier, keeping the imports.

new_content = """import { Icon } from './CustomIcons';
import React, { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import { motion, AnimatePresence } from 'motion/react';

interface DictLabModalProps {
  onClose?: () => void;
  isInline?: boolean;
  activeCourse?: string;
}

export const DictLabModal: React.FC<DictLabModalProps> = ({ onClose, isInline, activeCourse }) => {
  const [activeTab, setActiveTab] = useState<string>('');

  const allTabs: any = {
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
      { id: 'triangulos', label: 'Resolución de Triángulos', icon: '📐' },
      { id: 'verticales', label: 'Ángulos Verticales', icon: '👀' },
      { id: 'geo_ana', label: 'Geometría Analítica', icon: '📍' },
      { id: 'pos_norm', label: 'Posición Normal', icon: '🔄' }
    ],
    razonamiento: [
      { id: 'figures', label: 'Figuras Clave', icon: '📐' },
      { id: 'factors', label: 'Factores %', icon: '🔢' },
      { id: '1d', label: 'Regla 1D', icon: '💡' },
      { id: '2d', label: 'Regla 2D', icon: '📐' },
    ],
    geometria_5to: [
      { id: 'metrica', label: 'Relaciones Métricas', icon: '📏' },
      { id: 'areas', label: 'Áreas de Regiones', icon: '📐' },
      { id: 'circulos', label: 'Superficies Circ.', icon: '⭕' },
      { id: 'espacio', label: 'Geometría Espacio', icon: '🧊' },
      { id: 'solidos', label: 'Sólidos y Poliedros', icon: '🎲' }
    ]
  };

  const currentTabs = allTabs[activeCourse as string] || allTabs.razonamiento;
  const tabOrder = currentTabs.map((t: any) => t.id);

  useEffect(() => {
    setActiveTab(tabOrder[0]);
  }, [activeCourse]);

  if (!activeTab && tabOrder.length > 0) setActiveTab(tabOrder[0]);

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else if (onClose) {
      onClose();
    }
  };

  const handlePrev = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const currentIndex = tabOrder.indexOf(activeTab);

  const content = (
    <Card className={`w-full ${isInline ? 'h-full border-0 rounded-none bg-transparent shadow-none p-4 md:p-6' : 'max-w-4xl border-4 border-indigo-500 bg-white p-6 md:p-8'} flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6 shrink-0 border-b-2 border-indigo-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl drop-shadow-sm select-none">📖</span>
          <div className="text-left">
            <h3 className="text-xl md:text-3xl font-black text-indigo-700 leading-tight">Códice de Fórmulas</h3>
            <p className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Repaso Teórico y Trucos ✨</p>
          </div>
        </div>
        {!isInline && onClose && (
          <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 flex items-center justify-center font-black transition-colors shadow-sm cursor-pointer border border-slate-200 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="w-full flex bg-slate-100 p-1.5 rounded-2xl mb-6 overflow-x-auto shrink-0 no-scrollbar gap-1 custom-scrollbar">
        {currentTabs.map((tab: any) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-[11px] md:text-sm flex items-center justify-center gap-2 transition-all relative shrink-0 cursor-pointer min-w-[130px] md:min-w-0 ${
                isActive ? 'text-indigo-700' : 'text-slate-500 hover:text-indigo-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="codice-tab"
                  className="absolute inset-0 bg-white border-2 border-indigo-200 shadow-sm rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="text-lg relative z-10">{tab.icon}</span>
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="w-full flex-1 overflow-y-auto mb-6 pr-2 text-left relative min-h-[350px] flex flex-col justify-start custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col justify-start gap-4"
          >
            {/* RAZONAMIENTO 5TO */}
            {activeCourse === 'razonamiento_5to' && activeTab === 'planteo' && (
              <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-sm">
                <h4 className="font-black text-emerald-900 text-xl mb-3 flex items-center gap-2">📊 Planteo de Ecuaciones</h4>
                <p className="text-emerald-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Traducir un problema verbal a lenguaje matemático es el primer gran paso. En 5to, te enfrentarás a sistemas de ecuaciones, inecuaciones y problemas de optimización.
                </p>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 mb-4 shadow-sm">
                  <h5 className="font-bold text-emerald-700 mb-2">💡 Tips Clave:</h5>
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-2">
                    <li><strong>Lee todo el problema:</strong> Antes de escribir "x", asegúrate de saber qué te piden hallar.</li>
                    <li><strong>Usa una sola variable si es posible:</strong> Si te dicen "la suma de dos números es 20", usa <code className="bg-slate-100 text-emerald-600 px-1 rounded">x</code> y <code className="bg-slate-100 text-emerald-600 px-1 rounded">20 - x</code> en lugar de <code className="bg-slate-100 text-emerald-600 px-1 rounded">x</code> e <code className="bg-slate-100 text-emerald-600 px-1 rounded">y</code>.</li>
                    <li><strong>Optimización (Máximos/Mínimos):</strong> Si obtienes una función cuadrática <code className="bg-slate-100 text-emerald-600 px-1 rounded">ax² + bx + c</code>, el vértice se encuentra en <code className="bg-slate-100 text-emerald-600 px-1 font-mono rounded">-b / (2a)</code>.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento_5to' && activeTab === 'edades' && (
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 shadow-sm">
                <h4 className="font-black text-blue-900 text-xl mb-3 flex items-center gap-2">👨‍👦 Problemas de Edades</h4>
                <p className="text-blue-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  ¡El secreto está en ordenar el tiempo! Utiliza una tabla de <strong>Pasado - Presente - Futuro</strong> para alinear a los sujetos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                    <h5 className="font-bold text-blue-700 mb-2">⏱️ Diferencia Constante</h5>
                    <p className="text-sm md:text-base text-slate-700">
                      La diferencia de edades entre dos personas <strong>NUNCA cambia</strong>. Si yo soy 5 años mayor que tú hoy, lo fui hace 10 años y lo seré dentro de 20.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                    <h5 className="font-bold text-blue-700 mb-2">✖️ Suma en Aspa</h5>
                    <p className="text-sm md:text-base text-slate-700">
                      En una tabla de 2 personas, la suma en aspa de tiempos simétricos es igual. Ej: Yo (pasado) + Tú (presente) = Yo (presente) + Tú (pasado).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento_5to' && activeTab === 'cronometria' && (
              <div className="bg-sky-50 p-6 rounded-2xl border-2 border-sky-200 shadow-sm">
                <h4 className="font-black text-sky-900 text-xl mb-3 flex items-center gap-2">⏳ Cronometría Avanzada</h4>
                <p className="text-sky-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Problemas de relojes, campanadas, adelantos y atrasos. ¡Requiere mucha atención a las proporciones!
                </p>
                <div className="bg-white p-4 rounded-xl border border-sky-100 mb-4 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li>
                      <strong className="text-sky-700">Ángulos entre Manecillas:</strong> La fórmula general es <br/>
                      <code className="bg-slate-100 font-mono text-sky-700 px-2 py-1 rounded block mt-1 w-fit">θ = ± (11/2)M ∓ 30H</code><br/>
                      Elige el signo según quién adelante a quién (Horario o Minutero).
                    </li>
                    <li>
                      <strong className="text-sky-700">Campanadas:</strong> No cuentes las campanadas, ¡cuenta los intervalos! <br/>
                      <span className="bg-yellow-100 px-2 rounded font-bold text-yellow-800">Intervalos = Campanadas - 1</span>
                    </li>
                    <li>
                      <strong className="text-sky-700">Adelantos y Atrasos:</strong> Usa regla de 3 simple para calcular el tiempo real. Hora Real = Hora Falsa ± Desajuste.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento_5to' && activeTab === 'logica' && (
              <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-sm">
                <h4 className="font-black text-purple-900 text-xl mb-3 flex items-center gap-2">🧠 Lógica Inferencial</h4>
                <p className="text-purple-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Conectores lógicos, tablas de verdad y deducciones. ¡Piensa como un detective!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                  <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <strong className="text-purple-700">Condicional (p → q):</strong><br/> 
                    Solo es FALSO cuando el antecedente (p) es Verdadero y el consecuente (q) es Falso (V → F = F).
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                    <strong className="text-purple-700">Equivalencia Clave:</strong><br/>
                    (p → q) es lógicamente equivalente a (~p ∨ q). ¡Úsalo para simplificar esquemas largos!
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm md:col-span-2">
                    <strong className="text-purple-700">Silogismos y Cuadros de Decisiones:</strong> Si el problema tiene personas, profesiones y colores, dibuja una tabla de doble entrada. ¡Usa ✔️ y ❌ y rellena los vacíos!
                  </div>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento_5to' && activeTab === 'mezclas' && (
              <div className="bg-teal-50 p-6 rounded-2xl border-2 border-teal-200 shadow-sm">
                <h4 className="font-black text-teal-900 text-xl mb-3 flex items-center gap-2">🧪 Fracciones y Mezclas</h4>
                <p className="text-teal-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Proporciones en aleaciones, reducción a la unidad y mezclas de alcohol/agua.
                </p>
                <div className="bg-white p-4 rounded-xl border border-teal-100 mb-4 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li>
                      <strong className="text-teal-700">Reducción a la Unidad:</strong> Si un grifo llena un tanque en "a" horas y otro lo vacía en "b" horas, en 1 hora hacen: <code className="bg-slate-100 text-teal-600 px-1 rounded">(1/a - 1/b)</code>.
                    </li>
                    <li>
                      <strong className="text-teal-700">Fórmula de Mezclas:</strong> Para hallar el precio medio (Pm) o grado medio de una mezcla: <br/>
                      <code className="bg-slate-100 font-mono text-teal-700 px-2 py-1 rounded block mt-1 w-fit">Pm = (P1*C1 + P2*C2 + ...) / (C1 + C2 + ...)</code>
                    </li>
                    <li>
                      <strong className="text-teal-700">Extracciones sucesivas:</strong> Si extraes 1/3 de lo que hay, te queda 2/3. ¡Multiplica las fracciones de LO QUE QUEDA!
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento_5to' && activeTab === 'financiera' && (
              <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-200 shadow-sm">
                <h4 className="font-black text-rose-900 text-xl mb-3 flex items-center gap-2">💰 Mate Financiera y Variaciones</h4>
                <p className="text-rose-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Interés simple, compuesto y variaciones porcentuales (descuentos o aumentos sucesivos).
                </p>
                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm space-y-3 text-sm md:text-base">
                  <p><strong className="text-rose-700">Descuentos Sucesivos:</strong> No se suman. Si te descuentan 20% y luego 10%, terminas pagando el 80% del 90%. <code className="font-mono text-rose-600">0.80 × 0.90 = 0.72</code> (Has pagado el 72%, el descuento real fue 28%).</p>
                  <p><strong className="text-rose-700">Interés Simple:</strong> <code className="font-mono bg-slate-100 px-2 py-1 rounded text-rose-600">I = (C × r × t) / 100</code> (Solo si el tiempo 't' está en AÑOS). ¡Recuerda homogeneizar la tasa y el tiempo!</p>
                  <p><strong className="text-rose-700">Monto Final:</strong> <code className="font-mono text-rose-600">M = Capital + Interés</code></p>
                </div>
              </div>
            )}

            {/* TRIGONOMETRIA */}
            {activeCourse === 'trigonometria' && activeTab === 'rt' && (
              <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-sm">
                <h4 className="font-black text-indigo-900 text-xl mb-3 flex items-center gap-2">📐 Razones Trigonométricas (RT)</h4>
                <p className="text-indigo-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Sen, Cos, Tan, Cot, Sec, Csc. Las bases fundamentales de cualquier triángulo rectángulo. ¡Apréndete SOH-CAH-TOA!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                    <h5 className="font-bold text-indigo-700 mb-2">🔄 Recíprocas (Inversas)</h5>
                    <ul className="text-sm md:text-base text-slate-700 font-mono space-y-1">
                      <li>sen(x) × csc(x) = 1</li>
                      <li>cos(x) × sec(x) = 1</li>
                      <li>tan(x) × cot(x) = 1</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                    <h5 className="font-bold text-indigo-700 mb-2">🤝 Corrazones (Complementarios)</h5>
                    <p className="text-sm md:text-base text-slate-700 mb-2">Si α + β = 90°:</p>
                    <ul className="text-sm md:text-base text-slate-700 font-mono space-y-1">
                      <li>sen(α) = cos(β)</li>
                      <li>tan(α) = cot(β)</li>
                      <li>sec(α) = csc(β)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeCourse === 'trigonometria' && activeTab === 'triangulos' && (
              <div className="bg-teal-50 p-6 rounded-2xl border-2 border-teal-200 shadow-sm">
                <h4 className="font-black text-teal-900 text-xl mb-3 flex items-center gap-2">📐 Triángulos Rectángulos Notables</h4>
                <p className="text-teal-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Debes saberte estos triángulos de memoria. Te ahorrarán el 90% del tiempo en el examen.
                </p>
                <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row gap-4 border-b border-slate-100 pb-3">
                    <strong className="text-teal-700 w-24 shrink-0 text-lg">30° y 60°</strong>
                    <span className="text-slate-700">Hipotenusa = <strong className="text-lg">2k</strong>, Cateto opuesto a 30° = <strong className="text-lg">k</strong>, Cateto opuesto a 60° = <strong className="text-lg">k√3</strong></span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 border-b border-slate-100 pb-3">
                    <strong className="text-teal-700 w-24 shrink-0 text-lg">45° y 45°</strong>
                    <span className="text-slate-700">Ambos catetos = <strong className="text-lg">k</strong>, Hipotenusa = <strong className="text-lg">k√2</strong></span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 pb-1">
                    <strong className="text-teal-700 w-24 shrink-0 text-lg">37° y 53°</strong>
                    <span className="text-slate-700">El famoso triángulo 3, 4, 5. Opuesto a 37° = <strong className="text-lg">3k</strong>, Opuesto a 53° = <strong className="text-lg">4k</strong>, Hipotenusa = <strong className="text-lg">5k</strong></span>
                  </div>
                </div>
              </div>
            )}

            {activeCourse === 'trigonometria' && activeTab === 'verticales' && (
              <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200 shadow-sm">
                <h4 className="font-black text-orange-900 text-xl mb-3 flex items-center gap-2">👀 Ángulos Verticales</h4>
                <p className="text-orange-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Problemas de visualización, faros, torres y edificios. Siempre haz un dibujo limpio primero.
                </p>
                <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-orange-600">Línea Horizontal:</strong> Es la línea de referencia que sale directamente de los ojos del observador, paralela al suelo.</li>
                    <li><strong className="text-orange-600">Ángulo de Elevación (α):</strong> El ángulo formado HASTA ARRIBA entre la línea horizontal y la línea visual hacia el objeto.</li>
                    <li><strong className="text-orange-600">Ángulo de Depresión (β):</strong> El ángulo formado HACIA ABAJO entre la horizontal y la visual. ¡Ojo! Por alternos internos, el ángulo de depresión suele ser igual al de elevación desde abajo.</li>
                    <li className="bg-orange-100/50 p-2 rounded">💡 <strong>Truco:</strong> La mayoría se resuelve usando la función <code className="font-bold">Tangente = (Cat. Opuesto / Cat. Adyacente)</code>.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'trigonometria' && activeTab === 'geo_ana' && (
              <div className="bg-cyan-50 p-6 rounded-2xl border-2 border-cyan-200 shadow-sm">
                <h4 className="font-black text-cyan-900 text-xl mb-3 flex items-center gap-2">📍 Geometría Analítica</h4>
                <p className="text-cyan-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Puntos en el plano cartesiano (x, y). ¡Domina estas fórmulas y no habrá recta que te detenga!
                </p>
                <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-sm space-y-4">
                  <div>
                    <h5 className="font-bold text-cyan-700 mb-1">📏 Distancia entre dos puntos A(x₁, y₁) y B(x₂, y₂)</h5>
                    <code className="bg-slate-100 font-mono text-slate-700 px-2 py-1 rounded block w-fit shadow-sm">d = √[(x₂ - x₁)² + (y₂ - y₁)²]</code>
                    <p className="text-xs text-slate-500 mt-1 italic">¡Es básicamente el Teorema de Pitágoras!</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-cyan-700 mb-1">🎯 Punto Medio (M)</h5>
                    <code className="bg-slate-100 font-mono text-slate-700 px-2 py-1 rounded block w-fit shadow-sm">M = ( (x₁ + x₂)/2 , (y₁ + y₂)/2 )</code>
                  </div>
                  <div>
                    <h5 className="font-bold text-cyan-700 mb-1">📈 Pendiente de una Recta (m)</h5>
                    <code className="bg-slate-100 font-mono text-slate-700 px-2 py-1 rounded block w-fit shadow-sm">m = (y₂ - y₁) / (x₂ - x₁) = tan(θ)</code>
                  </div>
                </div>
              </div>
            )}

            {activeCourse === 'trigonometria' && activeTab === 'pos_norm' && (
              <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200 shadow-sm">
                <h4 className="font-black text-pink-900 text-xl mb-3 flex items-center gap-2">🔄 Ángulos en Posición Normal</h4>
                <p className="text-pink-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Se acabó estar solo en el primer cuadrante. Ahora vamos a los 360° y más allá con el Radio Vector (r).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                    <h5 className="font-bold text-pink-700 mb-2">Fórmulas Generales (x, y, r)</h5>
                    <ul className="text-sm md:text-base text-slate-700 font-mono space-y-1">
                      <li>r = √(x² + y²) <span className="text-xs text-slate-400"> (r siempre es positivo +)</span></li>
                      <li>sen(θ) = y / r</li>
                      <li>cos(θ) = x / r</li>
                      <li>tan(θ) = y / x</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                    <h5 className="font-bold text-pink-700 mb-2">Signos por Cuadrante</h5>
                    <ul className="text-sm md:text-base text-slate-700 space-y-1">
                      <li><strong>I Cuadrante:</strong> ¡Todas son Positivas! 😃</li>
                      <li><strong>II Cuadrante:</strong> Solo Sen y Csc son (+)</li>
                      <li><strong>III Cuadrante:</strong> Solo Tan y Cot son (+)</li>
                      <li><strong>IV Cuadrante:</strong> Solo Cos y Sec son (+)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* RAZONAMIENTO */}
            {activeCourse === 'razonamiento' && activeTab === 'figures' && (
              <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-sm">
                <h4 className="font-black text-indigo-900 text-xl mb-3 flex items-center gap-2">📐 Figuras Clave</h4>
                <p className="text-indigo-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Reconocimiento rápido de perímetros, áreas y secuencias geométricas.
                </p>
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-indigo-700">Contar Figuras:</strong> Usa el método combinatorio n(n+1)/2 para contar triángulos o segmentos en línea.</li>
                    <li><strong className="text-indigo-700">Áreas Sombreadas:</strong> Generalmente se resuelven por RESTA de áreas: (Área Total) - (Área Blanca).</li>
                    <li><strong className="text-indigo-700">Traslación de Áreas:</strong> A veces, si mueves un pedacito de la figura, ¡completa un cuadrado o círculo perfecto!</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento' && activeTab === 'factors' && (
              <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-200 shadow-sm">
                <h4 className="font-black text-rose-900 text-xl mb-3 flex items-center gap-2">🔢 Factores y Porcentajes</h4>
                <p className="text-rose-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Operaciones rápidas con porcentajes y fracciones para problemas comerciales.
                </p>
                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li>El "20% del 30% de 500" se traduce matemáticamente a multiplicaciones: <code className="bg-slate-100 text-rose-600 px-1 rounded">(20/100) × (30/100) × 500</code>.</li>
                    <li><strong className="text-rose-700">Ganancia y Pérdida:</strong> Precio de Venta (Pv) = Precio de Costo (Pc) + Ganancia (G).</li>
                    <li>¡Asume <strong className="text-rose-700">100</strong>! Si no te dan un valor inicial, asumir que tienes 100 unidades o S/ 100 facilita inmensamente el cálculo porcentual.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento' && activeTab === '1d' && (
              <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 shadow-sm">
                <h4 className="font-black text-amber-900 text-xl mb-3 flex items-center gap-2">💡 Regla 1D (Regla de Tres y Sucesiones)</h4>
                <p className="text-amber-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Proporcionalidad directa, inversa y sucesiones numéricas.
                </p>
                <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-amber-700">Magnitudes Directamente Proporcionales (DP):</strong> Si una sube, la otra también sube en la misma proporción. (División Constante A/B=k).</li>
                    <li><strong className="text-amber-700">Magnitudes Inversamente Proporcionales (IP):</strong> Si una sube, la otra baja. Ej: (Velocidad y Tiempo). (Multiplicación Constante A×B=k).</li>
                    <li><strong className="text-amber-700">Sucesiones:</strong> Busca la razón aritmética (+, -) o geométrica (×, ÷). Si no sale a la primera, ¡busca en un segundo nivel!</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'razonamiento' && activeTab === '2d' && (
              <div className="bg-cyan-50 p-6 rounded-2xl border-2 border-cyan-200 shadow-sm">
                <h4 className="font-black text-cyan-900 text-xl mb-3 flex items-center gap-2">📐 Regla 2D (Operadores Matemáticos)</h4>
                <p className="text-cyan-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">
                  Criptoaritmética, arreglos numéricos y operadores con reglas definidas.
                </p>
                <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-cyan-700">Operadores Arbitrarios (*, #, ∆):</strong> Sigue estrictamente la regla de formación. ¡Reemplaza los valores con cuidado!</li>
                    <li><strong className="text-cyan-700">Cuadrados Mágicos:</strong> La suma de filas, columnas y diagonales siempre es igual. El valor central suele ser el promedio.</li>
                    <li><strong className="text-cyan-700">Criptoaritmética:</strong> Si sumas M + A + S = 22, recuerda que llevas "2" a la siguiente columna. ¡Las unidades y decenas importan!</li>
                  </ul>
                </div>
              </div>
            )}

            {/* GEOMETRIA 5TO */}
            {activeCourse === 'geometria_5to' && activeTab === 'metrica' && (
              <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-200 shadow-sm">
                <h4 className="font-black text-rose-900 text-xl mb-3 flex items-center gap-2">📏 Relaciones Métricas</h4>
                <p className="text-rose-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">Triángulos Rectángulos y Circunferencias.</p>
                <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-rose-700">Triángulo Rectángulo:</strong> h² = m × n (La altura relativa a la hipotenusa al cuadrado es el producto de las proyecciones).</li>
                    <li><strong className="text-rose-700">Teorema de las Cuerdas:</strong> Si dos cuerdas se cruzan, el producto de los segmentos de una es igual al producto de los segmentos de la otra (a×b = c×d).</li>
                    <li><strong className="text-rose-700">Teorema de la Tangente:</strong> T² = Secante Exterior × Secante Total.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'geometria_5to' && activeTab === 'areas' && (
              <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-200 shadow-sm">
                <h4 className="font-black text-pink-900 text-xl mb-3 flex items-center gap-2">📐 Áreas de Regiones</h4>
                <p className="text-pink-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">Fórmulas maestras para polígonos.</p>
                <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-pink-700">Mediana de un triángulo:</strong> Lo divide en dos regiones equivalentes (de igual área).</li>
                    <li><strong className="text-pink-700">Área Trigonométrica:</strong> S = (a × b × sen(θ)) / 2.</li>
                    <li><strong className="text-pink-700">Herón:</strong> Si conoces los 3 lados, Semi-perímetro p = (a+b+c)/2, Área = √[p(p-a)(p-b)(p-c)].</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'geometria_5to' && activeTab === 'circulos' && (
              <div className="bg-fuchsia-50 p-6 rounded-2xl border-2 border-fuchsia-200 shadow-sm">
                <h4 className="font-black text-fuchsia-900 text-xl mb-3 flex items-center gap-2">⭕ Superficies Circulares</h4>
                <p className="text-fuchsia-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">Círculos, sectores, y coronas.</p>
                <div className="bg-white p-4 rounded-xl border border-fuchsia-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-fuchsia-700">Sector Circular:</strong> S = (π × r² × θ) / 360° (Si θ está en grados).</li>
                    <li><strong className="text-fuchsia-700">Corona Circular:</strong> S = π(R² - r²). Es la diferencia de áreas entre dos círculos concéntricos.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'geometria_5to' && activeTab === 'espacio' && (
              <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 shadow-sm">
                <h4 className="font-black text-purple-900 text-xl mb-3 flex items-center gap-2">🧊 Geometría del Espacio</h4>
                <p className="text-purple-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">Rectas, Planos y diedros.</p>
                <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-purple-700">Recta Perpendicular a un Plano:</strong> Si una recta es perpendicular a un plano, es perpendicular a TODAS las rectas del plano que pasen por su pie.</li>
                    <li><strong className="text-purple-700">Teorema de las Tres Perpendiculares:</strong> Clave para hallar distancias espaciales usando Pitágoras repetidas veces.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeCourse === 'geometria_5to' && activeTab === 'solidos' && (
              <div className="bg-violet-50 p-6 rounded-2xl border-2 border-violet-200 shadow-sm">
                <h4 className="font-black text-violet-900 text-xl mb-3 flex items-center gap-2">🎲 Sólidos y Poliedros</h4>
                <p className="text-violet-800 text-sm md:text-base font-semibold mb-4 leading-relaxed">Cubos, Prisma, Cilindros, Esferas.</p>
                <div className="bg-white p-4 rounded-xl border border-violet-100 shadow-sm">
                  <ul className="list-disc list-inside text-sm md:text-base text-slate-700 space-y-3">
                    <li><strong className="text-violet-700">Volumen General (Prismas/Cilindros):</strong> V = Área Base × Altura.</li>
                    <li><strong className="text-violet-700">Volumen con Punta (Pirámides/Conos):</strong> V = (Área Base × Altura) / 3.</li>
                    <li><strong className="text-violet-700">Esfera:</strong> Volumen = (4/3)πR³. Área Superficie = 4πR².</li>
                  </ul>
                </div>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex items-center justify-between border-t-2 border-slate-100 pt-6 mt-auto shrink-0">
        <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            color="slate"
            className="text-xs md:text-sm font-bold tracking-wider px-4 md:px-5 py-2.5 shadow-sm"
        >
          ← Anterior
        </Button>
        <div className="flex items-center gap-2.5">
          {tabOrder.map((id: any, index: number) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTab === id ? 'bg-indigo-600 scale-125 ring-2 ring-indigo-200 ring-offset-2' : 'bg-slate-300 hover:bg-indigo-300'
              }`}
              title={currentTabs[index].label}
            />
          ))}
        </div>
        <Button
            onClick={handleNext}
            color={currentIndex === tabOrder.length - 1 ? "green" : "indigo"}
            className="text-xs md:text-sm font-bold tracking-wider px-4 md:px-5 py-2.5 shadow-sm"
        >
          {currentIndex === tabOrder.length - 1 ? (isInline ? "Finalizar" : <span className="flex items-center gap-1">Entendido <Icon name="check" size={18} /></span>) : "Siguiente →"}
        </Button>
      </div>
    </Card>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[300] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
      {content}
    </div>
  );
};
"""

with open('src/components/DictLabModal.tsx', 'w') as f:
    f.write(new_content)
    
print("DictLabModal completely rewritten with rich theory content!")
