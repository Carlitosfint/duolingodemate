import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

old_abrir = """              {isCurrent && (
                <div className="absolute top-[-50px] bg-white text-slate-800 font-bold px-4 py-2 rounded-xl shadow-md border-2 border-slate-200 animate-pulse whitespace-nowrap z-50 uppercase tracking-widest text-xs flex flex-col items-center pointer-events-none">
                  ABRIR
                  <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                </div>
              )}"""

new_abrir = """              {isCurrent && (
                <motion.div 
                  layoutId="current-abrir-popup"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-[-50px] bg-white text-slate-800 font-bold px-4 py-2 rounded-xl shadow-md border-2 border-slate-200 animate-pulse whitespace-nowrap z-50 uppercase tracking-widest text-xs flex flex-col items-center pointer-events-none"
                >
                  ABRIR
                  <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                </motion.div>
              )}"""

content = content.replace(old_abrir, new_abrir)

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)

