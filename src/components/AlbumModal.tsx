import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';
import { PuzzleSlice } from './PuzzleSlice';
import { Album, AlbumState, UnplacedPiece } from '../types';

interface AlbumModalProps {
  onClose?: () => void;
  albums: Album[];
  albumsState: Record<string, AlbumState>;
  claimAlbumReward: (albumId: string) => void;
  isInline?: boolean;
  unplacedPieces?: UnplacedPiece[];
  placePiece?: (index: number) => void;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({
  onClose,
  albums,
  albumsState,
  claimAlbumReward,
  isInline,
  unplacedPieces = [],
  placePiece
}) => {
  const content = (
    <div className={`w-full ${isInline ? 'h-full bg-slate-900 border-0 rounded-none overflow-hidden flex flex-col' : 'max-w-4xl bg-slate-900 border-4 border-slate-700 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 my-8 shadow-2xl animate-pop'} text-white relative`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-15 pointer-events-none"></div>

      <div className={`flex flex-col md:flex-row justify-between items-center gap-4 mb-8 border-b-2 border-slate-800 pb-6 relative z-10 ${isInline ? 'p-8 pt-10 pb-6 shrink-0' : ''}`}>
        <div className="text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 flex items-center justify-center md:justify-start gap-2">
            <Icon name="folder" size={18} className="inline-block" /> Álbumes Financieros
          </h3>
          <p className="text-slate-400 font-bold text-xs md:text-sm mt-1 uppercase tracking-widest">Colecciona piezas de divisas raras y canjéalas por Tickets</p>
        </div>
        {!isInline && onClose && (
          <Button onClick={onClose} color="slate" className="shrink-0 w-full md:w-auto">
            Cerrar Álbum
          </Button>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 no-scrollbar ${isInline ? 'flex-1 overflow-y-auto px-8 pb-8' : 'max-h-[60vh] overflow-y-auto pr-2'}`}>
          {albums.map((album) => {
            const state = albumsState[album.id] || { piecesOwned: [], completed: false, claimed: false };
            const ownedCount = state.piecesOwned.length;
            const progressPercent = Math.min(100, Math.floor((ownedCount / album.pieces) * 100));

            return (
              <div key={album.id} className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col relative overflow-hidden group">
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 flex items-center justify-center text-6xl select-none`}>
    <Icon name={album.emoji} size={64} className="text-white" />
  </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700 shadow-md">
    <Icon name={album.emoji} size={28} className="text-white" />
  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-100">{album.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recompensa: <span className="text-blue-400">{album.reward} <Icon name="ticket" size={18} className="inline-block" /></span></span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between font-black text-xs text-slate-400 mb-1">
                    <span>PROGRESO</span>
                    <span className="text-teal-400">{ownedCount} / {album.pieces} ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700 p-0.5">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                <div className="grid gap-1 border-2 border-slate-800 p-2 rounded-2xl bg-slate-900 shadow-inner mb-4 flex-1" style={{ gridTemplateColumns: `repeat(${album.cols}, minmax(0, 1fr))` }}>
                  {Array.from({ length: album.pieces }).map((_, i) => {
                    const isOwned = state.piecesOwned.includes(i);
                    const unplacedPieceIndex = unplacedPieces.findIndex(p => p.albumId === album.id && p.pieceIndex === i);
                    const isUnplaced = unplacedPieceIndex !== -1;
                    return (
                      <div 
                        key={i} 
                        onClick={() => {
                          if (isUnplaced && placePiece) placePiece(unplacedPieceIndex);
                        }}
                        className={`aspect-square relative rounded-lg overflow-hidden flex items-center justify-center text-xs font-black border transition-all duration-200 ${isOwned ? 'bg-slate-800/80 border-teal-500 text-teal-400 font-black shadow-md' : isUnplaced ? 'bg-amber-500/20 border-amber-500 text-amber-400 cursor-pointer hover:bg-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse' : 'bg-slate-900/30 border-slate-800/80 text-slate-600'}`}
                      >
                        {isOwned ? (
                          <PuzzleSlice emoji={album.emoji} cols={album.cols} totalPieces={album.pieces} index={i} className="w-full h-full" />
                        ) : isUnplaced ? (
                          <div className="flex flex-col items-center justify-center w-full h-full pointer-events-none">
                            <Icon name="plus" size={24} className="opacity-80 drop-shadow-md" />
                            <span className="text-[9px] mt-1 uppercase">Colocar</span>
                          </div>
                        ) : (
                          <span>{(i + 1)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {state.completed ? (
                  state.claimed ? (
                    <div className="w-full py-2.5 bg-slate-800 border-2 border-slate-700 rounded-xl font-black text-xs text-center text-slate-500 uppercase tracking-widest">
                      <Icon name="gift" className="inline-block" size={18} /> Reclamado
                    </div>
                  ) : (
                    <Button onClick={() => claimAlbumReward(album.id)} color="green" className="w-full py-2.5 text-xs uppercase tracking-widest">
                      Canjear {album.reward} Tickets
                    </Button>
                  )
                ) : (
                  <div className="w-full py-2.5 bg-slate-900 border-2 border-slate-800/80 rounded-xl font-black text-xs text-center text-slate-500 uppercase tracking-widest">
                    Incompleto
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto no-scrollbar">
      {content}
    </div>
  );
};
