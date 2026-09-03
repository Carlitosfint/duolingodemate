import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';
import { SVGWheel } from './SVGWheel';

interface TicketModalProps {
  onClose: () => void;
  spinning: boolean;
  wheelRotation: number;
  prizes: any[];
  onSpin: () => void;
  tickets: number;
  lastPrize: string | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  onClose,
  spinning,
  wheelRotation,
  prizes,
  onSpin,
  tickets,
  lastPrize
}) => {
  return (
    <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
      <Card className="w-full max-w-md border-4 border-blue-500 bg-gradient-to-b from-slate-900 to-indigo-950 p-6 md:p-8 text-center text-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-25 pointer-events-none"></div>

        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1 drop-shadow-md">
          <Icon name="ticket" size={18} className="inline-block" /> Ruleta de Dividendos
        </h3>
        <p className="text-indigo-200 font-bold mb-6 text-xs uppercase tracking-widest">
          ¡Gasta 15 Tickets para ganar Monedas y sorpresas!
        </p>

        <SVGWheel 
          rotation={wheelRotation} 
          prizes={prizes} 
          speedClass={spinning ? "wheel-fast" : "wheel-slow"} 
          renderText={(p) => p.text}
        />

        {lastPrize && (
          <div className="p-3 bg-indigo-900/50 border border-indigo-500/40 rounded-2xl mb-4 font-black text-base md:text-lg animate-pop text-indigo-200">
            🏆 ¡Ganaste: <span className="text-white font-black">{lastPrize}</span>!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full relative z-10">
          <Button 
            onClick={onSpin} 
            color="purple" 
            disabled={spinning || tickets < 15}
            className="w-full font-black text-xs md:text-sm uppercase tracking-widest"
          >
            <Icon name="ticket" size={18} className="inline-block" /> Girar (-15 <Icon name="ticket" size={18} className="inline-block" />)
          </Button>
          <Button 
            onClick={onClose} 
            color="slate" 
            disabled={spinning}
            className="w-full font-black text-xs md:text-sm uppercase tracking-widest"
          >
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  );
};
