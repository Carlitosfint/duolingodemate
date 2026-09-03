import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Desktop Nav Replacement
desktop_nav_pattern = re.compile(r'<nav className="flex flex-col gap-2 landscape:max-lg:gap-1 z-10 landscape:max-lg:text-sm">.*?</nav>', re.DOTALL)

desktop_nav_replacement = """<nav className="flex flex-col gap-2 landscape:max-lg:gap-1 z-10 landscape:max-lg:text-sm">
                 <button onClick={() => setViewMode('map')} className={`flex items-center gap-4 ${viewMode === 'map' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'map' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="home" className="relative z-10" /> <span className="relative z-10">Aprender</span>
                 </button>
                 <button onClick={() => setViewMode('practice')} className={`flex items-center gap-4 ${viewMode === 'practice' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'practice' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="target" className="relative z-10" /> <span className="relative z-10">Infinito</span>
                 </button>
                 <button onClick={() => setViewMode('album')} className={`flex items-center gap-4 ${viewMode === 'album' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'album' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="folder" className="relative z-10" /> <span className="relative z-10">Álbumes</span>
                 </button>
                 <button onClick={() => setViewMode('shop')} className={`flex items-center gap-4 ${viewMode === 'shop' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'shop' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="store" className="relative z-10" /> <span className="relative z-10">Tienda</span>
                 </button>
                 <button onClick={() => setViewMode('profile')} className={`flex items-center gap-4 ${viewMode === 'profile' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'profile' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="user" className="relative z-10" /> <span className="relative z-10">Perfil</span>
                 </button>
              </nav>"""

code = desktop_nav_pattern.sub(desktop_nav_replacement, code)

# Mobile Nav Replacement
mobile_nav_pattern = re.compile(r'<motion\.div\s*initial=\{\{ y: 100.*?</motion\.div>', re.DOTALL)
mobile_nav_replacement = """<motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.0, ease: "easeOut" }}
          className="nav-sidebar lg:hidden landscape:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 p-2 z-[100] flex justify-around items-center pb-safe"
        >
          <button onClick={() => setViewMode('map')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'map' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="home" />
            <span className="text-[9px] font-black uppercase tracking-wider">Aprender</span>
          </button>
          <button onClick={() => setViewMode('practice')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'practice' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="target" />
            <span className="text-[9px] font-black uppercase tracking-wider">Infinito</span>
          </button>
          <button onClick={() => setViewMode('album')} className={`p-2 rounded-xl flex flex-col items-center gap-1 relative ${viewMode === 'album' ? 'text-blue-500' : 'text-slate-400'}`}>
            {unplacedPieces.length > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
            <Icon name="folder" />
            <span className="text-[9px] font-black uppercase tracking-wider">Álbumes</span>
          </button>
          <button onClick={() => setViewMode('shop')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'shop' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="store" />
            <span className="text-[9px] font-black uppercase tracking-wider">Tienda</span>
          </button>
          <button onClick={() => setViewMode('profile')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'profile' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="user" />
            <span className="text-[9px] font-black uppercase tracking-wider">Perfil</span>
          </button>
        </motion.div>"""

code = mobile_nav_pattern.sub(mobile_nav_replacement, code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

