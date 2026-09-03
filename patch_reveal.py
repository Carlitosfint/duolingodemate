import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace AnimatePresence
content = content.replace("<AnimatePresence>", '<AnimatePresence mode="wait">', 1)

# Replace PageReveal
start = content.find("export const PageReveal")
end = content.find("export default function App", start)

new_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {
  const [phase, setPhase] = React.useState(0);
  const [clickPos] = React.useState(globalLastClick);
  const [isPresent] = usePresence();
  
  // Stable ID for this mount
  const [mountId] = React.useState(() => Math.random().toString(36).substring(7));

  React.useEffect(() => {
    if (!isPresent) return;
    
    // 0: animation starts instantly.
    // Wait 3 seconds, then close the lens
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 3000);
    
    // 1 -> 2: instantly reopen (after it closed).
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 3300);
    
    // 2 -> 3: animation ends, remove pointer-events-none
    const t3 = setTimeout(() => {
      setPhase(3);
    }, 4100);
         
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isPresent]);

  const currentZ = !isPresent ? 0 : (phase >= 3 ? 10 : 9999);
  
  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase >= 3 ? '' : 'overflow-hidden pointer-events-none'}`}
      style={{ zIndex: currentZ }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {phase < 3 && CIRCLE_COLORS.map((color, i) => {
        const isExpanding = phase >= 2;
        return (
          <motion.div
            key={`${mountId}-${color}`}
            initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
            animate={{ 
               clipPath: isExpanding 
                 ? `circle(250% at ${clickPos.x}px ${clickPos.y}px)` 
                 : `circle(${35 - i * 2.5}vmin at ${clickPos.x}px ${clickPos.y}px)`
            }}
            transition={{ 
               duration: isExpanding ? 0.8 : 0.6, 
               ease: isExpanding ? [0.64, 0, 0.78, 0] : [0.22, 1, 0.36, 1],
               delay: isExpanding ? i * 0.05 : i * 0.1 
            }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10 + i,
              backgroundColor: color,
            }}
          />
        );
      })}
      
      <motion.div
        className={`absolute inset-0 flex flex-col ${bgClass}`}
        initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
        animate={{ 
           clipPath: phase === 0 ? `circle(22.5vmin at ${clickPos.x}px ${clickPos.y}px)`
             : phase === 1 ? `circle(0px at ${clickPos.x}px ${clickPos.y}px)`
             : `circle(250% at ${clickPos.x}px ${clickPos.y}px)`
        }}
        transition={{ 
           duration: phase === 0 ? 0.6 : phase === 1 ? 0.3 : 0.8,
           ease: [0.64, 0, 0.78, 0],
           delay: phase === 0 ? 0.5 : phase === 1 ? 0 : 0.25 
         }}
        style={{
          zIndex: 20,
          pointerEvents: phase >= 3 ? 'auto' : 'none',
          clipPath: phase >= 3 ? 'none' : undefined,
        }}
      >
        <div className={className} style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
"""

content = content[:start] + new_reveal + content[end:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

