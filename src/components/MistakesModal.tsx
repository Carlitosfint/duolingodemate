import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';

interface MistakesModalProps {
  onClose?: () => void;
  mistakesList: { problem: string; userAnswer: string; correctAnswer: string; explanation: string }[];
  isInline?: boolean;
}

export const MistakesModal: React.FC<MistakesModalProps> = ({ onClose, mistakesList, isInline }) => {
  const content = (
    <Card className={`w-full bg-white flex flex-col items-center ${isInline ? 'h-full border-0 rounded-none' : 'max-w-2xl border-4 border-rose-500 p-6 md:p-8'}`}>
      <div className={`p-4 rounded-2xl bg-rose-50 text-rose-500 mb-4 border-2 border-rose-200 shadow-sm ${isInline ? 'mt-8' : ''}`}><Icon name="mistakes" className="inline-block" size={42} /></div>
      <h3 className="text-2xl font-black text-rose-600 mb-2">Libro de Errores</h3>
      <p className="text-slate-500 font-bold mb-6 text-center text-sm">
        Aprender de los fracasos es el pilar de un buen inversionista. Repasa tus respuestas fallidas:
      </p>
      <div className={`w-full overflow-y-auto mb-6 no-scrollbar space-y-4 ${isInline ? 'flex-1 px-8 pb-8' : 'max-h-72 pr-2'}`}>
        {mistakesList.length === 0 ? (
          <div className="text-center text-slate-400 font-bold py-8">
            <Icon name="check" size={18} className="inline-block" /> ¡Increíble! No has cometido errores todavía. ¡Mantén esa precisión!
          </div>
        ) : (
          mistakesList.map((m, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left">
              <div className="font-bold text-slate-800 text-xs md:text-sm mb-2">
                <span className="text-rose-500">#{(idx+1)}:</span> {m.problem}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-black mb-3">
                <div className="bg-rose-50 p-2 rounded-xl border border-rose-100 text-rose-700">Tu respuesta: {m.userAnswer}</div>
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 text-emerald-700">Respuesta Correcta: {m.correctAnswer}</div>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-xl text-[11px] font-medium text-slate-600 border border-blue-100">
                <strong className="text-blue-700">Explicación:</strong> {m.explanation}
              </div>
            </div>
          ))
        )}
      </div>
      {!isInline && onClose && (
        <Button onClick={onClose} color="slate" className="w-full shrink-0">
          Cerrar Libro
        </Button>
      )}
    </Card>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-pop">
      {content}
    </div>
  );
};
