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

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-colors border-2 ${
        enabled ? 'bg-blue-500 border-blue-400 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'
      }`}
      title={enabled ? "Silenciar música" : "Activar música"}
    >
      <Icon name={"headphones"} size={24} />
      {!enabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-slate-500 rotate-45"></div>
        </div>
      )}
    </button>
  );
};
