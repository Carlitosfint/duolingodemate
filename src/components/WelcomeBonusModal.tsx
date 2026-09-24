import { Icon } from './CustomIcons';
import React, { useState } from 'react';
import { Card, Button } from './UI';

interface WelcomeBonusModalProps {
  schoolName?: string | null;
  welcomePrize: { icon: string; name: string } | null;
  handleWelcomePick: (index: number) => void;
  playClickSound: () => void;
  onClose: () => void;
}

export const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({
  schoolName,
  welcomePrize,
  handleWelcomePick,
  playClickSound,
  onClose
}) => {
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [chestOpened, setChestOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handlePickClick = (idx: number) => {
    playClickSound();
    if (idx === 2) {
      // Option 3 is the manual chest opening
      setChosenIdx(2);
    } else {
      setChosenIdx(idx);
      handleWelcomePick(idx);
    }
  };

  const handleOpenChest = () => {
    if (chestOpened || isShaking) return;
    setIsShaking(true);
    playClickSound();
    
    setTimeout(() => {
      setIsShaking(false);
      setChestOpened(true);
      handleWelcomePick(2); // Triggers reward & reveal sound in App.tsx
    }, 850);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-pop">
      <Card className="w-full max-w-md border-4 border-emerald-500 bg-gradient-to-b from-white to-emerald-50 p-6 md:p-8 text-center relative overflow-hidden">
        
        {/* Header Title */}
        {chosenIdx === null ? (
          <>
            <div className="text-5xl mb-4 animate-bounce"><Icon name="gift" className="inline-block" size={18} /></div>
            <h3 className="text-2xl font-black text-emerald-600 mb-2">¡Bono de Bienvenida!</h3>
            <p className="text-slate-600 font-semibold text-sm mb-6 leading-relaxed">
              {schoolName ? <><span className="font-black text-slate-800">{schoolName}</span> te da la bienvenida. </> : '¡Te damos la bienvenida! '}
              Elige uno de los regalos para iniciar tu portafolio financiero:
            </p>
            
            <div className="grid grid-cols-3 gap-3 w-full">
              {[0, 1, 2].map(i => (
                <button 
                  key={i} 
                  onClick={() => handlePickClick(i)} 
                  className="p-5 bg-white hover:bg-emerald-50 border-slate-200 hover:border-emerald-300 border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] hover:scale-105 rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-200 shadow-md group indestructible-btn cursor-pointer"
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform"><Icon name="gift" className="inline-block text-emerald-600" size={36} /></span>
                  <span className="text-[10px] font-black text-emerald-800 mt-2 uppercase tracking-wider">Regalo {i+1}</span>
                </button>
              ))}
            </div>
          </>
        ) : chosenIdx === 0 ? (
          // Regalo 1 Result
          <div className="animate-pop flex flex-col items-center">
            <div className="mb-4 animate-bounce"><Icon name="coins" size={56} className="text-amber-500 inline-block" /></div>
            <h3 className="text-2xl font-black text-emerald-600 mb-1">Bono de Bienvenida</h3>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-6">Regalo Seleccionado</p>
            
            <div className="p-6 bg-white w-full rounded-2xl border-2 border-emerald-100 shadow-inner flex flex-col items-center mb-6">
              <div className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-amber-500"><Icon name="coins" size={26} className="inline-block" /> +150</span>
                <span className="flex items-center gap-1.5 text-blue-500"><Icon name="ticket" size={26} className="inline-block" /> +15</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Agregado a tu cuenta</p>
            </div>

            <Button onClick={onClose} color="green" className="w-full py-3 font-black uppercase tracking-wider shadow-md">
              ¡Comenzar Aventura!
            </Button>
          </div>
        ) : chosenIdx === 1 ? (
          // Regalo 2 Result (Always 0 coins & 0 tickets)
          <div className="animate-pop flex flex-col items-center">
            <div className="mb-4 animate-pulse"><Icon name="trending_down" className="inline-block text-slate-400" size={56} /></div>
            <h3 className="text-2xl font-black text-slate-700 mb-1">Suscripción Inversor</h3>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-4">Regalo Seleccionado</p>
            
            <p className="text-xs text-slate-600 font-bold leading-relaxed mb-6 px-4">
              ¡Has elegido la ruta del verdadero reto financiero! Empiezas desde cero absoluto para poner a prueba tus habilidades de ahorro.
            </p>

            <div className="p-5 bg-slate-100 w-full rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center mb-6">
              <div className="text-2xl font-black text-slate-500 flex items-center gap-3">
                <span className="flex items-center gap-1"><Icon name="coins" size={22} className="inline-block" /> +0 Monedas</span>
                <span className="flex items-center gap-1"><Icon name="ticket" size={22} className="inline-block" /> +0 Tickets</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Modo Supervivencia Activado</p>
            </div>

            <Button onClick={onClose} color="slate" className="w-full py-3 font-black uppercase tracking-wider shadow-md">
              ¡Aceptar Desafío!
            </Button>
          </div>
        ) : (
          // Regalo 3 Result - Chest Manual opening
          <div className="animate-pop flex flex-col items-center">
            {!chestOpened ? (
              <>
                <div 
                  onClick={handleOpenChest}
                  className={`mb-4 cursor-pointer select-none filter drop-shadow-md hover:scale-110 active:scale-95 transition-all duration-200 ${isShaking ? 'animate-bounce' : 'animate-pulse'}`}
                >
                  <Icon name="box" className="inline-block text-amber-500" size={64} />
                </div>
                <h3 className="text-2xl font-black text-amber-600 mb-1">Cofre de Bienvenida</h3>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-6">Toca el cofre para abrirlo manualmente</p>
                
                <button 
                  onClick={handleOpenChest}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-black uppercase tracking-wider shadow-md rounded-[1.5rem] transition-all border-amber-600 border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] flex items-center justify-center gap-2"
                >
                  <Icon name="box" className="inline-block" size={20} /> Abrir Cofre
                </button>
              </>
            ) : (
              <div className="animate-pop flex flex-col items-center w-full">
                <div className="mb-4 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.4)] animate-bounce">
                  <Icon name="unlock" className="inline-block text-amber-500" size={64} />
                </div>
                <h3 className="text-2xl font-black text-amber-600 mb-1">¡Cofre Abierto!</h3>
                <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-6">Contenido del cofre</p>
                
                <div className="p-5 bg-white w-full rounded-2xl border-2 border-amber-100 shadow-inner flex flex-col items-center mb-6">
                  <div className="text-3xl font-black text-slate-800 flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-amber-500"><Icon name="coins" size={26} className="inline-block" /> +250</span>
                    <span className="flex items-center gap-1.5 text-blue-500"><Icon name="ticket" size={26} className="inline-block" /> +10</span>
                  </div>
                  <p className="text-[10px] text-amber-500 mt-2 font-black uppercase tracking-widest">¡Excelente recompensa de inicio!</p>
                </div>

                <Button onClick={onClose} color="yellow" className="w-full py-3 font-black uppercase tracking-wider shadow-md">
                  Reclamar Todo
                </Button>
              </div>
            )}
          </div>
        )}
        
      </Card>
    </div>
  );
};
