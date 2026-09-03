import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Add missing imports
if "useMotionValue" not in content:
    content = content.replace("import { motion, AnimatePresence, usePresence }", "import { motion, AnimatePresence, usePresence, useMotionValue, useMotionTemplate, animate }")

# 2. Add GlobalRipple before App component
ripple_code = """
const GlobalRipple = () => {
  const [ripples, setRipples] = React.useState<{id: number, x: number, y: number}[]>([]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button')) {
        const id = Date.now();
        setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 800);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {ripples.map(r => (
        <div key={r.id} style={{ position: 'fixed', left: r.x, top: r.y, pointerEvents: 'none', zIndex: 99999 }}>
          {CIRCLE_COLORS.map((color, i) => (
            <motion.div
              key={color}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ 
                width: [0, 40 + i * 20, 0], 
                height: [0, 40 + i * 20, 0],
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 0.6, 
                ease: "easeInOut",
                delay: i * 0.05 
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                border: `3px solid ${color}`,
                backgroundColor: 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
};
"""
if "GlobalRipple" not in content:
    content = content.replace("export default function App", ripple_code + "\nexport default function App")

# 3. Add GlobalRipple to App
if "<GlobalRipple />" not in content:
    content = content.replace("<FloatingMathBackground />", "<FloatingMathBackground />\n      <GlobalRipple />")

# 4. Replace PageReveal
start = content.find("export const PageReveal")
end = content.find("export default function App", start)

new_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {
  const [phase, setPhase] = React.useState(0);
  const [clickPos] = React.useState(globalLastClick);
  const [isPresent, safeToRemove] = usePresence();
  
  // Mask animation
  const holeRadius = useMotionValue(0);
  const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, transparent ${holeRadius}px, black ${holeRadius}px)`;

  const [mountId] = React.useState(() => Math.random().toString(36).substring(7));

  React.useEffect(() => {
    if (!isPresent) {
       const timer = setTimeout(() => {
         safeToRemove && safeToRemove();
       }, 3000);
       return () => clearTimeout(timer);
    }
    
    // 0: Circles expand
    const t1 = setTimeout(() => {
      setPhase(1); // Open lens
      const maxHoleRadius = Math.min(window.innerWidth, window.innerHeight) * 0.12;
      animate(holeRadius, maxHoleRadius, { duration: 0.4, ease: "easeInOut" });
    }, 600);
    
    const t2 = setTimeout(() => {
      setPhase(2); // Close lens
      animate(holeRadius, 0, { duration: 0.4, ease: "easeInOut" });
    }, 1400); 
    
    const t3 = setTimeout(() => {
      setPhase(3); // Expand circles and new page
    }, 2000); 

    const t4 = setTimeout(() => {
      setPhase(4); // Remove clip path
    }, 3200); 
         
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isPresent, safeToRemove, holeRadius]);

  const currentZ = !isPresent ? 0 : (phase >= 4 ? 10 : 9999);
  const isExpandingFinal = phase >= 3;
  
  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase >= 4 ? '' : 'overflow-hidden pointer-events-none'}`}
      style={{ zIndex: currentZ }}
      exit={{ opacity: 1, transition: { duration: 3.5 } }}
    >
      {/* 5 Circles with Hole Mask */}
      {phase < 4 && (
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
        </motion.div>
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

