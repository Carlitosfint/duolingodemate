import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update PageReveal
new_page_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean }> = ({ children, className, isFullScreen = false }) => {
  const [showCircles, setShowCircles] = React.useState(true);
  const [animationDone, setAnimationDone] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowCircles(false);
      setAnimationDone(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col ${animationDone ? '' : 'overflow-hidden pointer-events-none'}`}>
      {showCircles && CIRCLE_COLORS.map((color, i) => (
        <motion.div
          key={color}
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(200% at 50% 50%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10 + i,
            backgroundColor: color,
          }}
        />
      ))}
      <motion.div
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(200% at 50% 50%)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: CIRCLE_COLORS.length * 0.15 }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          pointerEvents: animationDone ? 'auto' : 'none',
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          clipPath: animationDone ? 'none' : undefined,
        }}
      >
        <div className={className} style={{ flex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};"""

start_idx = content.find("export const PageReveal: React.FC")
end_idx = content.find("};", start_idx)
if "};" in content[start_idx:start_idx+3000]:
    end_idx += 2
content = content[:start_idx] + new_page_reveal + content[end_idx:]

# 2. Fix main-app exit transition so it doesn't fade, just stays
content = content.replace('exit={{ opacity: 0.99, transition: { duration: 1.5 } }}', 'exit={{ opacity: 1, transition: { duration: 2 } }}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
