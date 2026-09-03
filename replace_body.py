import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "      {/* Main Grid Workspace */}"
end_marker = "      </main>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_body = """      {/* Main Grid Workspace */}
      <main className="max-w-5xl w-full mx-auto flex flex-col relative z-10 flex-1 min-h-0" style={{ animationDelay: '0.1s' }}>

        {/* Single Body Container */}
        <div className="bg-white rounded-[2rem] border-[4px] border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row w-full flex-1 overflow-hidden">
          
          {/* Active Problem Solver Canvas (Left) */}
          <div className="flex-1 bg-white p-6 md:p-10 flex flex-col relative border-b lg:border-b-0 lg:border-r-[3px] border-slate-100/60">
            <div className="flex justify-center items-center mb-8 gap-2">
              <span className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E8F0FE] text-blue-700 shadow-sm">
                DESAFÍO #{progress.level}
              </span>
            </div>

            <div className="flex-1 flex flex-col text-center max-w-md mx-auto w-full">
              <p className="font-bold text-[14px] md:text-[15px] leading-relaxed text-slate-800 mb-8 px-2 md:px-4">
                {currentProblem.data.intro}
              </p>
              
              <div className="bg-[#F8F9FA] rounded-[1.5rem] p-6 text-indigo-950 font-bold text-[14px] md:text-[15px] leading-relaxed relative border-2 border-indigo-50/50 shadow-sm mt-auto">
                ¿Cuál es la respuesta correcta a este enigma matemático?
              </div>
            </div>
          </div>

          {/* Answer Form (Right) */}
          <div className="flex-1 bg-white p-6 md:p-10 flex flex-col relative">
            
            <div className="flex justify-center items-center gap-2 mb-8">
              <span className="text-xl">🔎</span>
              <h2 className="text-[17px] font-black text-slate-800 tracking-tight">Cálculo de Mezcla</h2>
            </div>
            
            <form onSubmit={checkAnswerSubmit} className="flex-1 flex flex-col items-center justify-center w-full max-w-[340px] mx-auto">
              
              <div className="flex-1 flex flex-col items-center justify-center mb-8 w-full">
                <span className="text-[70px] drop-shadow-md mb-6 animate-float" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}>🧪</span>
                <h4 className="text-slate-500 font-bold mb-4 text-[13px]">Ingresa tu respuesta:</h4>
                
                <div className="w-full relative">
                  <input 
                    type="text" 
                    value={inputAnswer} 
                    onChange={(e) => {
                      setInputAnswer(e.target.value);
                      if (previewTheme) setPreviewTheme(null);
                    }}
                    placeholder="Ej: 15" 
                    disabled={currentProblem.solved}
                    className={`w-full px-6 py-5 rounded-[1.25rem] border-[3px] focus:outline-none font-black text-center text-[32px] text-slate-800 placeholder:text-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all ${isShaking ? 'animate-shake border-rose-400 ring-4 ring-rose-100' : 'border-slate-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 hover:border-slate-200'}`}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 pointer-events-none">%</span>
                </div>

                {/* Answer Feedbacks */}
                {answerState.type !== 'idle' && (
                  <div className={`mt-4 p-4 rounded-xl border-2 w-full animate-pop font-black text-sm text-center shadow-md ${answerState.type === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
                    {answerState.text}
                  </div>
                )}
                
                {currentProblem.solved && (
                  <Button 
                    type="button"
                    onClick={loadNextProblem} 
                    color="green" 
                    className="w-full mt-4 py-4 text-base font-black uppercase tracking-widest animate-bounce"
                  >
                    ➡️ Siguiente desafío
                  </Button>
                )}
              </div>

              {/* Buttons Row */}
              <div className="flex items-stretch justify-center gap-3 w-full h-[60px] pt-1 mt-auto">
                 <button 
                   type="button"
                   disabled={currentProblem.solved} 
                   className="flex-[0.8] flex flex-col items-center justify-center bg-yellow-400 hover:bg-yellow-300 border-yellow-600 border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] rounded-[1.5rem] text-yellow-900 font-black text-[12px] md:text-[13px] shadow-sm transition-all disabled:opacity-50"
                   title="Pedir pista"
                 >
                   <div className="flex items-center gap-1.5 mb-0.5 mt-0.5">
                     <span className="text-lg leading-none">💡</span>
                     <span className="leading-none">Pista (-30)</span>
                   </div>
                 </button>

                 <button 
                   type="button"
                   onClick={skipProblem} 
                   disabled={currentProblem.solved} 
                   className="flex-[0.8] flex flex-col items-center justify-center bg-blue-500 hover:bg-blue-400 border-blue-700 border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] rounded-[1.5rem] text-white font-black text-[12px] md:text-[13px] shadow-sm transition-all disabled:opacity-50"
                   title="Saltar problema"
                 >
                   <div className="flex items-center gap-1 mb-0.5 mt-0.5">
                     <span className="text-lg leading-none">⏭️</span>
                     <span className="leading-none">Saltar (-{marketEvent?.effect === 'cheap_skips' ? Math.round(((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60) / 2) : ((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60)})</span>
                   </div>
                 </button>
                 
                 <button 
                   type="submit"
                   disabled={currentProblem.solved || !inputAnswer.trim()} 
                   className="flex-[1.2] bg-emerald-500 hover:bg-emerald-400 border-emerald-700 border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] rounded-[1.5rem] text-white font-black text-[13px] md:text-[14px] tracking-widest uppercase shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                   ENVIAR RESPUESTA ☑️
                 </button>
              </div>
            </form>
          </div>
        </div>
      </main>"""

new_content = content[:start_idx] + new_body + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(new_content)

print("Done")
