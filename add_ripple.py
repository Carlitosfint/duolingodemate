import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

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

content = content.replace("export default function App() {", ripple_code + "\nexport default function App() {")

with open('src/App.tsx', 'w') as f:
    f.write(content)

