import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_canvas = """          {/* Active Problem Solver Canvas */}
          <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3.5rem] border-[4px] border-slate-200 p-6 md:p-10 shadow-md relative text-center flex flex-col items-center">
            
            <div className="flex items-center gap-3 mb-6">"""

new_canvas = """          {/* Active Problem Solver Canvas */}
          <div className={`bg-white/95 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3.5rem] border-[4px] border-slate-200 p-6 md:p-10 shadow-md relative flex flex-col items-center ${currentThemeStyle.cardBg} ${currentThemeStyle.bezelClass}`}>
            
            <div className="flex items-center gap-3 mb-6">"""

content = content.replace(old_canvas, new_canvas)

old_intro = """            <p className="text-slate-800 font-bold text-base md:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl text-center whitespace-pre-line">
              {currentProblem.data.intro}
            </p>"""

new_intro = """            <div className={`w-full max-w-2xl p-6 md:p-8 rounded-[2rem] border-[3px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] mb-8 text-center relative overflow-hidden ${currentThemeStyle.bentoBg || 'bg-slate-50 border-slate-200'}`}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
              <p className={`font-bold text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line relative z-10 ${currentThemeStyle.textPrimary || 'text-slate-800'}`}>
                {currentProblem.data.intro}
              </p>
            </div>"""

content = content.replace(old_intro, new_intro)

old_form = """            {/* Answer Submission Form */}
            <form onSubmit={checkAnswerSubmit} className="w-full max-w-md flex flex-col items-center gap-4 mb-6">
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={inputAnswer}
                  onChange={(e) => {
                    setInputAnswer(e.target.value);
                    if (previewTheme) setPreviewTheme(null);
                  }}
                  placeholder="Ej. 44 o 56.25 (sin %)" 
                  disabled={currentProblem.solved}
                  required
                  className="w-full px-6 py-4 rounded-3xl border-[3px] border-slate-200 focus:border-blue-500 focus:outline-none font-black text-center text-xl text-slate-800 bg-slate-50"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">%</span>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                  type="submit" 
                  disabled={currentProblem.solved || !inputAnswer.trim()} 
                  color="blue" 
                  className="w-full py-4 text-base font-black uppercase tracking-wider"
                >
                  📥 Entregar
                </Button>
                
                <Button 
                  type="button" 
                  onClick={skipProblem} 
                  disabled={currentProblem.solved} 
                  color="slate" 
                  className="w-full py-4 text-xs font-black uppercase tracking-wider"
                  title="Genera un problema alternativo."
                >
                  ⏭️ Saltar (🪙 {marketEvent?.effect === 'cheap_skips' ? Math.round(((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60) / 2) : ((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60)})
                </Button>
              </div>
            </form>"""

new_form = """            {/* Answer Submission Form */}
            <form onSubmit={checkAnswerSubmit} className={`w-full max-w-2xl p-6 md:p-8 rounded-[2rem] border-[3px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] flex flex-col items-center gap-6 mb-6 ${currentThemeStyle.bentoBg || 'bg-slate-50 border-slate-200'}`}>
              <div className="w-full max-w-md">
                <h4 className={`text-xs font-black uppercase tracking-widest mb-3 text-center ${currentThemeStyle.textSecondary || 'text-slate-500'}`}>Tu Respuesta</h4>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={inputAnswer}
                    onChange={(e) => {
                      setInputAnswer(e.target.value);
                      if (previewTheme) setPreviewTheme(null);
                    }}
                    placeholder="Ej. 44 o 56.25 (sin %)" 
                    disabled={currentProblem.solved}
                    required
                    className="w-full px-6 py-4 rounded-2xl border-[3px] border-slate-300 focus:border-blue-500 focus:outline-none font-black text-center text-2xl text-slate-800 bg-white shadow-sm transition-colors"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400 pointer-events-none">%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-2">
                <Button 
                  type="submit" 
                  disabled={currentProblem.solved || !inputAnswer.trim()} 
                  color="blue" 
                  className="w-full py-4 text-sm sm:text-base font-black uppercase tracking-wider shadow-sm"
                >
                  📥 Entregar
                </Button>
                
                <Button 
                  type="button" 
                  onClick={skipProblem} 
                  disabled={currentProblem.solved} 
                  color="slate" 
                  className="w-full py-4 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm leading-tight"
                  title="Genera un problema alternativo."
                >
                  ⏭️ Saltar (🪙 {marketEvent?.effect === 'cheap_skips' ? Math.round(((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60) / 2) : ((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount' ? Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value) : 60)})
                </Button>
              </div>
            </form>"""

content = content.replace(old_form, new_form)

with open('src/App.tsx', 'w') as f:
    f.write(content)

