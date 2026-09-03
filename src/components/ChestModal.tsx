import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';
import { PuzzleSlice } from './PuzzleSlice';

interface ChestModalProps {
  onClose: () => void;
  openChestAnimation: {
    isOpen: boolean;
    rewardType: string;
    piecesWon: any[];
    coinsWon: number;
    ticketsWon: number;
    rarity: string;
  };
}

export const ChestModal: React.FC<ChestModalProps> = ({ onClose, openChestAnimation }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-[350] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
      <Card className="w-full max-w-md border-4 border-yellow-400 bg-gradient-to-b from-slate-900 to-amber-950 p-6 md:p-8 text-center text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-25 pointer-events-none"></div>

        <div className="text-7xl mb-4 animate-bounce filter drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
          {openChestAnimation.isOpen ? "🔓" : "📦"}
        </div>
        
        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-2 drop-shadow-md">
          {openChestAnimation.rarity === 'legendary' ? '¡COFRE TITÁN!' : openChestAnimation.rarity === 'rare' ? '¡COFRE SUPREMO!' : '¡COFRE FINANCIERO!'}
        </h3>
        <p className="text-amber-200 font-bold mb-6 text-sm uppercase tracking-widest">
          {openChestAnimation.isOpen ? '¡Contenido Revelado!' : 'Abriendo caja de ahorros...'}
        </p>

        {openChestAnimation.isOpen && (
          <div className="space-y-4 w-full animate-slide-up relative z-10">
            {openChestAnimation.piecesWon.length > 0 && (
              <div className="p-4 bg-slate-950/80 rounded-2xl border-2 border-amber-500/50 flex flex-col items-center">
                <div className="text-sm font-black text-amber-400 mb-3 uppercase tracking-wider">Piezas Coleccionables</div>
                <div className="flex flex-wrap justify-center gap-3">
                  {openChestAnimation.piecesWon.map((p, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-16 h-16 mb-1">
                        <PuzzleSlice emoji={p.emoji} cols={p.cols} totalPieces={p.pieces} index={p.pieceIndex} className="w-full h-full shadow-lg" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{p.albumName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(openChestAnimation.coinsWon > 0 || openChestAnimation.ticketsWon > 0) && (
              <div className="grid grid-cols-2 gap-3 w-full">
                {openChestAnimation.coinsWon > 0 && (
                  <div className="p-4 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-center">
                    <span className="text-3xl"><Icon name="coins" size={18} className="inline-block" /></span>
                    <div className="font-black text-lg mt-1 text-yellow-400">+{openChestAnimation.coinsWon}</div>
                    <div className="text-[9px] font-bold text-amber-300 uppercase tracking-widest">Monedas</div>
                  </div>
                )}
                {openChestAnimation.ticketsWon > 0 && (
                  <div className="p-4 bg-blue-500/20 rounded-2xl border border-blue-500/40 text-center">
                    <span className="text-3xl"><Icon name="ticket" size={18} className="inline-block" /></span>
                    <div className="font-black text-lg mt-1 text-blue-400">+{openChestAnimation.ticketsWon}</div>
                    <div className="text-[9px] font-bold text-blue-300 uppercase tracking-widest">Tickets</div>
                  </div>
                )}
              </div>
            )}

            <Button onClick={onClose} color="yellow" className="w-full mt-4">
              Reclamar Todo
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
