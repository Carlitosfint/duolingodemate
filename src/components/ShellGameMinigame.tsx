import { Icon } from './CustomIcons';
import React, { useState, useEffect } from 'react';

interface ShellGameMinigameProps {
  onFinish: (piecesWon: number) => void;
  playClick: () => void;
  playCatch: () => void;
  playTick: () => void;
  playRainbow: () => void;
  playError: () => void;
}

export const ShellGameMinigame: React.FC<ShellGameMinigameProps> = ({
  onFinish,
  playClick,
  playCatch,
  playTick,
  playRainbow,
  playError
}) => {
  const [phase, setPhase] = useState<'intro' | 'shuffle' | 'guess' | 'result'>('intro');
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (phase === 'intro') {
      playCatch();
      const t = setTimeout(() => setPhase('shuffle'), 2500);
      return () => clearTimeout(t);
    } else if (phase === 'shuffle') {
      let count = 0;
      const max = 10 + Math.floor(Math.random() * 4);
      const interval = setInterval(() => {
        playTick();
        setOrder(prev => {
          const next = [...prev];
          const idx1 = Math.floor(Math.random() * 3);
          let idx2 = Math.floor(Math.random() * 3);
          while (idx1 === idx2) idx2 = Math.floor(Math.random() * 3);
          [next[idx1], next[idx2]] = [next[idx2], next[idx1]];
          return next;
        });
        count++;
        if (count >= max) {
          clearInterval(interval);
          setPhase('guess');
        }
      }, 350);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const pick = (id: number) => {
    if (phase !== 'guess') return;
    playClick();
    setSelected(id);
    setPhase('result');
    if (id === 1) playRainbow();
    else playError();
  };

  const getReward = () => selected === 1 ? 2 : 0;

  return (
    <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
      <div className="w-full max-w-2xl rounded-[2.5rem] md:rounded-[3rem] border-[6px] border-cyan-500 bg-gradient-to-b from-slate-900 to-indigo-950 overflow-hidden p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        
        <h2 className="text-3xl md:text-4xl font-black text-cyan-400 mb-2 drop-shadow-sm flex items-center justify-center gap-2 text-center leading-tight relative z-10">
          <span className="text-4xl animate-bounce"><Icon name="ufo" size={18} className="inline-block" /></span> ¿Dónde está el botín?
        </h2>
        <p className="text-slate-300 font-bold mb-8 text-center text-sm md:text-base relative z-10">
          {phase === 'intro' ? '¡Atento a la nave que tiene el diamante!' : phase === 'shuffle' ? '¡Sigue la nave con la mirada!' : phase === 'guess' ? '¡Haz clic en la nave ganadora!' : 'Resultado de tu expedición'}
        </p>

        <div className="relative w-full h-48 md:h-64 mt-4 mb-8 z-10">
          {[0, 1, 2].map(id => {
            const positionIndex = order.indexOf(id);
            const leftPos = `${16.66 + (positionIndex * 33.33)}%`;
            return (
              <div key={id} 
                onClick={() => pick(id)}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out flex flex-col items-center ${phase === 'guess' ? 'cursor-pointer hover:-translate-y-[60%] hover:scale-110' : ''}`}
                style={{ left: leftPos }}
              >
                <div className={`relative z-20 transition-transform duration-500 ${phase === 'intro' || (phase === 'result' && (id === selected || id === 1)) ? '-translate-y-14' : 'translate-y-0'}`}>
                  <span className="text-6xl md:text-[6rem] drop-shadow-[0_10px_15px_rgba(6,182,212,0.6)]"><Icon name="ufo" size={18} className="inline-block" /></span>
                </div>
                
                {id === 1 && (
                  <div className={`absolute bottom-0 z-10 transition-opacity duration-300 ${phase === 'intro' || phase === 'result' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="text-5xl md:text-6xl animate-pulse filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"><Icon name="diamond" className="inline-block" size={18} /></div>
                  </div>
                )}
                
                {phase === 'result' && id === selected && (
                  <div className="absolute -bottom-8 font-black text-3xl animate-pop z-30">
                    {id === 1 ? '✅' : '❌'}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {phase === 'result' && (
          <div className="mt-4 animate-slide-up flex flex-col items-center relative z-10">
            <div className={`border-4 p-4 rounded-2xl w-full text-center shadow-lg mb-4 backdrop-blur-sm ${selected === 1 ? 'bg-emerald-900/80 border-emerald-400 text-emerald-400' : 'bg-rose-900/80 border-rose-400 text-rose-400'}`}>
              <h3 className="text-lg md:text-xl font-black mb-1">
                {selected === 1 ? '¡Correcto! Tienes ojo de halcón.' : '¡Oh no! Te han engañado con un holograma.'}
              </h3>
              <div className="font-black text-xl md:text-2xl flex items-center justify-center gap-2 text-white mt-2">
                {getReward() > 0 ? `Ganaste ${getReward()} Piezas <Icon name="box" size={18} className="inline-block" />` : 'No ganaste piezas <Icon name="x" size={18} className="inline-block text-red-500" />'}
              </div>
            </div>
            <button onClick={() => onFinish(getReward())} className="w-full text-lg md:text-xl py-3 md:py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-[1.5rem] font-black border-cyan-600 border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer indestructible-btn">
              {getReward() > 0 ? 'Reclamar Botín' : 'Continuar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
};
