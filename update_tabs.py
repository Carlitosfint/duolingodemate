import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make sure playTransitionSound and playRevealSound are imported
if "playTransitionSound" not in content:
    content = content.replace(
        "import { playClickSound",
        "import { playClickSound, playTransitionSound, playRevealSound"
    )

new_tab_transition = """const TabTransition: React.FC<{ children: React.ReactNode, type?: string, zIndexOffset?: number }> = ({ children, zIndexOffset = 0 }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [phase, setPhase] = React.useState(0);
  
  React.useEffect(() => {
    if (!isPresent) {
       playTransitionSound();
       const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 800);
       return () => clearTimeout(timer);
    } else {
       playRevealSound();
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
           return (
              <motion.div
                key={`swipe-${color}`}
                initial={{ x: isPresent ? '0%' : '100%' }}
                animate={{ x: isPresent ? '-100%' : '0%' }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: isPresent ? i * 0.05 : (4 - i) * 0.05 }}
                style={{ position: 'absolute', inset: 0, backgroundColor: color, zIndex: 25 - i }}
              />
           );
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
};"""

start = content.find("const TabTransition")
# End is the closing `};` of TabTransition
end = content.find("};", content.find("</motion.div>", start)) + 2

content = content[:start] + new_tab_transition + content[end:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

