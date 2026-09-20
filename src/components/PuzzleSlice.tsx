import React from 'react';
import { Icon } from './CustomIcons';
import { albumArt } from './puzzleArt';

interface PuzzleSliceProps {
  emoji: string | undefined;
  cols: number;
  totalPieces: number;
  index: number;
  className?: string;
}

// Each owned cell reveals its own fragment of ONE shared illustration per
// album (see puzzleArt.ts), sliced via the standard background-size/
// background-position sprite trick — not the same icon copy-pasted into
// every cell, so completing an album actually looks like assembling a picture.
export const PuzzleSlice: React.FC<PuzzleSliceProps> = ({ emoji, cols, totalPieces, index, className = "" }) => {
  if (!emoji) return null;

  const art = albumArt[emoji];
  const rows = Math.max(1, Math.round(totalPieces / cols));
  const col = index % cols;
  const row = Math.floor(index / cols);
  const posX = cols > 1 ? (col / (cols - 1)) * 100 : 50;
  const posY = rows > 1 ? (row / (rows - 1)) * 100 : 50;

  if (!art) {
    return (
      <div className={`relative w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-br from-slate-700/50 to-slate-800/80 rounded-lg shadow-inner border border-slate-600/50 ${className}`}>
        <div className="absolute top-0.5 right-1 text-[8px] font-black text-teal-300/80">#{index + 1}</div>
        <Icon name={emoji} size={48} className="text-white opacity-80 mix-blend-overlay" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full rounded-lg shadow-inner border border-slate-600/50 ${className}`}
      style={{
        backgroundImage: `url("${art}")`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${posX}% ${posY}%`,
      }}
    >
      <div className="absolute top-0.5 right-1 text-[8px] font-black text-white/70 drop-shadow">#{index + 1}</div>
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_10px_rgba(255,255,255,0.15)] pointer-events-none" />
    </div>
  );
};
