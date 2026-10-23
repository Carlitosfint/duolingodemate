import React from 'react';
import { Icon } from './CustomIcons';
import { albumArt } from './puzzleArt';

interface PuzzleSliceProps {
  emoji: string | undefined;
  cols: number;
  totalPieces: number;
  index: number;
  status?: 'owned' | 'unplaced' | 'locked';
  className?: string;
}

// Renderiza la fracción exacta (fila, columna) de una sola figura total
// dividida en `totalPieces` partes. Incluso cuando la pieza aún no se tiene
// (`status === 'locked'`), se muestra la silueta atenuada de esa parte de la
// figura para que el alumno vea claramente la imagen completa por armar.
export const PuzzleSlice: React.FC<PuzzleSliceProps> = ({
  emoji,
  cols,
  totalPieces,
  index,
  status = 'owned',
  className = '',
}) => {
  if (!emoji) return null;

  const art = albumArt[emoji];
  const rows = Math.max(1, Math.round(totalPieces / cols));
  const col = index % cols;
  const row = Math.floor(index / cols);

  const filterClass =
    status === 'owned'
      ? 'opacity-100 saturate-110'
      : status === 'unplaced'
      ? 'opacity-80 saturate-125 brightness-110'
      : 'grayscale opacity-35 brightness-90 contrast-125';

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {art ? (
        <div
          className={`absolute pointer-events-none transition-all duration-300 ${filterClass}`}
          style={{
            width: `${cols * 100}%`,
            height: `${rows * 100}%`,
            left: `-${col * 100}%`,
            top: `-${row * 100}%`,
          }}
        >
          <img
            src={art}
            alt=""
            draggable={false}
            className="w-full h-full object-fill block"
          />
        </div>
      ) : (
        <div className={`w-full h-full flex items-center justify-center bg-slate-800 ${filterClass}`}>
          <Icon name={emoji} size={40} className="text-white" />
        </div>
      )}

      {/* Superposición según el estado de la pieza */}
      {status === 'owned' && (
        <>
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/45 backdrop-blur-[2px] text-[9px] font-black text-emerald-300 leading-none">
            #{index + 1}
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-emerald-400/50 pointer-events-none" />
        </>
      )}

      {status === 'unplaced' && (
        <div className="absolute inset-0 bg-amber-500/25 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
            <Icon name="plus" size={18} />
          </div>
          <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/85 text-amber-300 text-[9px] font-black uppercase tracking-wider">
            Colocar #{index + 1}
          </span>
        </div>
      )}

      {status === 'locked' && (
        <div className="absolute inset-0 bg-slate-950/35 flex items-center justify-center pointer-events-none">
          <span className="w-6 h-6 rounded-full bg-slate-950/75 border border-white/20 text-white/85 text-[11px] font-black flex items-center justify-center shadow">
            {index + 1}
          </span>
        </div>
      )}
    </div>
  );
};
