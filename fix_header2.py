import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "<header className={`max-w-5xl mx-auto w-full flex flex-row justify-between items-center gap-1.5 md:gap-2 mb-4 z-30 relative shrink-0 transition-all duration-300`}>"
start_idx = content.find(start_marker)

end_marker = "      {/* Main Grid Workspace */}"
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_header = """<header className={`max-w-5xl mx-auto w-full flex flex-row justify-between items-center gap-1.5 md:gap-2 mb-4 z-30 relative shrink-0 transition-all duration-300`}>
        {/* User Info & Currencies */}
        <div className={`flex items-center gap-2 md:gap-3 rounded-full border-2 p-1.5 md:p-2 pr-3 md:pr-4 shadow-sm ${currentThemeStyle.headerBg}`}>
          <button 
            onClick={() => { playClickSound(); setShowProfile(true); }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl md:text-2xl border-2 border-slate-200 hover:scale-105 transition-all shadow-md cursor-pointer indestructible-btn shrink-0"
          >
            {user.avatar}
          </button>
          <div className="flex flex-col min-w-0 pr-1">
            <h2 className={`font-black text-xs md:text-sm truncate leading-none ${currentThemeStyle.textPrimary}`}>{user.name}</h2>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Nivel {progress.level}</p>
          </div>
          
          <div className="flex items-center ml-2 bg-amber-400 rounded-full px-2 md:px-3 py-1 gap-1 border-b-[3px] border-amber-600 shadow-sm">
            <span className="text-xs">🎟️</span> 
            <span className="font-black text-xs md:text-sm text-amber-950">{tickets}</span>
          </div>
        </div>

        {/* Right Nav Icons */}
        <div className={`flex items-center gap-1.5 md:gap-2 rounded-full border-2 p-1.5 md:p-2 shadow-sm ${currentThemeStyle.headerBg}`}>
           <div className="hidden sm:flex items-center gap-1.5 px-3 text-slate-300">
             <span className="text-sm opacity-50 filter grayscale">⚡</span>
             <div className="w-5 h-1.5 bg-slate-200 rounded-full"></div>
             <div className="w-5 h-1.5 bg-slate-200 rounded-full"></div>
             <div className="w-5 h-1.5 bg-slate-200 rounded-full"></div>
           </div>
           
           <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>

           <button 
             onClick={() => { playClickSound(); setShowAlbum(true); }}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg md:text-xl border-2 border-amber-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"
             title="Álbumes"
           >
             🖼️
           </button>

           <button 
             onClick={() => setViewMode('map')}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 hover:scale-105 active:scale-95 transition-all shadow-sm ml-1 indestructible-btn"
             title="Volver al Mapa"
           >
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
             </svg>
           </button>
        </div>
      </header>
"""

new_content = content[:start_idx] + new_header + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(new_content)

print("Done")
