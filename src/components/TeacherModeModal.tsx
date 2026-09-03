import { Icon } from './CustomIcons';
import React, { useState } from 'react';
import { Card, Button } from './UI';

interface TeacherModeModalProps {
  onClose?: () => void;
  callGemini: (prompt: string) => Promise<string>;
  currentProblemIntro: string | undefined;
  currentProblemAnswer: string | undefined;
  currentProblemExplanation: string | undefined;
  isInline?: boolean;
}

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({
  onClose,
  callGemini,
  currentProblemIntro,
  currentProblemAnswer,
  currentProblemExplanation,
  isInline
}) => {
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState<React.ReactNode>("¡Hola! Soy tu tutor financiero personal del Colegio Ángeles de Jesús. Pregúntame lo que quieras sobre el problema actual o pídeme un consejo de finanzas.");
  const [customPrompt, setCustomPrompt] = useState("");

  const askTutor = async (promptText: string) => {
    setLoading(true);
    setAiText(<span className="flex items-center gap-1">El tutor está analizando la pizarra con tiza y calculadora... <Icon name="book" size={18} /></span>);
    
    const context = `
      CONTEXTO DEL JUEGO:
      Estamos en un simulador matemático/financiero educativo. El estudiante se enfrenta al siguiente desafío de variación geométrica:
      "${currentProblemIntro}"
      Respuesta Correcta: ${currentProblemAnswer}%
      Explicación estándar: "${currentProblemExplanation}"
      
      PREGUNTA DEL ESTUDIANTE:
      "${promptText}"
      
      Instrucciones para la IA (Tutor):
      - Responde de forma muy amigable, pedagógica, clara y motivadora.
      - Utiliza analogías sencillas y explicaciones paso a paso ideales para secundaria o preparatoria.
      - Da pistas, no regales la respuesta final si te la piden directamente; ayúdales a razonar el por qué.
    `;

    const res = await callGemini(context);
    setAiText(res);
    setLoading(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    askTutor(customPrompt);
    setCustomPrompt("");
  };

  const content = (
    <div className={`w-full ${isInline ? 'h-full bg-white border-0 rounded-none overflow-hidden flex flex-col' : 'max-w-2xl bg-white border-[6px] border-amber-400 rounded-[2.5rem] md:rounded-[3rem] my-8 shadow-2xl animate-pop'} text-slate-800 relative`}>
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 border-b-2 border-slate-100 relative z-10 ${isInline ? 'p-8 pt-10 pb-6 shrink-0 mb-0' : 'p-6 md:p-10 pb-4 mb-6'}`}>
        <div className="flex items-center gap-3 text-left">
          <span className="text-4xl"><Icon name="user" size={18} className="inline-block" />‍🏫</span>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-amber-600">AI Tutor Ángeles de Jesús</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tu mentor de finanzas personales</p>
          </div>
        </div>
        {!isInline && onClose && (
          <Button onClick={onClose} color="slate" className="shrink-0 w-full sm:w-auto text-xs py-2">
            Volver al Reto
          </Button>
        )}
      </div>

      <div className={`space-y-4 relative z-10 ${isInline ? 'flex-1 overflow-y-auto px-8 pb-8 flex flex-col' : 'px-6 md:px-10 pb-10'}`}>
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left shrink-0">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Reto Actual en Pizarra</span>
          <p className="text-xs text-slate-600 font-bold line-clamp-3">{currentProblemIntro || "No hay un reto activo."}</p>
        </div>

        <div className={`p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl text-left overflow-y-auto no-scrollbar flex items-start gap-3 ${isInline ? 'flex-1' : 'min-h-36 max-h-56'}`}>
          <span className="text-3xl shrink-0"><Icon name="owl" size={18} className="inline-block" /></span>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">Consejo del Tutor</span>
            <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">{aiText}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
          <button 
            disabled={loading}
            onClick={() => askTutor("¿Me puedes dar una pista o analogía sencilla para resolver esto?")}
            className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-55 active:scale-95 indestructible-btn"
          >
            <Icon name="zap" size={18} className="inline-block text-yellow-500" /> Pedir pista
          </button>
          <button 
            disabled={loading}
            onClick={() => askTutor("¿Por qué el área varía elevando el factor al cuadrado en figuras circulares?")}
            className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-55 active:scale-95 indestructible-btn"
          >
            <Icon name="x" size={18} className="inline-block text-red-500" /> Explicar Círculos
          </button>
          <button 
            disabled={loading}
            onClick={() => askTutor("¿Cómo se calcula el cambio combinado cuando los factores horizontal y vertical son distintos?")}
            className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-xl col-span-2 sm:col-span-1 transition-all disabled:opacity-55 active:scale-95 indestructible-btn"
          >
            <Icon name="target" size={18} className="inline-block" /> Rectángulos 2D
          </button>
        </div>

          <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-4 shrink-0">
            <input 
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Pregúntale algo personalizado al tutor..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-xs md:text-sm bg-slate-50 text-slate-800"
            />
            <Button type="submit" disabled={loading || !customPrompt.trim()} color="yellow" className="px-5 py-3 text-xs uppercase tracking-widest shrink-0">
              {loading ? "..." : "Preguntar"}
            </Button>
          </form>
        </div>
      </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto no-scrollbar">
      {content}
    </div>
  );
};
