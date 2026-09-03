import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

# Replace race
old_race = """          } else if (isRace) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-32 h-32';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-32 h-32 flex items-center justify-center overflow-visible" style={{ perspective: '300px' }}>
                <div className="absolute w-24 h-24 rounded-full border-4 border-dashed border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm" style={{ transform: 'rotateX(60deg)' }}></div>
                <div className="text-[10px] font-black uppercase text-emerald-600 absolute bg-white/90 px-1.5 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-20" style={{ transform: 'translateY(5px)' }}>🏁</div>
                <motion.div 
                  className="absolute inset-0 w-full h-full"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: 'center' }}
                  animate={{ transform: ['rotateX(60deg) rotateZ(0deg)', 'rotateX(60deg) rotateZ(360deg)'] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-sm" style={{ transform: 'rotateX(-60deg) rotateY(0deg)' }}>🐶</span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-2xl filter drop-shadow-sm" style={{ transform: 'rotateX(-60deg) rotateY(180deg)' }}>🐱</span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl filter drop-shadow-sm" style={{ transform: 'rotateX(-60deg) rotateY(90deg)' }}>🦊</span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl filter drop-shadow-sm" style={{ transform: 'rotateX(-60deg) rotateY(270deg)' }}>🦉</span>
                </motion.div>
              </div>
            );"""

new_race = """          } else if (isRace) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-32 h-32';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-32 h-32 flex items-center justify-center overflow-visible">
                <div className="absolute w-24 h-24 rounded-full border-4 border-dashed border-emerald-500/30"></div>
                <div className="text-[10px] font-black uppercase text-emerald-600 absolute bg-white/90 px-1.5 py-0.5 rounded shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-20">🏁</div>
                
                <div className="absolute w-full h-full pointer-events-none">
                  <span className="animate-orbit text-2xl filter drop-shadow-sm">🐶</span>
                  <span className="animate-orbit-delayed text-2xl filter drop-shadow-sm">🐱</span>
                </div>
              </div>
            );"""

old_ufo_wheel = """          } else if (isUfo) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-24 h-24';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-24 h-24 flex items-center justify-center overflow-visible" style={{ perspective: '400px' }}>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-12 bg-cyan-300/30 rounded-b-full blur-[2px]"></div>
                <motion.div 
                  className="text-5xl filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)] select-none"
                  animate={{ 
                    y: [0, -12, 0],
                    x: [-15, 15, -15],
                    rotateY: [0, 180, 360],
                    rotateZ: [-5, 5, -5]
                  }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 2.0, ease: "easeInOut" },
                    x: { repeat: Infinity, duration: 4.0, ease: "easeInOut" },
                    rotateY: { repeat: Infinity, duration: 3.5, ease: "linear" },
                    rotateZ: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
                  }}
                >
                  🛸
                </motion.div>
              </div>
            );
          } else if (isWheel) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-24 h-24';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-24 h-24 flex items-center justify-center overflow-visible">
                <motion.div 
                  className="text-5xl filter drop-shadow-[0_4px_12px_rgba(168,85,247,0.5)] select-none"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                >
                  🎡
                </motion.div>
              </div>
            );
          }"""

new_ufo_wheel = """          } else if (isUfo) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-24 h-24';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-24 h-24 flex items-center justify-center overflow-visible">
                <div className="absolute w-12 h-12 rounded-full border-4 border-dashed border-cyan-500/30"></div>
                <div className="absolute w-full h-full pointer-events-none">
                  <span className="animate-orbit-ufo text-5xl filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)] select-none">🛸</span>
                </div>
              </div>
            );
          }"""

content = content.replace(old_race, new_race)
content = content.replace(old_ufo_wheel, new_ufo_wheel)

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)
