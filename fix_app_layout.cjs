const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<h4 className="text-slate-500 font-bold mb-4 text-\[13px\]">Ingresa tu respuesta:<\/h4>[\s\S]*?ENVIAR RESPUESTA <Icon name="check" size=\{20\} \/>\s*<\/button>\s*<\/div>\s*<\/form>/;

const replacement = `
                {/* Answer Feedbacks */}
                {answerState.type !== 'idle' && (
                  <div className={\`mb-6 p-4 rounded-xl border-2 w-full animate-pop font-black text-sm text-center shadow-md \${answerState.type === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}\`}>
                    {answerState.text}
                  </div>
                )}
                
                {currentProblem.solved ? (() => {
                  const prog = viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic] || 0) : (user?.progress || 0);
                  const isEventNext = (prog + 1) % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);
                  
                  if (isEventNext) {
                    return (
                      <Button 
                        type="button"
                        onClick={() => {
                          playClickSound();
                          const cycle = Math.floor(prog / 3);
                          setTimeout(() => {
                            if (cycle % 7 === 0) {
                                setShowShellGame(true);
                            } else if (cycle % 7 === 3) {
                                setShowPetRace(true);
                            } else {
                                openRandomChest('rare');
                                advanceEventProgress();
                            }
                          }, 300);
                        }} 
                        color="amber" 
                        className="w-full py-4 text-base font-black uppercase tracking-widest animate-pulse shadow-[0_4px_0_#d97706] active:shadow-none active:translate-y-1"
                      >
                        <Icon name="gift" size={18} className="inline-block" /> Reclamar Recompensa
                      </Button>
                    );
                  }
                  
                  return (
                    <Button 
                      type="button"
                      onClick={loadNextProblem} 
                      color="green" 
                      className="w-full py-4 text-base font-black uppercase tracking-widest shadow-[0_4px_0_#047857] active:shadow-none active:translate-y-1 hover:-translate-y-0.5 transition-all animate-bounce"
                    >
                      SIGUIENTE DESAFÍO <Icon name="arrow_right" size={20} className="inline-block ml-1" />
                    </Button>
                  );
                })() : (
                  <>
                    <h4 className="text-slate-500 font-bold mb-4 text-[13px]">Ingresa tu respuesta:</h4>
                    
                    <div className="w-full relative mb-6">
                      <input 
                        type="text" 
                        value={inputAnswer} 
                        onChange={(e) => {
                          setInputAnswer(e.target.value);
                          if (previewTheme) setPreviewTheme(null);
                        }}
                        placeholder="Ej: 15" 
                        disabled={currentProblem.solved}
                        className={\`w-full px-6 py-5 rounded-[1.25rem] border-[3px] focus:outline-none font-black text-center text-[32px] text-slate-800 placeholder:text-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all \${isShaking ? 'animate-shake border-rose-400 ring-4 ring-rose-100' : 'border-slate-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 hover:border-slate-200'}\`}
                      />
                      {currentProblem.data.unit && (
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 pointer-events-none">{currentProblem.data.unit}</span>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={!inputAnswer.trim()} 
                      className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-2 active:translate-y-0.5 rounded-2xl text-white font-black text-sm md:text-base tracking-widest uppercase shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer indestructible-btn"
                    >
                      ENVIAR RESPUESTA <Icon name="check" size={20} />
                    </button>
                  </>
                )}
              </div>
            </form>
`;

code = code.replace(regex, replacement.trim());
fs.writeFileSync('src/App.tsx', code);
