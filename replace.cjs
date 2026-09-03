const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const startStr = "{viewMode === 'shop' && (";
const endStr = "{viewMode === 'mistakes' && (";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
    console.error("Not found");
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const replacement = `{viewMode === 'shop' && (
                <div className="flex-1 relative bg-slate-50 overflow-y-auto p-6 md:p-10 no-scrollbar">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                       <div>
                         <h2 className="text-4xl font-black text-slate-800 tracking-tight">Tienda</h2>
                         <p className="text-slate-500 font-bold mt-2">Invierte tus monedas en ventajas estratégicas.</p>
                       </div>
                       <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border-2 border-slate-200 flex items-center gap-3 w-fit">
                         <span className="text-2xl">🪙</span>
                         <span className="text-xl font-black text-slate-700">{coins}</span>
                       </div>
                    </div>

                    <h3 className="text-xl font-black mb-4 text-slate-700 flex items-center gap-2">⚡ Poderes y Mejoras</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex gap-4 items-center hover:border-emerald-300 transition-colors group">
                         <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl border-2 border-emerald-100 shrink-0 group-hover:bg-emerald-100 transition-colors">🛡️</div>
                         <div className="flex-1">
                            <h4 className="font-black text-slate-800 text-lg">Escudo Protector</h4>
                            <p className="text-[11px] font-bold text-slate-500 leading-snug mt-1">Protege tu racha y tus vidas si cometes un error en el próximo desafío.</p>
                            <div className="flex items-center justify-between mt-3">
                               <span className="text-emerald-600 font-black text-[10px] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">Tienes: {shieldCount}</span>
                               <Button color="emerald" className="px-3 py-1.5 text-[10px] uppercase tracking-wider" onClick={() => {
                                  if (user.coins >= 300) { setUser(prev => prev ? { ...prev, coins: prev.coins - 300 } : null); setShieldCount(s => s + 1); playClickSound(); } else { alert("No tienes suficientes monedas."); }
                               }}>🪙 300</Button>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex gap-4 items-center hover:border-purple-300 transition-colors group">
                         <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-3xl border-2 border-purple-100 shrink-0 group-hover:bg-purple-100 transition-colors">⚡</div>
                         <div className="flex-1">
                            <h4 className="font-black text-slate-800 text-lg">Doble Dividendo</h4>
                            <p className="text-[11px] font-bold text-slate-500 leading-snug mt-1">Gana el doble de monedas y tickets en tu próximo desafío completado.</p>
                            <div className="flex items-center justify-between mt-3">
                               <span className="text-purple-600 font-black text-[10px] bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">{activeDoubleDividends ? 'Activo' : 'Inactivo'}</span>
                               <Button color="purple" className="px-3 py-1.5 text-[10px] uppercase tracking-wider" onClick={() => {
                                  if (user.coins >= 500 && !activeDoubleDividends) { setUser(prev => prev ? { ...prev, coins: prev.coins - 500 } : null); setActiveDoubleDividends(true); playClickSound(); } else if (activeDoubleDividends) { alert("Ya tienes este poder activo."); } else { alert("No tienes suficientes monedas."); }
                               }}>🪙 500</Button>
                            </div>
                         </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-black mb-4 text-slate-700 flex items-center gap-2">🎁 Cofres de Recompensas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                       <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                          <span className="text-5xl mb-3 drop-shadow-sm">📦</span>
                          <h4 className="font-black text-slate-800">Cofre Básico</h4>
                          <p className="text-[10px] font-bold text-slate-500 mt-1 mb-4">Posibilidad de premios estándar y piezas comunes.</p>
                          <Button color="slate" className="w-full text-[10px] mt-auto uppercase tracking-wider" onClick={() => alert("¡Próximamente!")}>🪙 500</Button>
                       </div>
                       <div className="bg-white p-5 rounded-3xl border-2 border-blue-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden">
                          <div className="absolute inset-0 bg-blue-50/50 z-0 pointer-events-none"></div>
                          <span className="text-5xl mb-3 relative z-10 drop-shadow-sm">💎</span>
                          <h4 className="font-black text-blue-900 relative z-10">Cofre Raro</h4>
                          <p className="text-[10px] font-bold text-blue-600/70 mt-1 mb-4 relative z-10">Mejores recompensas y piezas raras garantizadas.</p>
                          <Button color="blue" className="w-full text-[10px] mt-auto relative z-10 uppercase tracking-wider" onClick={() => alert("¡Próximamente!")}>🪙 1500</Button>
                       </div>
                       <div className="bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-orange-50 z-0 pointer-events-none"></div>
                          <span className="absolute top-3 right-3 text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full z-10 animate-pulse tracking-wider">HOT</span>
                          <span className="text-5xl mb-3 relative z-10 filter drop-shadow-md">👑</span>
                          <h4 className="font-black text-amber-900 relative z-10">Cofre Épico</h4>
                          <p className="text-[10px] font-bold text-amber-700/70 mt-1 mb-4 relative z-10">Premios masivos y alta probabilidad de piezas épicas.</p>
                          <Button color="amber" className="w-full text-[10px] mt-auto relative z-10 uppercase tracking-wider" onClick={() => alert("¡Próximamente!")}>🪙 5000</Button>
                       </div>
                    </div>

                    <h3 className="text-xl font-black mb-4 text-slate-700 flex items-center gap-2">🎨 Estilos Visuales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="p-4 bg-zinc-900 border-2 border-zinc-700 rounded-3xl flex justify-between items-center shadow-sm hover:border-zinc-500 transition-colors">
                          <div className="flex items-center gap-3">
                             <span className="text-3xl">🌌</span>
                             <div>
                                <h5 className="font-black text-white text-sm">Modo Nocturno</h5>
                                <p className="text-[10px] font-bold text-zinc-400">Estilo espacial y oscuro</p>
                             </div>
                          </div>
                          <Button color="blue" className="text-[10px] shrink-0 bg-blue-600 border-blue-700 uppercase tracking-wider px-3">Equipar</Button>
                       </div>
                       <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-3xl flex justify-between items-center shadow-sm hover:border-emerald-300 transition-colors">
                          <div className="flex items-center gap-3">
                             <span className="text-3xl">🌿</span>
                             <div>
                                <h5 className="font-black text-emerald-900 text-sm">Estilo Naturaleza</h5>
                                <p className="text-[10px] font-bold text-emerald-600">Tonos verdes y frescos</p>
                             </div>
                          </div>
                          <Button color="green" className="text-[10px] shrink-0 uppercase tracking-wider px-3" onClick={() => alert("Próximamente")}>🪙 2500</Button>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              `;

fs.writeFileSync('src/App.tsx', before + replacement + after);
console.log("Done");
