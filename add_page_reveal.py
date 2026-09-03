import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

page_reveal_code = """
const CIRCLE_COLORS = ['#FFD700', '#FF8C00', '#DC143C', '#8B008B', '#000080'];

export const PageReveal = ({ children, className, isFullScreen = false }: { children: React.ReactNode, className?: string, isFullScreen?: boolean }) => {
  const [showCircles, setShowCircles] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCircles(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
       exit={{ opacity: 0, transition: { duration: 0.2 } }}
       className={className}
    >
      {showCircles && CIRCLE_COLORS.map((color, i) => (
        <motion.div
          key={color}
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
          style={{
            position: isFullScreen ? 'fixed' : 'absolute',
            inset: 0,
            zIndex: 50 + i,
            backgroundColor: color,
            pointerEvents: 'none'
          }}
        />
      ))}
      <motion.div
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(150% at 50% 50%)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 60 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
"""

content = content.replace("import { ConfettiOverlay } from './components/ConfettiOverlay';", "import { ConfettiOverlay } from './components/ConfettiOverlay';\n" + page_reveal_code)

with open('src/App.tsx', 'w') as f:
    f.write(content)
