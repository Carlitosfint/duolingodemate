import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_tab_transition = """const TabTransition: React.FC<{ children: React.ReactNode, type?: string, zIndexOffset?: number }> = ({ children, zIndexOffset = 0 }) => {
  const [isPresent, safeToRemove] = usePresence();
  
  React.useEffect(() => {
    if (!isPresent) {
       playTransitionSound();
       const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 700);
       return () => clearTimeout(timer);
    } else {
       playRevealSound();
    }
  }, [isPresent, safeToRemove]);

  // isPresent false -> exiting (cover the screen)
  // isPresent true -> entering (uncover the screen)

  return (
    <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10 + zIndexOffset }}>
       {/* Transition layers */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden flex" style={{ zIndex: 20 }}>
         {CIRCLE_COLORS.map((color, i) => {
           return (
              <motion.div
                key={`blocks-${color}`}
                initial={{ y: isPresent ? '0%' : '100%' }}
                animate={{ y: isPresent ? '-100%' : '0%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                style={{ flex: 1, height: '100%', backgroundColor: color, zIndex: 25 }}
              />
           );
         })}
       </div>

       {/* Content */}
       <div 
         className="flex-1 w-full h-full relative"
         style={{ zIndex: 10 }}
       >
         {children}
       </div>
    </div>
  );
};"""

start = content.find("const TabTransition")
# End is the closing `};` of TabTransition
end = content.find("};", content.find("</motion.div>", start)) + 2
if end < start:
    # Just a fallback in case </motion.div> was changed
    end = content.find("};", content.find("</div", start)) + 2

content = content[:start] + new_tab_transition + content[end:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

