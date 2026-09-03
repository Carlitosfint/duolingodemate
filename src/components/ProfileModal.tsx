import { Icon } from './CustomIcons';
import React from 'react';
import { Card, Button } from './UI';
import { Stats, Trophy } from '../types';
import { Avatar } from './Avatar';
import { auth } from '../lib/firebase.ts';

interface ProfileModalProps {
  onClose?: () => void;
  stats: Stats;
  user: { name: string; avatar: string; coins: number; tickets: number };
  trophies: Trophy[];
  coinsSpent: number;
  skipsUsed: number;
  isInline?: boolean;
  onReplayTutorial?: () => void;
  onLogout?: () => void;
  onOpenCodice?: () => void;
  onOpenMistakes?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  stats,
  user,
  trophies,
  coinsSpent,
  skipsUsed,
  isInline,
  onReplayTutorial,
  onLogout,
  onOpenCodice,
  onOpenMistakes
}) => {
  const [showRoleInput, setShowRoleInput] = React.useState(false);
  const content = (
    <div className={`w-full ${isInline ? 'h-full bg-white border-0 rounded-none overflow-hidden flex flex-col' : 'max-w-4xl bg-white border-[6px] border-slate-200 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 my-8 shadow-2xl animate-pop'} text-slate-800 relative`}>
      <div className={`flex flex-col lg:flex-row justify-between items-center gap-4 mb-8 border-b-2 border-slate-100 pb-6 relative z-10 ${isInline ? 'p-4 lg:p-8 pt-6 lg:pt-10 pb-6 shrink-0 mb-0' : ''}`}>
        <div className="flex items-center gap-4 text-left max-w-full overflow-hidden">
          <Avatar name={user.avatar} size={56} />
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-800 break-words line-clamp-2">
              Perfil de {user.name}
            </h3>
            
          {(user.role === 'teacher' || user.role === 'admin') ? (
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
              <Icon name="users" size={14} /> {user.role === 'admin' ? 'Administrador' : 'Profesor'}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estudiante en Colegio Ángeles de Jesús</p>
          )}
          
          
          {(user.role !== 'teacher' && user.role !== 'admin') && (
            <div className="mt-1 text-left">
              <button 
                onClick={() => setShowRoleInput(!showRoleInput)}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline"
              >
                ¿Eres profesor o administrador?
              </button>
              {showRoleInput && (
                <div className="mt-2 flex items-center gap-2">
                  <input type="text" id="roleCode" placeholder="Código de acceso" className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-blue-400 font-bold" />
                  <Button color="blue" className="py-1.5 px-3 text-[10px]" onClick={async () => {
                    const input = document.getElementById('roleCode') as HTMLInputElement;
                    const code = input?.value;
                    if (code) {
                      try {
                        const token = await auth.currentUser?.getIdToken();
                        const res = await fetch('/api/user/elevate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ code })
                        });
                        if (res.ok) {
                          alert('¡Rol actualizado! Recargando...');
                          window.location.reload();
                        } else {
                          input.value = '';
                          input.placeholder = 'Código inválido';
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}>Verificar</Button>
                </div>
              )}
            </div>
          )}


          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {onReplayTutorial && (
            <Button onClick={onReplayTutorial} color="blue" className="shrink-0 text-xs py-2 px-3">
              Ver Tutorial ❓
            </Button>
          )}
          {onOpenCodice && (
            <Button onClick={onOpenCodice} color="slate" className="shrink-0 text-xs py-2 px-3">
              Códice 📜
            </Button>
          )}
          {onOpenMistakes && (
            <Button onClick={onOpenMistakes} color="slate" className="shrink-0 text-xs py-2 px-3">
              Errores ❌
            </Button>
          )}
          {onLogout && (
            <Button onClick={onLogout} color="red" className="shrink-0 text-xs py-2 px-3">
              Cerrar Sesión 🚪
            </Button>
          )}
          {!isInline && onClose && (
            <Button onClick={onClose} color="slate" className="shrink-0 w-full md:w-auto text-xs py-2 px-3">
              Cerrar Perfil
            </Button>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 no-scrollbar ${isInline ? 'flex-1 overflow-y-auto px-4 lg:px-8 pb-8' : 'overflow-visible'}`}>          
          
        <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl">
              <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-3">Tus Recursos</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-100 font-black text-xs text-center">
                  <span className="text-slate-400 mb-1 text-[10px]">MONEDAS</span>
                  <span className="text-amber-500 text-base sm:text-lg flex items-center gap-1 font-black"><Icon name="coins" size={18} className="inline-block" /> {user.coins}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-white p-3 rounded-2xl border border-slate-100 font-black text-xs text-center">
                  <span className="text-slate-400 mb-1 text-[10px]">TICKETS</span>
                  <span className="text-blue-500 text-base sm:text-lg flex items-center gap-1 font-black"><Icon name="ticket" size={18} className="inline-block" /> {user.tickets}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl">
              <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-3">Métricas de Rendimiento</h4>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between">
                  <span>Aciertos:</span>
                  <span className="text-slate-800 font-black">{stats.solved}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intentos Fallidos:</span>
                  <span className="text-slate-800 font-black">{stats.failedAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Racha Máxima:</span>
                  <span className="text-amber-600 font-black">🔥 {stats.maxStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aciertos Dorados:</span>
                  <span className="text-yellow-600 font-black flex items-center gap-1"><Icon name="star" size={16} className="inline-block" /> {stats.goldenWins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aciertos Legendarios:</span>
                  <span className="text-purple-600 font-black flex items-center gap-1"><Icon name="diamond" className="inline-block" size={16} /> {stats.legendaryWins}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monedas Gastadas:</span>
                  <span className="text-slate-800 font-black flex items-center gap-1"><Icon name="coins" size={16} className="inline-block text-amber-500" /> {coinsSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saltos Usados:</span>
                  <span className="text-slate-800 font-black">⏭️ {skipsUsed}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl mt-4">
              <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-3">Tickets por Tema</h4>
              <div className="space-y-2 text-xs font-bold text-slate-600">
                {Object.keys(stats.ticketsByTopic || {}).length === 0 ? <p className="text-slate-400 font-medium italic text-[11px]">Aún no hay tickets.</p> : Object.entries(stats.ticketsByTopic || {}).map(([topic, tickets]) => (
                  <div key={topic} className="flex justify-between">
                    <span className="truncate pr-2">{topic}:</span>
                    <span className="text-blue-600 font-black flex items-center gap-1"><Icon name="ticket" size={14} className="inline-block" /> {tickets}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl">
              <h4 className="font-black text-slate-700 text-xs uppercase tracking-widest mb-3">Logros y Trofeos Unlocked</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {trophies.map((t) => {
                  const unlocked = t.req(stats, user.coins, skipsUsed, coinsSpent);
                  const isIconKey = t.icon && (t.icon.length > 2 || /^[a-z_]+$/i.test(t.icon));
                  return (
                    <div 
                       key={t.id} 
                       className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${unlocked ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-sm' : 'bg-slate-100/50 border-slate-200 opacity-60'}`}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${unlocked ? 'animate-pulse' : 'grayscale'}`}>
                        {isIconKey ? (
                          <Icon name={t.icon} size={28} className={unlocked ? 'text-amber-500' : 'text-slate-400'} />
                        ) : (
                          <span className="text-2xl filter drop-shadow-sm">{t.icon}</span>
                        )}
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <h5 className={`font-black text-sm ${unlocked ? 'text-amber-800' : 'text-slate-500'}`}>{t.name}</h5>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight">{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 bg-black/85 z-[300] p-4 md:p-8 backdrop-blur-md overflow-y-auto no-scrollbar">
      <div className="min-h-full flex items-center justify-center py-8">
        {content}
      </div>
    </div>
  );
};
