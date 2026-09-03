import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find("export const PageReveal")
end = content.find("export default function App", start)

new_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {
  const [phase, setPhase] = React.useState(0);
  const [clickPos] = React.useState(globalLastClick);
  const [isPresent, safeToRemove] = usePresence();
  
  // Stable ID for this mount
  const [mountId] = React.useState(() => Math.random().toString(36).substring(7));

  React.useEffect(() => {
    if (!isPresent) {
       // When exiting, wait 3 seconds for the entering component to finish its animation, then remove
       const timer = setTimeout(() => {
         safeToRemove && safeToRemove();
       }, 3000);
       return () => clearTimeout(timer);
    }
    
    // 0: Initial mount, circles expand to concentric sizes.
    const t1 = setTimeout(() => {
      setPhase(1); // Open lens (hole puncher)
    }, 600);
    
    const t2 = setTimeout(() => {
      setPhase(2); // Close lens
    }, 1400); 
    
    const t3 = setTimeout(() => {
      setPhase(3); // Expand circles and new page to cover screen
    }, 2000); 

    const t4 = setTimeout(() => {
      setPhase(4); // Remove clip path, make interactive
    }, 3200); 
         
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isPresent, safeToRemove]);

  const currentZ = !isPresent ? 0 : (phase >= 4 ? 10 : 9999);
  const isExpandingFinal = phase >= 3;
  
  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase >= 4 ? '' : 'overflow-hidden pointer-events-none'}`}
      style={{ zIndex: currentZ }}
      exit={{ opacity: 1, transition: { duration: 3 } }}
    >
      {/* 5 Circles and Hole Puncher */}
      {phase < 4 && (
        <div style={{ position: 'absolute', inset: 0, isolation: 'isolate', zIndex: 10, pointerEvents: 'none' }}>
          {CIRCLE_COLORS.map((color, i) => {
            return (
              <motion.div
                key={`${mountId}-${color}`}
                initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
                animate={{ 
                   clipPath: isExpandingFinal 
                     ? `circle(250% at ${clickPos.x}px ${clickPos.y}px)` 
                     : `circle(${35 - i * 5}vmin at ${clickPos.x}px ${clickPos.y}px)`
                }}
                transition={{ 
                   duration: isExpandingFinal ? 0.8 : 0.5, 
                   ease: isExpandingFinal ? [0.64, 0, 0.78, 0] : [0.34, 1.56, 0.64, 1],
                   delay: isExpandingFinal ? i * 0.05 : i * 0.05 
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
            initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
            animate={{ 
               clipPath: phase === 1 
                 ? `circle(12vmin at ${clickPos.x}px ${clickPos.y}px)` 
                 : `circle(0px at ${clickPos.x}px ${clickPos.y}px)`
            }}
            transition={{ 
               duration: 0.4, 
               ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 30,
              backgroundColor: 'black',
              mixBlendMode: 'destination-out',
            }}
          />
        </div>
      )}
      
      {/* The New Page Content */}
      <motion.div
        className={`absolute inset-0 flex flex-col ${bgClass}`}
        initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
        animate={{ 
           clipPath: phase >= 3 
             ? `circle(250% at ${clickPos.x}px ${clickPos.y}px)` 
             : `circle(0px at ${clickPos.x}px ${clickPos.y}px)`
        }}
        transition={{ 
           duration: 0.8,
           ease: [0.64, 0, 0.78, 0],
           delay: phase >= 3 ? (CIRCLE_COLORS.length * 0.05) + 0.15 : 0 
         }}
        style={{
          zIndex: 20,
          pointerEvents: phase >= 4 ? 'auto' : 'none',
          clipPath: phase >= 4 ? 'none' : undefined,
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

