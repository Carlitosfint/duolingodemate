import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "const TabTransition: React.FC"
end_marker = "export default function App() {"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_content = """const TabTransition: React.FC<{ children: React.ReactNode, type?: string, zIndexOffset?: number }> = ({ children, zIndexOffset = 0 }) => {
  const [isPresent, safeToRemove] = usePresence();
  
  React.useEffect(() => {
    if (!isPresent) { 
       playTransitionSound();
       const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 1000); 
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
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: isPresent ? i * 0.08 : (4 - i) * 0.08 }}
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
};

export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [phase, setPhase] = React.useState(0);
  
  // Store click coordinates relative to viewport
  const [clickPos] = React.useState(() => ({ x: globalLastClick.x, y: globalLastClick.y }));

  // Motion values
  const holeRadius = useMotionValue(0);
  const pageRadius = useMotionValue(0);
  
  const r0 = useMotionValue(0);
  const r1 = useMotionValue(0);
  const r2 = useMotionValue(0);
  const r3 = useMotionValue(0);
  const r4 = useMotionValue(0);
  const circleRadii = [r0, r1, r2, r3, r4];
  
  const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, transparent ${holeRadius}px, black calc(${holeRadius}px + 1px))`;

  const clip0 = useMotionTemplate`circle(${r0}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip1 = useMotionTemplate`circle(${r1}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip2 = useMotionTemplate`circle(${r2}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip3 = useMotionTemplate`circle(${r3}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip4 = useMotionTemplate`circle(${r4}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clips = [clip0, clip1, clip2, clip3, clip4];

  const [mountId] = React.useState(() => Math.random().toString(36).substring(7));

  const [radii] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const vmax = Math.max(window.innerWidth, window.innerHeight);
      return { base: vmin * 0.35, step: vmin * 0.05, max: vmax * 2.5 };
    }
    return { base: 350, step: 50, max: 2500 };
  });

  React.useEffect(() => {
    if (!isPresent) { 
       // Exiting component: wait until entering animation completes
       const timer = setTimeout(() => { 
         safeToRemove && safeToRemove(); 
       }, 3500); 
       return () => clearTimeout(timer);
    }
    
    // Entering component animation sequence:
    
    // Phase 1: Lens opens showing old page. Starts immediately alongside the circles.
    playTransitionSound();
    circleRadii.forEach((r, i) => {
      animate(r, radii.base - i * radii.step, { 
         duration: 0.4, 
         delay: i * 0.05, 
         ease: [0.34, 1.56, 0.64, 1] 
       });
    });
    animate(holeRadius, 50, { duration: 0.4, ease: "easeInOut" }); // 50px = ~12vmin
    
    // Phase 2: Lens closes (+1.5s delay means it closes at 1900ms)
    const t2 = setTimeout(() => {
      animate(holeRadius, 0, { duration: 0.3, ease: "easeInOut" });
    }, 1900); 
    
    // Phase 3: Lens opens showing NEW page
    const t3 = setTimeout(() => {
      playRevealSound();
      animate(holeRadius, 50, { duration: 0.3, ease: "easeInOut" });
      animate(pageRadius, 50, { duration: 0.3, ease: "easeInOut" });
    }, 2200); 
    
    // Phase 4: Expand to full screen
    const t4 = setTimeout(() => {
      setPhase(4);
      const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.5;
      
      circleRadii.forEach((r) => {
        animate(r, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
      });
      animate(holeRadius, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
      animate(pageRadius, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
    }, 2600); 

    // Phase 5: Clean up, make interactive
    const t5 = setTimeout(() => {
      setPhase(5);
    }, 3200); 
        
    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [isPresent, safeToRemove, holeRadius, pageRadius, radii, ...circleRadii]);

  const currentZ = !isPresent ? 0 : (phase >= 5 ? 10 : 9999);
  
  // pageClip is applied to the new page content
  const pageClip = useMotionTemplate`circle(${pageRadius}px at ${clickPos.x}px ${clickPos.y}px)`;

  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase >= 5 ? '' : 'overflow-hidden pointer-events-none'}`}
      style={{ zIndex: currentZ }}
      exit={{ opacity: 1, transition: { duration: 3.5 } }}
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
            maskImage: maskImage,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%'
          }}
        >
          {CIRCLE_COLORS.map((color, i) => {
            return (
              <motion.div
                key={`${mountId}-${color}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10 + i,
                  backgroundColor: color,
                  clipPath: clips[i],
                  WebkitClipPath: clips[i]
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
          WebkitClipPath: phase >= 5 ? 'none' : (isPresent ? pageClip : 'none'),
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}><FloatingMathBackground /></div>
        <div className={className} style={{ flex: 1, width: '100%', position: 'relative', zIndex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

"""

content = content[:start_idx] + new_content + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done")
