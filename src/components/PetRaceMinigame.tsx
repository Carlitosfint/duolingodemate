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
  const [boosting, setBoosting] = useState<boolean[]>([false, false, false, false]);

  const petsData = [
    {
      id: 0,
      emoji: '🐂',
      name: 'Toro de Wall Street',
      style: 'Potencia Final',
      speedStat: 88,
      burstStat: 92,
      bg: 'bg-emerald-500',
      border: 'border-emerald-700',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      trackFill: '#10B981'
    },
    {
      id: 1,
      emoji: '🐱',
      name: 'Gato Asesor',
      style: 'Agilidad Constante',
      speedStat: 94,
      burstStat: 85,
      bg: 'bg-purple-600',
      border: 'border-purple-800',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-700',
      trackFill: '#9333EA'
    },
    {
      id: 2,
      emoji: '🦉',
      name: 'Búho Auditor',
      style: 'Vuelo Táctico',
      speedStat: 86,
      burstStat: 95,
      bg: 'bg-amber-500',
      border: 'border-amber-700',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-700',
      trackFill: '#F59E0B'
    },
    {
      id: 3,
      emoji: '🦊',
      name: 'Zorro Bancario',
      style: 'Sprint Relámpago',
      speedStat: 91,
      burstStat: 89,
      bg: 'bg-orange-500',
      border: 'border-orange-700',
      lightBg: 'bg-orange-50',
      textColor: 'text-orange-700',
      trackFill: '#F97316'
    }
  ];

  const intervalRef = useRef<any>(null);
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
        setCountdownNum('¡YA!');
        playCatch();
      } else {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        startRace();
      }
    }, 850);
  };

  const startRace = () => {
    setPhase('racing');
    let currentPos = [0, 0, 0, 0];
    let currentFinishers: number[] = [];

    intervalRef.current = setInterval(() => {
      let newlyFinished: { id: number; over: number }[] = [];
      let nextBoosts = [false, false, false, false];

      currentPos = currentPos.map((pos, i) => {
        if (pos >= 86) return pos;
        const isBurst = Math.random() > 0.82;
        nextBoosts[i] = isBurst;
        const speed = Math.random() * 3.8 + 1.6 + (isBurst ? 3.4 : 0);
        const newPos = pos + speed;
        if (newPos >= 86) {
          newlyFinished.push({ id: i, over: newPos - 86 });
          return 86;
        }
        return newPos;
      });

      newlyFinished.sort((a, b) => b.over - a.over);
      newlyFinished.forEach((nf) => {
        if (!currentFinishers.includes(nf.id)) currentFinishers.push(nf.id);
      });

      setBoosting(nextBoosts);
      setPositions([...currentPos]);
      playTick();

      if (currentFinishers.length === 4) {
        clearInterval(intervalRef.current);
        setFinishers(currentFinishers);
        setPhase('result');
        if (currentFinishers[0] === selectedPet) playRainbow();
      }
    }, 95);
  };

  const getReward = () => {
    if (selectedPet === null) return 0;
    const rank = finishers.indexOf(selectedPet);
    if (rank === 0) return 3;
    if (rank === 1) return 2;
    if (rank === 2) return 1;
    return 0;
  };

  // Compute live rank for each lane (1..4)
  const getLiveRanks = () => {
    const indices = [0, 1, 2, 3];
    indices.sort((a, b) => {
      const finA = finishers.indexOf(a);
      const finB = finishers.indexOf(b);
      if (finA !== -1 && finB !== -1) return finA - finB;
      if (finA !== -1) return -1;
      if (finB !== -1) return 1;
      return positions[b] - positions[a];
    });
    const rankByLane = [1, 1, 1, 1];
    indices.forEach((laneIdx, rankPos) => {
      rankByLane[laneIdx] = rankPos + 1;
    });
    return { orderedLanes: indices, rankByLane };
  };

  const { orderedLanes, rankByLane } = getLiveRanks();

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[400] flex items-center justify-center p-3 md:p-5 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-3xl rounded-[2rem] border-4 border-b-[10px] border-slate-800 bg-white overflow-hidden p-5 md:p-7 relative text-slate-900">
        {/* Top Stadium Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 border-2 border-b-4 border-emerald-700 flex items-center justify-center text-white shrink-0">
              <Icon name="flag" size={24} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-md">
                  Estadio Olímpico • 100m
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  Premio: Hasta 3 Piezas
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                Gran Premio de Mascotas
              </h2>
            </div>
          </div>

          <div className="bg-slate-100 border-2 border-slate-200 rounded-xl px-3.5 py-2 text-xs font-black text-slate-600 uppercase tracking-wider shrink-0">
            {phase === 'pick'
              ? '1. Elige tu corredor'
              : phase === 'countdown'
              ? '2. En sus marcas...'
              : phase === 'racing'
              ? '3. ¡Carrera en curso!'
              : '4. Clasificación Final'}
          </div>
        </div>

        {/* PHASE 1: PICK A RACER */}
        {phase === 'pick' && (
          <div>
            <p className="text-slate-600 font-bold text-xs md:text-sm text-left mb-4">
              Selecciona un corredor para patrocinar en la pista. Si llega en el podio (1°, 2° o 3°), ganarás piezas de rompecabezas para tus álbumes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {petsData.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handlePick(p.id)}
                  className="group text-left bg-white hover:bg-slate-50 rounded-2xl p-4 border-2 border-b-[6px] border-slate-300 hover:border-slate-800 active:translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-white ${p.bg}`}>
                        Carril {idx + 1}
                      </span>
                      <span className="text-[11px] font-black text-slate-400 group-hover:text-slate-800">
                        Elegir →
                      </span>
                    </div>
                    <div className={`w-full h-20 rounded-xl ${p.lightBg} border-2 border-slate-200 flex items-center justify-center mb-3`}>
                      <span className="text-5xl group-hover:scale-110 transition-transform select-none">
                        {p.emoji}
                      </span>
                    </div>
                    <div className="font-black text-slate-900 text-sm leading-tight">{p.name}</div>
                    <div className={`text-[11px] font-bold ${p.textColor} mt-0.5`}>{p.style}</div>
                  </div>

                  {/* Minimalist Flat Stat Bars */}
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5 w-full">
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                        <span>Velocidad</span>
                        <span>{p.speedStat}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                        <div className={`h-full ${p.bg}`} style={{ width: `${p.speedStat}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                        <span>Sprint</span>
                        <span>{p.burstStat}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-0.5">
                        <div className={`h-full ${p.bg}`} style={{ width: `${p.burstStat}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PHASE 2 & 3: STADIUM TRACK */}
        {(phase === 'countdown' || phase === 'racing') && (
          <div className="flex flex-col gap-3">
            {/* Live Leaderboard Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl border-2 border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                Posiciones en Vivo
              </span>
              <div className="flex items-center gap-2 md:gap-3">
                {orderedLanes.map((laneId, posIdx) => {
                  const pet = petsData[laneId];
                  const isUser = selectedPet === laneId;
                  return (
                    <div
                      key={laneId}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black ${
                        isUser ? 'bg-blue-600 text-white border border-blue-400' : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="text-amber-400">{posIdx + 1}°</span>
                      <span>{pet.emoji}</span>
                      {isUser && <span className="text-[9px] uppercase bg-white text-blue-700 px-1.5 rounded">Tú</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Track Arena */}
            <div className="relative w-full rounded-2xl border-4 border-slate-900 bg-slate-800 overflow-hidden">
              {/* Countdown Overlay */}
              {phase === 'countdown' && (
                <div className="absolute inset-0 bg-slate-900/75 z-[100] flex flex-col items-center justify-center">
                  <div className="w-28 h-28 rounded-3xl bg-amber-400 border-4 border-b-8 border-amber-700 flex items-center justify-center">
                    <span className="text-5xl md:text-6xl font-black text-slate-900">{countdownNum}</span>
                  </div>
                  <span className="mt-3 text-xs font-black uppercase tracking-widest text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    Preparando salida
                  </span>
                </div>
              )}

              {/* Distance Ruler Header */}
              <div className="w-full h-7 bg-slate-900 border-b-2 border-slate-700 flex items-center relative text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="pl-3">Salida</span>
                <span className="absolute left-[26%]">25m</span>
                <span className="absolute left-[48%]">50m</span>
                <span className="absolute left-[70%]">75m</span>
                <span className="absolute right-[7%] text-amber-400">Meta</span>
              </div>

              {/* Vertical Checkpoint Lines */}
              <div className="relative w-full">
                <div className="absolute left-[26%] top-0 bottom-0 w-0.5 bg-slate-600/50 pointer-events-none z-0" />
                <div className="absolute left-[48%] top-0 bottom-0 w-0.5 bg-slate-600/50 pointer-events-none z-0" />
                <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-slate-600/50 pointer-events-none z-0" />

                {/* Checkered Finish Line */}
                <div className="absolute right-[6%] top-0 bottom-0 w-7 md:w-9 flex flex-col z-0 border-x-2 border-slate-900">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="flex-1 w-full flex">
                      <div className={`flex-1 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-900'}`} />
                      <div className={`flex-1 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-white'}`} />
                    </div>
                  ))}
                </div>

                {/* 4 Lanes */}
                {petsData.map((pet, idx) => {
                  const isSelected = selectedPet === idx;
                  const rank = rankByLane[idx];
                  return (
                    <div
                      key={idx}
                      className={`relative w-full h-16 md:h-18 border-b-2 border-slate-700 last:border-b-0 flex items-center ${
                        idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/70'
                      }`}
                    >
                      {/* Starting Gate Number Box */}
                      <div
                        className={`w-9 h-full ${pet.bg} border-r-2 border-slate-900 flex flex-col items-center justify-center text-white font-black text-xs shrink-0 z-10`}
                      >
                        <span>{idx + 1}</span>
                      </div>

                      {/* Solid Flat Progress Trail */}
                      <div
                        className="h-3 rounded-r-full transition-all duration-100 ease-linear opacity-85"
                        style={{
                          width: `${Math.max(2, positions[idx])}%`,
                          backgroundColor: pet.trackFill
                        }}
                      />

                      {/* Runner Avatar Token */}
                      <div
                        className="absolute transition-all duration-100 ease-linear z-20 flex items-center"
                        style={{ left: `calc(36px + ${positions[idx] * 0.82}%)` }}
                      >
                        <div
                          className={`relative w-12 h-12 md:w-13 md:h-13 rounded-2xl bg-white border-2 border-b-4 ${
                            isSelected ? 'border-blue-600 ring-2 ring-blue-400' : 'border-slate-900'
                          } flex items-center justify-center`}
                        >
                          <span className="text-2xl md:text-3xl select-none">{pet.emoji}</span>

                          {isSelected && (
                            <span className="absolute -top-2.5 -right-2 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md border border-white uppercase">
                              Tú
                            </span>
                          )}

                          {phase === 'racing' && boosting[idx] && positions[idx] < 85 && (
                            <span className="absolute -left-7 bg-amber-400 text-slate-900 text-[9px] font-black px-1.5 py-0.5 rounded-md border border-slate-900 uppercase">
                              ⚡
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Live Rank Badge on Far Right */}
                      <div className="ml-auto mr-2 z-20">
                        <span
                          className={`inline-block w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center border-2 ${
                            rank === 1
                              ? 'bg-amber-400 text-slate-900 border-amber-600'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          {rank}°
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PHASE 4: RESULTS & FLAT PODIUM */}
        {phase === 'result' && finishers.length > 0 && selectedPet !== null && (
          <div className="mt-2 animate-slide-up flex flex-col items-center w-full">
            <div className="bg-slate-50 rounded-3xl p-5 md:p-6 w-full mb-5 border-2 border-slate-200 flex flex-col items-center">
              {/* Flat 3-Step Podium */}
              <div className="flex justify-center items-end h-44 md:h-48 gap-3 md:gap-6 w-full max-w-lg">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-b-4 border-slate-300 flex items-center justify-center text-3xl mb-2">
                    {petsData[finishers[1]].emoji}
                  </div>
                  <div className="bg-slate-300 border-2 border-b-0 border-slate-400 w-full h-20 md:h-24 rounded-t-2xl flex flex-col items-center justify-between p-2 text-slate-800">
                    <span className="text-xl md:text-2xl font-black">2°</span>
                    <span className="text-[10px] font-black uppercase bg-white px-2 py-0.5 rounded-md">
                      +2 Piezas
                    </span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="mb-1">
                    <Icon name="mastery_trophy" size={28} />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-b-4 border-amber-500 flex items-center justify-center text-4xl mb-2">
                    {petsData[finishers[0]].emoji}
                  </div>
                  <div className="bg-amber-400 border-2 border-b-0 border-amber-600 w-full h-28 md:h-32 rounded-t-2xl flex flex-col items-center justify-between p-2.5 text-slate-900">
                    <span className="text-2xl md:text-3xl font-black">1°</span>
                    <span className="text-[10px] font-black uppercase bg-slate-900 text-amber-300 px-2.5 py-0.5 rounded-md">
                      +3 Piezas
                    </span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-white border-2 border-b-4 border-slate-300 flex items-center justify-center text-3xl mb-2">
                    {petsData[finishers[2]].emoji}
                  </div>
                  <div className="bg-orange-300 border-2 border-b-0 border-orange-500 w-full h-16 md:h-20 rounded-t-2xl flex flex-col items-center justify-between p-2 text-orange-950">
                    <span className="text-lg md:text-xl font-black">3°</span>
                    <span className="text-[10px] font-black uppercase bg-white px-2 py-0.5 rounded-md">
                      +1 Pieza
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Banner for the Player */}
              <div className="w-full mt-4 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{petsData[selectedPet].emoji}</span>
                  <div className="text-left">
                    <div className="text-xs font-black text-slate-500 uppercase">Tu Corredor</div>
                    <div className="text-sm font-black text-slate-900">
                      {petsData[selectedPet].name} terminó en {finishers.indexOf(selectedPet) + 1}° lugar
                    </div>
                  </div>
                </div>
                <div
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase border-2 ${
                    getReward() > 0
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  {getReward() > 0 ? `Ganaste +${getReward()} Piezas` : 'Sin piezas esta vez'}
                </div>
              </div>
            </div>

            <button
              onClick={() => onFinish(getReward())}
              className={`w-full max-w-md text-base md:text-lg py-3.5 rounded-2xl font-black border-2 border-b-[6px] active:translate-y-1 transition-all cursor-pointer ${
                getReward() > 0
                  ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-600'
                  : 'bg-slate-800 border-slate-950 text-white hover:bg-slate-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {getReward() > 0 ? (
                  <>
                    Reclamar {getReward()} Piezas <Icon name="box" size={22} className="inline-block" />
                  </>
                ) : (
                  <>
                    Continuar en el Mapa <Icon name="arrow_right" size={22} className="inline-block" />
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
