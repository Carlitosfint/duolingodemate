import { Icon } from './CustomIcons';
import React, { useState, useEffect, useRef } from 'react';

interface PetRaceMinigameProps {
  onFinish: (piecesWon: number) => void;
  playClick: () => void;
  playCatch: () => void;
  playTick: () => void;
  playRainbow: () => void;
}

export const PetRaceMinigame: React.FC<PetRaceMinigameProps> = ({
  onFinish,
  playClick,
  playCatch,
  playTick,
  playRainbow
}) => {
  const [phase, setPhase] = useState<'pick' | 'countdown' | 'racing' | 'result'>('pick');
  const [countdownNum, setCountdownNum] = useState<number | string>(3);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [finishers, setFinishers] = useState<number[]>([]);
  const [positions, setPositions] = useState<number[]>([0, 0, 0, 0]);
  
  const petsData = [
    { id: 0, emoji: '🐂', name: 'Toro de Wall Street', bg: 'bg-emerald-500', border: 'border-emerald-700' },
    { id: 1, emoji: '🐱', name: 'Gato Asesor', bg: 'bg-purple-500', border: 'border-purple-700' },
    { id: 2, emoji: '🦉', name: 'Búho Auditor', bg: 'bg-amber-500', border: 'border-amber-700' },
    { id: 3, emoji: '🦊', name: 'Zorro Bancario', bg: 'bg-orange-500', border: 'border-orange-700' }
  ];
  
  const intervalRef = useRef<any>(null);
  // Closing the minigame mid-countdown used to leave this one running: it
  // would finish counting and start the race on an unmounted component,
  // ticking audibly with nothing left to clear it.
  const countdownRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const handlePick = (idx: number) => {
    if (phase !== 'pick') return;
    playClick();
    setSelectedPet(idx);
    setPhase('countdown');

    let count = 3;
    setCountdownNum(count);

    countdownRef.current = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdownNum(count);
        playClick();
      } else if (count === 0) {
        setCountdownNum('¡FUERA!');
        playCatch();
      } else {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        startRace();
      }
    }, 1000);
  };

  const startRace = () => {
    setPhase('racing');
    let currentPos = [0, 0, 0, 0];
    let currentFinishers: number[] = [];
    intervalRef.current = setInterval(() => {
      let newlyFinished: { id: number; over: number }[] = [];
      currentPos = currentPos.map((pos, i) => {
        if (pos >= 85) return pos;
        const speed = Math.random() * 4 + 1.5 + (Math.random() > 0.85 ? 3.5 : 0);
        const newPos = pos + speed;
        if (newPos >= 85) {
          newlyFinished.push({ id: i, over: newPos - 85 });
          return 85;
        }
        return newPos;
      });
      
      newlyFinished.sort((a, b) => b.over - a.over);
      newlyFinished.forEach(nf => {
        if (!currentFinishers.includes(nf.id)) currentFinishers.push(nf.id);
      });

      setPositions([...currentPos]);
      playTick();
      
      if (currentFinishers.length === 4) {
        clearInterval(intervalRef.current);
        setFinishers(currentFinishers);
        setPhase('result');
        if (currentFinishers[0] === selectedPet) playRainbow();
      }
    }, 100);
  };

  const getReward = () => {
    if (selectedPet === null) return 0;
    const rank = finishers.indexOf(selectedPet);
    if (rank === 0) return 3;
    if (rank === 1) return 2;
    if (rank === 2) return 1;
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[400] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
      <div className="w-full max-w-3xl rounded-[2.5rem] md:rounded-[3rem] border-[6px] border-orange-500 bg-gradient-to-b from-orange-950 to-red-950 overflow-hidden p-6 md:p-10 shadow-[0_0_60px_rgba(249,115,22,0.4)] relative text-white text-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>
        
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2 drop-shadow-lg flex items-center justify-center gap-3 text-center leading-tight relative z-10">
          <span className="text-4xl md:text-6xl animate-bounce filter drop-shadow-md"><Icon name="flag" className="inline-block" size={18} /></span> Copa Financiera
        </h2>
        
        <p className="text-orange-200 font-bold mb-4 text-center text-sm md:text-lg relative z-10 bg-black/30 px-6 py-2 rounded-full inline-block border border-orange-500/30">
          {phase === 'pick' ? '¡Selecciona a tu corredor!' : phase === 'countdown' ? '¡Prepárate para la carrera!' : phase === 'racing' ? '¡A toda velocidad!' : '¡Resultados Oficiales!'}
        </p>

        {phase === 'pick' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-6 w-full z-10">
            {petsData.map((p) => (
              <button 
                key={p.id} 
                onClick={() => handlePick(p.id)} 
                className={`relative flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl border-b-[6px] active:border-b-0 active:translate-y-1.5 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:brightness-110 group overflow-hidden ${p.bg} ${p.border} cursor-pointer indestructible-btn`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform drop-shadow-md">{p.emoji}</span>
                <span className="font-black text-white text-xs md:text-sm uppercase tracking-widest drop-shadow-sm">{p.name}</span>
              </button>
            ))}
          </div>
        )}

        {(phase === 'countdown' || phase === 'racing') && (
          <div className="relative w-full h-64 md:h-80 mt-4 mb-8 z-10 bg-amber-800 rounded-3xl border-8 border-slate-900 p-2 overflow-hidden flex flex-col justify-around shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)]">
            
            {phase === 'countdown' && (
              <div className="absolute inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-[2px]">
                <span className="text-8xl md:text-[10rem] font-black text-yellow-400 animate-pop drop-shadow-[0_0_30px_rgba(250,204,21,0.8)]" style={{WebkitTextStroke: '3px #b45309'}}>{countdownNum}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            <div className="absolute right-[6%] top-0 bottom-0 w-10 md:w-14 flex flex-col z-0 opacity-90 shadow-[-10px_0_20px_rgba(0,0,0,0.5)] border-l-4 border-white/50 bg-white">
              {Array.from({length: 14}).map((_, i) => (
                <div key={i} className="flex-1 w-full flex">
                  <div className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-900'}`}></div>
                  <div className={`flex-1 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-white'}`}></div>
                </div>
              ))}
            </div>
            
            {petsData.map((pet, idx) => (
              <div key={idx} className="relative w-full h-12 md:h-16 border-b-4 border-dashed border-white/20 last:border-0 flex items-center z-10">
                <div 
                  className="absolute text-4xl md:text-5xl transition-all duration-100 ease-linear z-20 flex items-center"
                  style={{ left: `${positions[idx]}%`, transform: phase === 'racing' ? 'rotate(-5deg) translateY(-2px)' : 'none' }}
                >
                  {phase === 'racing' && positions[idx] > 5 && positions[idx] < 85 && (
                    <div className="absolute -left-6 md:-left-8 text-xl md:text-2xl animate-pulse opacity-80 filter drop-shadow-md"><Icon name="zap" size={18} className="inline-block" /></div>
                  )}
                  <span className={`inline-block drop-shadow-[0_5px_5px_rgba(0,0,0,0.6)] ${phase === 'racing' ? 'animate-run' : ''}`}>{pet.emoji}</span>
                  
                  {selectedPet === idx && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] md:text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-black shadow-lg border border-blue-300 animate-pulse">TÚ</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {phase === 'result' && finishers.length > 0 && selectedPet !== null && (
          <div className="mt-4 animate-slide-up flex flex-col items-center relative z-10 w-full">
            <div className="bg-slate-900/80 backdrop-blur-md rounded-[2rem] p-6 w-full mb-6 shadow-2xl border-4 border-slate-700 relative overflow-hidden text-center flex flex-col items-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              
              <div className="flex justify-center items-end h-40 md:h-48 gap-3 md:gap-8 w-full relative z-10">
                <div className="flex flex-col items-center w-20 md:w-28 relative">
                  <div className="text-4xl md:text-5xl mb-2 drop-shadow-lg">{petsData[finishers[1]].emoji}</div>
                  <div className="bg-gradient-to-b from-slate-300 to-slate-500 w-full h-20 md:h-24 flex flex-col items-center justify-start pt-2 font-black text-slate-900 rounded-t-xl shadow-[0_0_20px_rgba(203,213,225,0.3)] border-2 border-slate-200 border-b-0">
                    <span className="text-2xl md:text-3xl leading-none opacity-80">2º</span>
                  </div>
                  {selectedPet === finishers[1] && <div className="absolute bottom-4 text-[10px] md:text-xs text-white font-black bg-blue-600 px-3 py-1 rounded-full shadow-lg border-2 border-blue-400 whitespace-nowrap">¡Tú! (2 Pz)</div>}
                </div>
                
                <div className="flex flex-col items-center w-24 md:w-32 relative z-20">
                  <div className="text-3xl md:text-4xl mb-[-10px] animate-bounce z-10"><Icon name="crown" className="inline-block" size={18} /></div>
                  <div className="text-5xl md:text-6xl mb-2 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] relative z-10">{petsData[finishers[0]].emoji}</div>
                  <div className="bg-gradient-to-b from-yellow-300 to-yellow-600 w-full h-28 md:h-32 flex flex-col items-center justify-start pt-3 font-black text-yellow-950 rounded-t-xl shadow-[0_0_30px_rgba(250,204,21,0.6)] border-2 border-yellow-200 border-b-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    <span className="text-3xl md:text-4xl leading-none relative z-10">1º</span>
                  </div>
                  {selectedPet === finishers[0] && <div className="absolute bottom-4 text-[11px] md:text-sm text-white font-black bg-blue-600 px-4 py-1 rounded-full shadow-lg border-2 border-blue-400 whitespace-nowrap z-30">¡Tú! (3 Pz)</div>}
                </div>
                
                <div className="flex flex-col items-center w-20 md:w-28 relative">
                  <div className="text-4xl md:text-5xl mb-2 opacity-90 drop-shadow-lg">{petsData[finishers[2]].emoji}</div>
                  <div className="bg-gradient-to-b from-orange-400 to-orange-700 w-full h-14 md:h-16 flex flex-col items-center justify-start pt-1 font-black text-orange-950 rounded-t-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] border-2 border-orange-300 border-b-0">
                    <span className="text-xl md:text-2xl leading-none opacity-80">3º</span>
                  </div>
                  {selectedPet === finishers[2] && <div className="absolute bottom-4 text-[10px] md:text-xs text-white font-black bg-blue-600 px-3 py-1 rounded-full shadow-lg border-2 border-blue-400 whitespace-nowrap">¡Tú! (1 Pz)</div>}
                </div>
              </div>
              
              {selectedPet === finishers[3] && (
                <div className="mt-6 text-center text-rose-300 font-black text-sm md:text-base bg-rose-950/60 py-3 rounded-xl border border-rose-800 shadow-inner w-full">
                  <Icon name="x" size={18} className="inline-block text-blue-500" /> Quedaste en 4º lugar. ¡Entrena más para la próxima!
                </div>
              )}
            </div>

            <button 
              onClick={() => onFinish(getReward())} 
              className={`w-full max-w-md text-lg md:text-xl py-4 rounded-[1.5rem] font-black border-b-[6px] active:border-b-0 active:translate-y-1.5 transition-all shadow-xl cursor-pointer indestructible-btn ${getReward() > 0 ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-slate-600 border-slate-800 text-slate-200 hover:bg-slate-500'}`}
            >
              <span className="flex items-center justify-center gap-2">
                {getReward() > 0 ? (
                  <>Reclamar {getReward()} Piezas <Icon name="box" size={22} className="inline-block" /></>
                ) : (
                  <>Continuar Aventura <Icon name="arrow_right" size={22} className="inline-block" /></>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
