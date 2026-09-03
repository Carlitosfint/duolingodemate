import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add usePresence import if not there
if "usePresence" not in content:
    content = content.replace("import { motion, AnimatePresence }", "import { motion, AnimatePresence, usePresence }")

new_page_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean }> = ({ children, className, isFullScreen = false }) => {
  const [phase, setPhase] = React.useState(0);
  const [clickPos] = React.useState(globalLastClick);
  const [isPresent] = usePresence(); // true if entering/present, false if exiting

  React.useEffect(() => {
    // Only run the intro animation if it's the first mount and present
    // If it's exiting, we don't do anything, just wait to be unmounted
    if (!isPresent) return;

    // 0 -> 1: Wait 3.5 seconds at the logo state, then start expanding
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 3500);
    
    // 1 -> 2: Reveal content
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 3500 + 1200); 
    
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isPresent]);

  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase === 2 ? '' : 'overflow-hidden pointer-events-none'}`}
      // If exiting, lower z-index so the incoming one is on top
      style={{ zIndex: isPresent ? 100 : 50 }}
      exit={{ opacity: 1, transition: { duration: 6 } }}
    >
      {phase < 2 && CIRCLE_COLORS.map((color, i) => {
        const isExpanding = phase >= 1;
        return (
          <motion.div
            key={color}
            initial={{ clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)` }}
            animate={{ 
              clipPath: isExpanding 
                ? `circle(250% at ${clickPos.x}px ${clickPos.y}px)` 
                : `circle(${30 - i * 6}vmin at ${clickPos.x}px ${clickPos.y}px)`
            }}
            transition={{ 
              duration: isExpanding ? 0.8 : 0.6, 
              ease: isExpanding ? [0.64, 0, 0.78, 0] : [0.22, 1, 0.36, 1],
              delay: isExpanding ? i * 0.1 : i * 0.1 
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
          clipPath: phase >= 1 
            ? `circle(250% at ${clickPos.x}px ${clickPos.y}px)` 
            : `circle(0px at ${clickPos.x}px ${clickPos.y}px)`
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.64, 0, 0.78, 0], 
          delay: phase >= 1 ? CIRCLE_COLORS.length * 0.1 : 0 
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: phase === 2 ? 'auto' : 'none',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          clipPath: phase === 2 ? 'none' : undefined,
        }}
      >
        <div className={className} style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};"""

start_idx = content.find("export const PageReveal: React.FC")
end_idx = content.find("};", start_idx)
if "};" in content[start_idx:start_idx+3000]:
    end_idx += 2
content = content[:start_idx] + new_page_reveal + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
