import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

transitions_code = """
const TabTransition: React.FC<{ children: React.ReactNode, type: 'swipe' | 'blocks' | 'diagonal', zIndexOffset?: number }> = ({ children, type, zIndexOffset = 0 }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [phase, setPhase] = React.useState(0);
  
  React.useEffect(() => {
    if (!isPresent) {
       const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 800);
       return () => clearTimeout(timer);
    } else {
       const timer = setTimeout(() => { setPhase(1); }, 800);
       return () => clearTimeout(timer);
    }
  }, [isPresent, safeToRemove]);

  // isPresent false -> exiting (cover the screen)
  // isPresent true -> entering (uncover the screen)

  return (
    <motion.div className="absolute inset-0 flex flex-col" style={{ zIndex: 10 + zIndexOffset }}>
       {/* Transition layers */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 20 }}>
         {CIRCLE_COLORS.map((color, i) => {
           if (type === 'swipe') {
             return (
                <motion.div
                  key={`swipe-${color}`}
                  initial={{ x: isPresent ? '0%' : '-100%' }}
                  animate={{ x: isPresent ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.05 }}
                  style={{ position: 'absolute', inset: 0, backgroundColor: color, zIndex: 25 - i }}
                />
             );
           }
           if (type === 'blocks') {
             return (
                <motion.div
                  key={`blocks-${color}`}
                  initial={{ y: isPresent ? '0%' : '-100%' }}
                  animate={{ y: isPresent ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.05 }}
                  style={{ position: 'absolute', left: `${i * 20}%`, width: '20.5%', top: 0, bottom: 0, backgroundColor: color, zIndex: 25 }}
                />
             );
           }
           if (type === 'diagonal') {
             return (
                <motion.div
                  key={`diag-${color}`}
                  initial={{ x: isPresent ? '0%' : '-150%', y: isPresent ? '0%' : '-150%' }}
                  animate={{ x: isPresent ? '150%' : '0%', y: isPresent ? '150%' : '0%' }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: i * 0.05 }}
                  style={{ position: 'absolute', inset: -500, backgroundColor: color, zIndex: 25 - i, transform: 'rotate(45deg)' }}
                />
             );
           }
         })}
       </div>

       {/* Content */}
       <motion.div 
         className="flex-1 w-full h-full relative"
         style={{ zIndex: 10 }}
         initial={{ opacity: 0 }}
         animate={{ opacity: isPresent && phase === 1 ? 1 : 0 }}
         transition={{ duration: 0.2 }}
       >
         {children}
       </motion.div>
    </motion.div>
  );
};
"""

# Insert TabTransition right before PageReveal
content = content.replace("export const PageReveal", transitions_code + "\nexport const PageReveal")

# Add mode="wait" to AnimatePresence for tabs
content = content.replace("<AnimatePresence>\n              {viewMode === 'map'", "<AnimatePresence mode=\"wait\">\n              {viewMode === 'map'")

# Replace tab conditions with wrapped ones
tabs = [
  ("viewMode === 'map'", "map", "swipe"),
  ("viewMode === 'codice'", "codice", "blocks"),
  ("viewMode === 'mistakes'", "mistakes", "diagonal"),
  ("viewMode === 'album'", "album", "swipe"),
  ("viewMode === 'shop'", "shop", "blocks"),
  ("viewMode === 'profile'", "profile", "diagonal"),
  ("viewMode === 'teacher'", "teacher", "swipe"),
]

for cond, key, ttype in tabs:
    # We need to wrap `<div key="map" className="flex-1 flex flex-col h-full relative z-10">`
    # and its matching closing `</div>` inside `<TabTransition type="...">`
    # But this requires parsing JSX. Since we know the file structure:
    # They are structured like:
    # {viewMode === 'map' && (
    #   <div key="map" className="flex-1 flex flex-col h-full relative z-10">
    #      ...
    #   </div>
    # )}
    pass

with open('src/App.tsx', 'w') as f:
    f.write(content)

