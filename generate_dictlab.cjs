const fs = require('fs');

const code = `import { Icon } from './CustomIcons';
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

  const allTabs = {
    razonamiento_5to: [
      { id: 'planteo', label: 'Planteo Avanzado', icon: '📊' },
      { id: 'edades', label: 'Edades y Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' }
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
    ]
  };

  const currentTabs = activeCourse === 'razonamiento_5to' ? allTabs.razonamiento_5to : activeCourse === 'trigonometria' ? allTabs.trigonometria : allTabs.razonamiento;
  const tabOrder = currentTabs.map(t => t.id);

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
    <Card className={\`w-full \${isInline ? 'h-full border-0 rounded-none bg-transparent shadow-none p-4 md:p-6' : 'max-w-3xl border-4 border-blue-500 bg-white p-6 md:p-8'} flex flex-col overflow-hidden\`}>
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-4xl drop-shadow-sm select-none"><Icon name="book" size={18} className="inline-block" /></span>
          <div className="text-left">
            <h3 className="text-xl md:text-2xl font-black text-blue-600 leading-tight">Códice Matemático</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Módulo de Teoría</p>
          </div>
        </div>
        {!isInline && onClose && (
          <button 
             onClick={onClose} 
             className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center font-black transition-colors shadow-sm cursor-pointer border border-slate-200"
          >
            ×
          </button>
        )}
      </div>

      {/* Tabs Selector */}
      <div className="w-full flex bg-slate-100 p-1.5 rounded-2xl mb-6 overflow-x-auto shrink-0 no-scrollbar gap-1">
        {currentTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={\`flex-1 py-2.5 px-3 rounded-xl font-bold text-[10px] md:text-xs flex items-center justify-center gap-1.5 transition-all relative shrink-0 cursor-pointer min-w-[110px] md:min-w-0 \${
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }\`}
            >
              {isActive && (
                <motion.div
                  layoutId="codice-tab"
                  className="absolute inset-0 bg-white border border-blue-200 shadow-sm rounded-xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="text-sm relative z-10">{tab.icon}</span>
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="w-full flex-1 overflow-y-auto mb-6 pr-1 text-left relative min-h-[300px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full flex flex-col justify-start gap-4"
          >
            {activeCourse === 'razonamiento_5to' && activeTab === 'planteo' && (
              <div className="bg-emerald-50 p-5 rounded-2xl border-2 border-emerald-200">
                <h4 className="font-black text-emerald-900 text-lg mb-2">Planteo Avanzado y Optimización</h4>
                <p className="text-emerald-800 text-sm font-bold mb-4">La clave en 5to de secundaria es el modelado de variables cuadráticas, sistemas no lineales y máximos/mínimos.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Identifica siempre qué se pide maximizar o minimizar (usualmente vértice de parábola -b/2a).</li>
                  <li>Para ecuaciones diofánticas, asegúrate de que las variables sean enteras y prueba múltiplos.</li>
                  <li>El perímetro (2x + 2y = P) limitará tu área (A = xy).</li>
                </ul>
              </div>
            )}
            {activeCourse === 'razonamiento_5to' && activeTab === 'edades' && (
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
            )}
            {activeCourse === 'razonamiento_5to' && activeTab === 'logica' && (
              <div className="bg-violet-50 p-5 rounded-2xl border-2 border-violet-200">
                <h4 className="font-black text-violet-900 text-lg mb-2">Lógica Inferencial (Verdades y Mentiras)</h4>
                <p className="text-violet-800 text-sm font-bold mb-4">Aplica siempre el Principio de Contradicción.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Busca dos afirmaciones que se contradigan ("Fue Ana" vs "No fue Ana").</li>
                  <li>Si una miente y otra dice la verdad obligatoriamente, las demás afirmaciones quedan definidas por las reglas del problema (ej. "sólo hay un mentiroso").</li>
                  <li>Para extraer bolas de una urna, usa el "Peor de los Casos" (Caso Extremo).</li>
                </ul>
              </div>
            )}
            {activeCourse === 'razonamiento_5to' && activeTab === 'mezclas' && (
              <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-200">
                <h4 className="font-black text-amber-900 text-lg mb-2">Fracciones, Mezclas y Grifos</h4>
                <p className="text-amber-800 text-sm font-bold mb-4">Cálculos de concentraciones y reducción a la unidad.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Grado de Mezcla = (V1·G1 + V2·G2) / (V1 + V2)</li>
                  <li>Reducción a la unidad (Grifos): Si uno llena en A horas, en 1 hora llena 1/A. Si otro vacía en B horas, vacía 1/B.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'razonamiento_5to' && activeTab === 'financiera' && (
              <div className="bg-rose-50 p-5 rounded-2xl border-2 border-rose-200">
                <h4 className="font-black text-rose-900 text-lg mb-2">Mate Financiera y Variaciones</h4>
                <p className="text-rose-800 text-sm font-bold mb-4">Variaciones % geométricas e interés simple.</p>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Área = a × b. Si "a" sube 10% y "b" sube 20%: 1.10 × 1.20 = 1.32 (+32%).</li>
                  <li>Interés (I) = (C × r × t) / 100 (si "t" es anual). Asegúrate de que tasa "r" y tiempo "t" estén en la misma unidad de tiempo.</li>
                </ul>
              </div>
            )}

            {activeCourse === 'trigonometria' && activeTab === 'rt' && (
              <div className="bg-indigo-50 p-5 rounded-2xl border-2 border-indigo-200">
                <h4 className="font-black text-indigo-900 text-lg mb-2">Propiedades de Razones Trigonométricas</h4>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Recíprocas: sen(x)csc(x)=1, cos(x)sec(x)=1, tan(x)cot(x)=1.</li>
                  <li>Corrazones: sen(A)=cos(B), tan(A)=cot(B) si y solo si A + B = 90°.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'trigonometria' && activeTab === 'triangulos' && (
              <div className="bg-teal-50 p-5 rounded-2xl border-2 border-teal-200">
                <h4 className="font-black text-teal-900 text-lg mb-2">Triángulos Rectángulos Notables</h4>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>30° y 60°: Cateto a 30° es k, hipotenusa 2k, cateto a 60° k√3.</li>
                  <li>45°: Catetos k, hipotenusa k√2.</li>
                  <li>37° y 53°: Lados 3k, 4k y 5k.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'trigonometria' && activeTab === 'verticales' && (
              <div className="bg-orange-50 p-5 rounded-2xl border-2 border-orange-200">
                <h4 className="font-black text-orange-900 text-lg mb-2">Ángulos Verticales</h4>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Ángulo de Elevación: Línea visual por encima de la horizontal.</li>
                  <li>Ángulo de Depresión: Línea visual por debajo de la horizontal.</li>
                  <li>Usa tangente (op/ady) para hallar alturas a partir de distancias.</li>
                </ul>
              </div>
            )}
            {activeCourse === 'trigonometria' && activeTab === 'geo_ana' && (
              <div className="bg-cyan-50 p-5 rounded-2xl border-2 border-cyan-200">
                <h4 className="font-black text-cyan-900 text-lg mb-2">Geometría Analítica</h4>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>Distancia: d = √[(x2 - x1)² + (y2 - y1)²].</li>
                  <li>Punto Medio: M = ( (x1+x2)/2 , (y1+y2)/2 ).</li>
                </ul>
              </div>
            )}
            {activeCourse === 'trigonometria' && activeTab === 'pos_norm' && (
              <div className="bg-pink-50 p-5 rounded-2xl border-2 border-pink-200">
                <h4 className="font-black text-pink-900 text-lg mb-2">Ángulos en Posición Normal</h4>
                <ul className="list-disc list-inside text-sm font-bold text-slate-700 space-y-2">
                  <li>P(x,y) en el lado final, radio vector r = √(x²+y²).</li>
                  <li>sen = y/r, cos = x/r, tan = y/x.</li>
                  <li>Signos: I(+todas), II(+sen), III(+tan), IV(+cos).</li>
                </ul>
              </div>
            )}

            {/* Default RM content fallback */}
            {(!activeCourse || activeCourse === 'razonamiento') && (
              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200">
                <h4 className="font-black text-slate-900 text-lg mb-2">Teoría de Razonamiento</h4>
                <p className="text-slate-700 text-sm font-bold">Conceptos básicos de métodos operativos, lógica y criptoaritmética para la base del desarrollo lógico-matemático.</p>
              </div>
            )}
            
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex items-center justify-between border-t border-slate-100 pt-5 mt-auto shrink-0">
        <Button 
           onClick={handlePrev} 
           disabled={currentIndex === 0} 
           color="slate" 
           className="text-[10px] md:text-xs uppercase tracking-wider px-3 md:px-4 py-2"
        >
          ← Ant
        </Button>
        <div className="flex items-center gap-2">
          {tabOrder.map((id, index) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={\`w-2.5 h-2.5 rounded-full transition-all duration-300 \${
                activeTab === id ? 'bg-blue-600 scale-125' : 'bg-slate-300 hover:bg-slate-400'
              }\`}
              title={currentTabs[index].label}
            />
          ))}
        </div>
        <Button 
           onClick={handleNext} 
           color={currentIndex === tabOrder.length - 1 ? "green" : "blue"} 
           className="text-[10px] md:text-xs uppercase tracking-wider px-3 md:px-4 py-2"
        >
          {currentIndex === tabOrder.length - 1 ? (isInline ? "Fin" : <span>Entendido <Icon name="check" size={18} /></span>) : "Sig →"}
        </Button>
      </div>
    </Card>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-pop">
      {content}
    </div>
  );
};
`;

fs.writeFileSync('src/components/DictLabModal.tsx', code);
