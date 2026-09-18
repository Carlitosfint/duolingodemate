import React, { useState } from 'react';
import { isMusicEnabled, setMusicEnabled, playClickSound } from '../utils/audio';
import { Icon } from './CustomIcons';

export const AudioToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(isMusicEnabled);

  const toggle = () => {
    playClickSound();
    const newState = !enabled;
    setEnabled(newState);
    setMusicEnabled(newState);
  };

  // On mobile the bottom-right corner belongs to the nav bar and, on the
  // exercise screen, to the answer field — so this sits above the nav,
  // tucked against the edge and dimmed until touched. On lg+ the nav is a
  // left sidebar and the corner is free.
  return (
    <button
      onClick={toggle}
      className={`fixed bottom-24 right-1.5 lg:bottom-4 lg:right-4 z-50 p-2.5 lg:p-3 rounded-full shadow-lg transition-all border-2 opacity-70 hover:opacity-100 focus-visible:opacity-100 lg:opacity-100 ${
        enabled ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'
      }`}
      title={enabled ? "Silenciar música" : "Activar música"}
      aria-label={enabled ? "Silenciar música" : "Activar música"}
    >
      <Icon name={"headphones"} size={20} />
      {!enabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-slate-500 rotate-45"></div>
        </div>
      )}
    </button>
  );
};
