import { Icon } from './CustomIcons';
import React, { useState } from 'react';
import { Button } from './UI';

// The AI tutor for the exercise on screen. The prompt itself is built on the
// server (POST /api/tutor), so the only things sent from here are the
// problem and the student's question — not free text that could turn the
// school's API key into a general-purpose chatbot.

export interface TutorProblem {
  intro: string;
  topic: string;
  answer: string;
  explanation: string;
}

interface TeacherModeModalProps {
  onClose?: () => void;
  askTutor: (problem: TutorProblem, question: string) => Promise<string>;
  problem: TutorProblem | null;
  isInline?: boolean;
}

const MAX_QUESTION = 300;

export const TeacherModeModal: React.FC<TeacherModeModalProps> = ({ onClose, askTutor, problem, isInline }) => {
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState<React.ReactNode>(
    '¡Hola! Soy tu tutor. Pregúntame lo que quieras sobre el reto que tienes en pantalla: te doy pistas para que llegues tú a la respuesta.',
  );
  const [question, setQuestion] = useState('');

  const ask = async (text: string) => {
    if (!problem) {
      setAiText('Abre un reto primero y luego pregúntame sobre él.');
      return;
    }
    setLoading(true);
    setAiText(<span className="flex items-center gap-2">Pensando en tu pregunta… <Icon name="book" size={16} /></span>);
    setAiText(await askTutor(problem, text));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = question.trim();
    if (!text) return;
    ask(text);
    setQuestion('');
  };

  const quick = [
    { icon: 'zap', label: 'Dame una pista', question: 'Dame una pista para empezar, sin decirme la respuesta.' },
    { icon: 'target', label: '¿Por dónde empiezo?', question: '¿Cuál es el primer paso para resolver este reto?' },
    {
      icon: 'book',
      label: 'Explícame el tema',
      question: `Explícame con un ejemplo sencillo la idea principal de ${problem?.topic || 'este tema'}.`,
    },
  ];

  const content = (
    <div className={`w-full ${isInline ? 'h-full bg-white border-0 rounded-none overflow-hidden flex flex-col' : 'max-w-2xl bg-white border-[6px] border-amber-400 rounded-[2.5rem] md:rounded-[3rem] my-8 shadow-2xl animate-pop'} text-slate-800 relative`}>
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 border-b-2 border-slate-100 relative z-10 ${isInline ? 'p-8 pt-10 pb-6 shrink-0 mb-0' : 'p-6 md:p-10 pb-4 mb-6'}`}>
        <div className="flex items-center gap-3 text-left">
          <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Icon name="owl" size={26} />
          </span>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-amber-600">Tutor IA</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Te da pistas, no la respuesta</p>
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
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
            Reto actual{problem?.topic ? ` · ${problem.topic}` : ''}
          </span>
          <p className="text-xs text-slate-600 font-bold line-clamp-3">{problem?.intro || 'No hay un reto activo.'}</p>
        </div>

        <div className={`p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl text-left overflow-y-auto no-scrollbar ${isInline ? 'flex-1' : 'min-h-36 max-h-56'}`}>
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block mb-1">Tutor</span>
          <div className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line" aria-live="polite">
            {aiText}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 shrink-0">
          {quick.map((q, i) => (
            <button
              key={q.label}
              disabled={loading}
              onClick={() => ask(q.question)}
              className={`p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-200 font-black text-[10px] md:text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-55 active:scale-95 indestructible-btn flex items-center justify-center gap-1.5 ${
                i === quick.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <Icon name={q.icon} size={14} /> {q.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mt-4 shrink-0">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, MAX_QUESTION))}
            placeholder="Escribe tu pregunta sobre este reto…"
            disabled={loading}
            maxLength={MAX_QUESTION}
            className="flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-xs md:text-sm bg-slate-50 text-slate-800"
          />
          <Button type="submit" disabled={loading || !question.trim()} color="yellow" className="px-5 py-3 text-xs uppercase tracking-widest shrink-0">
            {loading ? '…' : 'Preguntar'}
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
