import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

start_marker = "let bgClass = 'bg-white border-slate-200';"
end_marker = "return ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_logic = """let bgClass = 'bg-white border-slate-200';
          let innerContent = null;
          let nodeSize = 'w-16 h-16';
          let wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px] ${isCurrent ? 'animate-bounce' : ''}`;
          
          if (isPast) {
            bgClass = 'bg-white border-green-500 ring-4 ring-green-100 text-green-500';
            innerContent = <Icon name="star" className="text-green-500" size={28} />;
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px]`;
          } else if (isCurrent) {
            bgClass = 'bg-orange-500 border-orange-600 ring-4 ring-orange-200 text-white';
            innerContent = <Icon name="fire" className="text-white" size={36} />;
            nodeSize = 'w-20 h-20';
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px] ${isCurrent ? 'animate-bounce' : ''}`;
          } else if (isFuture) {
            bgClass = 'bg-slate-200 border-slate-300 text-slate-400';
            innerContent = <Icon name="lock" className="text-slate-400" size={28} />;
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px]`;
          }

          if (isChest) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-20 h-20';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            const chestIcon = isPast ? "unlock" : "box";
            
            innerContent = (
              <motion.div
                className={`filter drop-shadow-md select-none ${isPast ? 'text-amber-500' : 'text-amber-600'}`}
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
              >
                <Icon name={chestIcon} size={40} />
              </motion.div>
            );
          } else if (isRace) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-32 h-32';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-32 h-32 flex items-center justify-center overflow-visible">
                <div className="absolute w-24 h-24 rounded-full border-4 border-dashed border-emerald-500/30 bg-emerald-50"></div>
                <div className="text-emerald-600 absolute bg-white/90 p-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-20">
                  <Icon name="flag" size={16} />
                </div>
                
                <div className="absolute w-full h-full pointer-events-none text-emerald-600">
                  <span className="animate-orbit-1 absolute filter drop-shadow-sm"><Icon name="dog" size={28} /></span>
                  <span className="animate-orbit-2 absolute filter drop-shadow-sm text-purple-600"><Icon name="cat" size={28} /></span>
                  <span className="animate-orbit-3 absolute filter drop-shadow-sm text-orange-500"><Icon name="fox" size={28} /></span>
                  <span className="animate-orbit-4 absolute filter drop-shadow-sm text-blue-500"><Icon name="owl" size={28} /></span>
                </div>
              </div>
            );
          } else if (isUfo) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-24 h-24';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-24 h-24 flex items-center justify-center overflow-visible">
                <div className="absolute w-12 h-12 rounded-full border-4 border-dashed border-cyan-500/30 bg-cyan-50"></div>
                <div className="absolute w-full h-full pointer-events-none flex items-center justify-center text-cyan-500">
                  <span className="animate-orbit-ufo filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)] select-none">
                    <Icon name="ufo" size={48} />
                  </span>
                </div>
              </div>
            );
          }

          """

content = content[:start_idx] + new_logic + content[end_idx:]

import_marker = "import { motion } from 'motion/react';"
content = content.replace(import_marker, import_marker + "\nimport { Icon } from './CustomIcons';")

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)

print("Done")
