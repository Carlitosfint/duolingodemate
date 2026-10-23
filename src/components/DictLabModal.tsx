import { DictLabContent } from "./DictLabContent";
import { Icon } from './CustomIcons';
import React, { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import { motion, AnimatePresence } from 'motion/react';

interface DictLabModalProps {
  onClose?: () => void;
  isInline?: boolean;
  activeCourse?: string;
}

export const DictLabModal: React.FC<DictLabModalProps> = ({ onClose, isInline, activeCourse }) => {
  const [bimestre, setBimestre] = useState<'3' | '4'>('3');
  const [activeTab, setActiveTab] = useState<string>('');

  const allTabsBim3: Record<string, { id: string; label: string; icon: string }[]> = {
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
      { id: 'metodos', label: 'Métodos Operativos', icon: '🧠' },
      { id: 'cripto', label: 'Criptoaritmética', icon: '🔢' },
      { id: 'logica', label: 'Lógica Recreativa', icon: '🎲' },
      { id: 'cronometria', label: 'Cronometría Bás.', icon: '⏱️' },
      { id: 'conteo', label: 'Conteo de Figuras', icon: '📐' }
    ],
    geometria_5to: [
      { id: 'metrica', label: 'Relaciones Métricas', icon: '📏' },
      { id: 'areas', label: 'Áreas de Regiones', icon: '📐' },
      { id: 'circulos', label: 'Superficies Circ.', icon: '⭕' },
      { id: 'espacio', label: 'Geometría Espacio', icon: '🧊' },
      { id: 'solidos', label: 'Sólidos y Poliedros', icon: '🎲' }
    ]
  };

  const allTabsBim4: Record<string, { id: string; label: string; icon: string }[]> = {
    razonamiento_5to: [
      { id: 'analisis_combinatorio', label: 'Análisis Combinatorio', icon: '🔢' },
      { id: 'probabilidades', label: 'Probabilidades', icon: '🎲' },
      { id: 'sucesiones_series_5to', label: 'Sucesiones y Series', icon: '📈' },
      { id: 'logaritmos_rm', label: 'Operadores y Log.', icon: '🧮' },
      { id: 'maximos_minimos', label: 'Máximos y Mínimos', icon: '⛰️' },
      { id: 'suficiencia_datos', label: 'Suficiencia de Datos', icon: '⚖️' }
    ],
    trigonometria: [
      { id: 'reduccion_primer_cuadrante', label: 'Reducción 1er Cuad.', icon: '🧭' },
      { id: 'circunferencia_trigonometrica', label: 'Circunferencia Trig.', icon: '⭕' },
      { id: 'identidades_trigonometricas', label: 'Identidades Trig.', icon: '⚡' },
      { id: 'angulos_compuestos', label: 'Ángulos Compuestos', icon: '➕' },
      { id: 'angulo_doble', label: 'Ángulo Doble y Mitad', icon: '✌️' }
    ],
    razonamiento: [
      { id: 'sucesiones', label: 'Sucesiones y Analogías', icon: '🔗' },
      { id: 'series', label: 'Series y Sumatorias', icon: '➕' },
      { id: 'operadores', label: 'Operadores Matemáticos', icon: '⚙️' },
      { id: 'fracciones_rm', label: 'Fracciones y %', icon: '📊' },
      { id: 'certezas', label: 'Certezas y Conteo', icon: '🎯' }
    ],
    geometria_5to: [
      { id: 'prisma_cilindro', label: 'Prisma y Cilindro', icon: '🏛️' },
      { id: 'piramide_cono', label: 'Pirámide y Cono', icon: '🔺' },
      { id: 'esfera_teoremas', label: 'Esfera y Pappus', icon: '🌐' },
      { id: 'recta_circunferencia', label: 'Recta y Circunf.', icon: '📈' },
      { id: 'parabola_elipse', label: 'Parábola y Elipse', icon: '🪐' }
    ]
  };

  const activeMap = bimestre === '3' ? allTabsBim3 : allTabsBim4;
  const currentTabs = activeMap[activeCourse as string] || activeMap.razonamiento;
  const tabOrder = currentTabs.map((t) => t.id);

  useEffect(() => {
    setActiveTab(tabOrder[0]);
  }, [activeCourse, bimestre]);

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
    <Card className={`w-full ${isInline ? 'h-full border-0 rounded-none bg-transparent shadow-none p-4 md:p-6' : 'max-w-4xl max-h-[90vh] md:max-h-[85vh] border-4 border-indigo-500 bg-white !p-4 md:!p-6'} flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-4 shrink-0 border-b-2 border-indigo-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl md:text-5xl select-none">📖</span>
          <div className="text-left">
            <h3 className="text-xl md:text-3xl font-black text-indigo-700 leading-tight">Códice de Fórmulas</h3>
            <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Repaso Teórico y Trucos ✨</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border-2 border-slate-200">
            <button
              onClick={() => setBimestre('3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${bimestre === '3' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-700'}`}
            >
              III Bimestre
            </button>
            <button
              onClick={() => setBimestre('4')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${bimestre === '4' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-indigo-700'}`}
            >
              IV Bimestre
            </button>
          </div>
          {!isInline && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 flex items-center justify-center font-black transition-colors shadow-sm cursor-pointer border border-slate-200 text-lg md:text-xl shrink-0"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="w-full flex bg-slate-100 p-1.5 rounded-2xl mb-4 md:mb-6 overflow-x-auto shrink-0 no-scrollbar gap-1 custom-scrollbar">
        {currentTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-none py-2 md:py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all relative shrink-0 cursor-pointer min-w-max ${
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
              <span className="text-base md:text-lg relative z-10">{tab.icon}</span>
              <span className="relative z-10 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="w-full flex-1 overflow-y-auto pr-2 text-left relative min-h-0 flex flex-col justify-start custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <DictLabContent activeCourse={activeCourse || 'razonamiento'} activeTab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="w-full flex justify-between items-center pt-4 border-t-2 border-indigo-100 shrink-0 mt-auto">
        <Button onClick={handlePrev} disabled={currentIndex === 0} color="slate" className="!py-2 !px-3 md:!px-5 flex-1 md:flex-none">
          <Icon name="arrow_left" size={18} className="mr-1" />
          <span className="text-xs md:text-sm">Anterior</span>
        </Button>
        <div className="flex-1 flex justify-center">
          <span className="text-slate-500 font-black text-xs md:text-sm uppercase tracking-widest bg-slate-100 px-3 md:px-5 py-1.5 md:py-2 rounded-full shadow-inner border border-slate-200">
            {currentIndex + 1} / {tabOrder.length}
          </span>
        </div>
        <Button onClick={handleNext} color={currentIndex === tabOrder.length - 1 ? 'green' : 'blue'} className="!py-2 !px-3 md:!px-5 flex-1 md:flex-none">
          <span className="text-xs md:text-sm">{currentIndex === tabOrder.length - 1 ? 'Entendido' : 'Siguiente'}</span>
          {currentIndex === tabOrder.length - 1 ? <Icon name="check" size={18} className="ml-1" /> : <Icon name="arrow_right" size={18} className="ml-1" />}
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
