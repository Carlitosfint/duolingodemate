import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find("export const PageReveal")
end = content.find("export default function App", start)

new_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {
  const [clickPos] = React.useState(globalLastClick);
  const [isPresent, safeToRemove] = usePresence();
  const [phase, setPhase] = React.useState(0);
  
  // Motion values
  const holeRadius = useMotionValue(0);
  const pageRadius = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, transparent ${holeRadius}px, black ${holeRadius}px)`;

  const [mountId] = React.useState(() => Math.random().toString(36).substring(7));
  const maxRadiusStr = "250vmax"; // Large enough to cover screen

  React.useEffect(() => {
    if (!isPresent) {
       // Exiting component: wait until entering animation completes
       const timer = setTimeout(() => {
         safeToRemove && safeToRemove();
       }, 2000);
       return () => clearTimeout(timer);
    }
    
    // Entering component animation sequence:
    
    // Phase 1: Lens opens showing old page
    const t1 = setTimeout(() => {
      animate(holeRadius, 50, { duration: 0.3, ease: "easeInOut" }); // 50px = ~12vmin
    }, 400);
    
    // Phase 2: Lens closes
    const t2 = setTimeout(() => {
      animate(holeRadius, 0, { duration: 0.3, ease: "easeInOut" });
    }, 800); 
    
    // Phase 3: Lens opens showing NEW page
    const t3 = setTimeout(() => {
      animate(holeRadius, 50, { duration: 0.3, ease: "easeInOut" });
      animate(pageRadius, 50, { duration: 0.3, ease: "easeInOut" });
    }, 1200); 

    // Phase 4: Expand to full screen
    const t4 = setTimeout(() => {
      setPhase(4); // Trigger CSS clip-path expansion for circles
      const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.5;
      animate(holeRadius, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
      animate(pageRadius, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
    }, 1600); 

    // Phase 5: Clean up, make interactive
    const t5 = setTimeout(() => {
      setPhase(5);
    }, 2200);
         
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [isPresent, safeToRemove, holeRadius, pageRadius]);

  const currentZ = !isPresent ? 0 : (phase >= 5 ? 10 : 9999);
  const isExpandingFinal = phase >= 4;
  
  // pageClip is applied to the new page content
  const pageClip = useMotionTemplate`circle(${pageRadius}px at ${clickPos.x}px ${clickPos.y}px)`;

  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase >= 5 ? '' : 'overflow-hidden pointer-events-none'}`}
      style={{ zIndex: currentZ }}
      exit={{ opacity: 1, transition: { duration: 2.2 } }}
    >
      {/* 5 Circles with Hole Mask */}
      {phase < 5 && isPresent && (
        <motion.div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 10, 
            pointerEvents: 'none',
            WebkitMaskImage: maskImage,
            maskImage: maskImage
          }}
        >
          {CIRCLE_COLORS.map((color, i) => {
            return (
              <motion.div
                key={`${mountId}-${color}`}
                initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
                animate={{ 
                   clipPath: isExpandingFinal 
                     ? `circle(${maxRadiusStr} at ${clickPos.x}px ${clickPos.y}px)` 
                     : `circle(${35 - i * 5}vmin at ${clickPos.x}px ${clickPos.y}px)`
                }}
                transition={{ 
                   duration: isExpandingFinal ? 0.6 : 0.4, 
                   ease: isExpandingFinal ? [0.64, 0, 0.78, 0] : [0.34, 1.56, 0.64, 1],
                   delay: isExpandingFinal ? 0 : i * 0.04 
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
        </motion.div>
      )}
      
      {/* The New Page Content */}
      <motion.div
        className={`absolute inset-0 flex flex-col ${bgClass}`}
        style={{
          zIndex: 20,
          pointerEvents: phase >= 5 ? 'auto' : 'none',
          clipPath: phase >= 5 ? 'none' : (isPresent ? pageClip : 'none'),
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}><FloatingMathBackground /></div>
        <div className={className} style={{ flex: 1, width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
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

