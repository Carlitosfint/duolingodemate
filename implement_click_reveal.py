import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update PageReveal
new_page_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean }> = ({ children, className, isFullScreen = false }) => {
  const [phase, setPhase] = React.useState(0);
  const [clickPos] = React.useState(globalLastClick);

  React.useEffect(() => {
    // 0 -> 1: Wait 3.5 seconds at the logo state, then start expanding
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 3500);
    
    // 1 -> 2: Reveal content
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 3500 + 1200); // 1.2s for the expansion wave to mostly cover
    
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const radii = [30, 24, 18, 12, 6]; // vmin

  return (
    <motion.div 
      className={`fixed inset-0 z-[100] flex flex-col ${phase === 2 ? '' : 'overflow-hidden pointer-events-none'}`}
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
                : `circle(${radii[i]}vmin at ${clickPos.x}px ${clickPos.y}px)`
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

# 2. Update main-app to use PageReveal
content = content.replace(
    '<motion.div key="main-app" exit={{ opacity: 1, transition: { duration: 2 } }} className="max-w-[1600px]',
    '<PageReveal key="main-app" className="max-w-[1600px]'
)

# And replace its closing tag:
content = content.replace(
    '</main>\n      </motion.div>',
    '</main>\n      </PageReveal>'
)

# There is a possibility that it was `</motion.div>\n      ) : (`
content = content.replace(
    '</motion.div>\n      ) : (',
    '</PageReveal>\n      ) : ('
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
