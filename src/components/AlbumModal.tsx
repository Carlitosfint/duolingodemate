import { Icon } from './CustomIcons';
import React from 'react';
import { Button } from './UI';
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
      <div className={`flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b-2 border-slate-800 pb-5 relative z-10 ${isInline ? 'p-6 md:p-8 pb-5 shrink-0' : ''}`}>
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black text-white flex items-center justify-center md:justify-start gap-2.5">
            <Icon name="folder" size={26} className="text-emerald-400" /> Álbumes de Colección
          </h3>
          <p className="text-slate-400 font-bold text-xs md:text-sm mt-1">
            Completa las partes de cada figura abriendo cofres y gana Tickets de recompensa.
          </p>
        </div>
        {unplacedPieces.length > 0 && (
          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black text-xs uppercase tracking-wider animate-pulse shrink-0">
            ¡Tienes {unplacedPieces.length} {unplacedPieces.length === 1 ? 'pieza lista' : 'piezas listas'} para colocar!
          </div>
        )}
        {!isInline && onClose && (
          <Button onClick={onClose} color="slate" className="shrink-0 w-full md:w-auto">
            Cerrar Álbum
          </Button>
        )}
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 no-scrollbar ${isInline ? 'flex-1 overflow-y-auto px-6 md:px-8 pb-8' : 'max-h-[60vh] overflow-y-auto pr-2'}`}>
        {albums.map((album) => {
          const state = albumsState[album.id] || { piecesOwned: [], completed: false, claimed: false };
          const ownedCount = state.piecesOwned.length;
          const rows = Math.max(1, Math.round(album.pieces / album.cols));
          const progressPercent = Math.min(100, Math.floor((ownedCount / album.pieces) * 100));

          return (
            <div key={album.id} className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                      <Icon name={album.emoji} size={24} className="text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-base text-slate-100 truncate">{album.name}</h4>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        Premio: <span className="text-amber-300 font-black">+{album.reward}</span> <Icon name="ticket" size={16} className="inline-block" />
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-black text-emerald-400 shrink-0">
                    {ownedCount}/{album.pieces}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                {/* Tablero cuadrado uniforme para todas las figuras (2x2, 3x3 y 4x3) */}
                <div
                  className="w-full aspect-square grid gap-1.5 border-2 border-slate-800 p-2 rounded-2xl bg-slate-900 mb-4"
                  style={{
                    gridTemplateColumns: `repeat(${album.cols}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: album.pieces }).map((_, i) => {
                    const isOwned = state.piecesOwned.includes(i);
                    const unplacedPieceIndex = unplacedPieces.findIndex(p => p.albumId === album.id && p.pieceIndex === i);
                    const isUnplaced = unplacedPieceIndex !== -1;
                    const sliceStatus = isOwned ? 'owned' : isUnplaced ? 'unplaced' : 'locked';

                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (isUnplaced && placePiece) placePiece(unplacedPieceIndex);
                        }}
                        className={`relative w-full h-full rounded-lg overflow-hidden border transition-all duration-200 ${
                          isOwned
                            ? 'border-emerald-400'
                            : isUnplaced
                            ? 'border-amber-400 cursor-pointer hover:scale-[1.03] animate-pulse'
                            : 'border-slate-700'
                        }`}
                      >
                        <PuzzleSlice
                          emoji={album.emoji}
                          cols={album.cols}
                          totalPieces={album.pieces}
                          index={i}
                          status={sliceStatus}
                          className="w-full h-full"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pie de tarjeta uniforme en los 5 álbumes */}
              {state.completed && !state.claimed ? (
                <Button onClick={() => claimAlbumReward(album.id)} color="green" className="w-full py-2.5 text-xs uppercase tracking-widest">
                  Canjear +{album.reward} Tickets
                </Button>
              ) : (
                <div className="w-full py-2.5 px-3 bg-slate-900 border border-slate-800 rounded-xl font-black text-xs text-center text-slate-300 flex items-center justify-between">
                  <span>{state.completed ? '¡Figura completada!' : `Figura de ${album.pieces} partes`}</span>
                  <span className={state.completed ? 'text-emerald-400' : 'text-slate-400'}>
                    {state.completed ? 'Reclamado ✓' : `${ownedCount}/${album.pieces} (${progressPercent}%)`}
                  </span>
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
