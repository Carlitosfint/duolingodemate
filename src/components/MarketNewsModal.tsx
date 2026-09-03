import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';
import { MarketEvent } from '../types';

interface MarketNewsModalProps {
  onClose: () => void;
  event: MarketEvent;
}

export const MarketNewsModal: React.FC<MarketNewsModalProps> = ({ onClose, event }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-pop">
      <Card className="w-full max-w-md border-4 border-amber-500 bg-white p-6 md:p-8 text-center">
        <div className="mb-4 animate-bounce text-amber-500 flex justify-center">
          <Icon name={event.icon} size={60} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-1">{event.name}</h3>
        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest inline-block mb-4">
          Evento Económico Activo
        </span>
        <p className="text-slate-600 font-bold mb-6 text-sm leading-relaxed">
          {event.desc}
        </p>
        <Button onClick={onClose} color="slate" className="w-full">
          Entendido, Volver al Mercado
        </Button>
      </Card>
    </div>
  );
};
