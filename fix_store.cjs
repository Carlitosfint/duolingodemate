const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const storeBlock = `
                    {/* Section 1: Poderes y Mejoras */}
                    <h3 className={\`text-xl font-black mb-4 flex items-center gap-2 \$\{currentThemeStyle.textPrimary\}\`}>
                      <Icon name="zap" className="text-amber-500" size={22} /> Poderes y Mejoras
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      
                      {/* Seguro Básico */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-100 bg-emerald-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl text-blue-500">🛡️</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-emerald-800">Seguro Básico</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-emerald-700/80">Cubre tus pérdidas si te equivocas.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-emerald-700 font-black text-[10px] sm:text-xs shrink-0">Tienes: {shieldCount}</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 if (user.coins >= 60) { setUser(prev => prev ? { ...prev, coins: prev.coins - 60 } : null); setShieldCount(s => s + 1); playClickSound(); } else { alert("No tienes suficientes monedas."); }
                              }}
                            >
                               60 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Póliza Premium x3 */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-100 bg-emerald-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">🔰</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-emerald-800">Póliza Premium x3</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-emerald-700/80">3 Seguros contra errores de cálculo.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-emerald-700 font-black text-[10px] sm:text-xs shrink-0">Ahorro especial</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 if (user.coins >= 150) { setUser(prev => prev ? { ...prev, coins: prev.coins - 150 } : null); setShieldCount(s => s + 3); playClickSound(); } else { alert("No tienes suficientes monedas."); }
                              }}
                            >
                               150 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Rally Alcista */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-fuchsia-100 bg-fuchsia-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">⚡</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-fuchsia-800">Rally Alcista</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-fuchsia-700/80">Activa la Supernova al instante.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                             <span className="text-fuchsia-700 font-black text-[10px] sm:text-xs shrink-0">{isSupernova ? 'Ya activo' : ''}</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto disabled:opacity-50" 
                              disabled={isSupernova}
                              onClick={() => {
                                 if (user.coins >= 150) { setUser(prev => prev ? { ...prev, coins: prev.coins - 150 } : null); setIsSupernova(true); playClickSound(); } else { alert("No tienes suficientes monedas."); }
                              }}
                            >
                               150 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Dividendos x3 */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-blue-100 bg-blue-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl text-rose-500">🎟️</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-blue-800">Dividendos x3</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-blue-700/80">Triple de tickets (3 aciertos).</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-blue-700 font-black text-[10px] sm:text-xs shrink-0">{activeDoubleDividends ? 'Activo' : 'Inactivo'}</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 if (user.coins >= 200 && !activeDoubleDividends) { setUser(prev => prev ? { ...prev, coins: prev.coins - 200 } : null); setActiveDoubleDividends(true); playClickSound(); } else if (activeDoubleDividends) { alert("Ya tienes este poder activo."); } else { alert("No tienes suficientes monedas."); }
                              }}
                            >
                               200 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Inyección de Capital */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-amber-100 bg-amber-50/50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">💰</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-amber-800">Inyección de Capital</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-amber-700/80">Doble de monedas (5 aciertos).</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-amber-700 font-black text-[10px] sm:text-xs shrink-0">Boost activo</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 alert("Disponible próximamente");
                              }}
                            >
                               250 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Contrato Seguro */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-rose-100 bg-rose-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">🎁</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-rose-800">Contrato Seguro</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-rose-700/80">Caja Fuerte garantizada en tu próximo acierto.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-rose-700 font-black text-[10px] sm:text-xs shrink-0">Garantía</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 alert("Disponible próximamente");
                              }}
                            >
                               180 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                    </div>
`;

code = code.replace(
  /\{\/\* Section 1: Poderes y Mejoras \*\/\}[\s\S]*?\{\/\* Section 2: Cofres \*\/\}/m,
  storeBlock + '\n                    {/* Section 2: Cofres */}'
);

fs.writeFileSync('src/App.tsx', code);
