import React from 'react';
import { Icon } from './CustomIcons';

interface PuzzleSliceProps {
  emoji: string | undefined;
  cols: number;
  totalPieces: number;
  index: number;
  className?: string;
}

export const PuzzleSlice: React.FC<PuzzleSliceProps> = ({ emoji, index, className = "" }) => {
  if (!emoji) return null;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-br from-slate-700/50 to-slate-800/80 rounded-lg shadow-inner border border-slate-600/50 ${className}`}>
      <div className="absolute top-0.5 right-1 text-[8px] font-black text-teal-300/80">#{index + 1}</div>
      <div className="text-3xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform duration-200">
        <Icon name={emoji} size={48} className="text-white opacity-80 mix-blend-overlay" />
      </div>
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] pointer-events-none" />
    </div>
  );
};
