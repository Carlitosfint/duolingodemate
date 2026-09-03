import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';
import { ProgressMap } from './ProgressMap';

interface ProgressModalProps {
  onClose: () => void;
  progress: number;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({ onClose, progress }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/45 z-[300] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-2xl border-2 border-slate-200 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 text-slate-800 shadow-2xl relative flex flex-col h-[85vh]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-10 pointer-events-none"></div>

        <div className="text-center mb-5 relative z-10 shrink-0">
          <span className="text-3xl mb-1 block"><Icon name="home" size={18} className="inline-block" />️</span>
          <h3 className="text-xl md:text-2xl font-black text-slate-800">
            Ruta de Aprendizaje
          </h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Nivel de Progreso: {progress} / 200</p>
        </div>

        <div className="flex-1 overflow-hidden relative border-2 border-slate-200/80 rounded-[2rem] bg-slate-50/50 shadow-inner mb-5">
          <ProgressMap progress={progress} />
        </div>

        <Button onClick={onClose} color="slate" className="w-full shrink-0 uppercase tracking-wider font-black text-xs">
          Volver a la Mesa de Trabajo
        </Button>
      </div>
    </div>
  );
};
