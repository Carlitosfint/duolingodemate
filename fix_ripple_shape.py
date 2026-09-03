import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace GlobalRipple
start_ripple = content.find("const GlobalRipple = () => {")
end_ripple = content.find("export default function App", start_ripple)

new_ripple = """const GlobalRipple = () => {
  const [ripples, setRipples] = React.useState<{id: number, rect: DOMRect, borderRadius: string}[]>([]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (button && !button.closest('.nav-sidebar') && !button.closest('.no-ripple')) {
        const rect = button.getBoundingClientRect();
        const style = window.getComputedStyle(button);
        const id = Date.now();
        setRipples(prev => [...prev, { id, rect, borderRadius: style.borderRadius }]);
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
        <div key={r.id} style={{ position: 'fixed', left: r.rect.left, top: r.rect.top, width: r.rect.width, height: r.rect.height, pointerEvents: 'none', zIndex: 99999 }}>
          {CIRCLE_COLORS.map((color, i) => (
            <motion.div
              key={color}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                scale: [1, 1 + (i + 1) * 0.1, 1],
                opacity: [0.8, 0.8, 0]
              }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                delay: i * 0.04 
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: r.borderRadius,
                backgroundColor: color,
                mixBlendMode: 'multiply',
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
};
"""

content = content[:start_ripple] + new_ripple + content[end_ripple:]

# Add nav-sidebar class to the left navigation sidebar
content = content.replace(
    'className={`hidden lg:flex landscape:flex flex-col w-64',
    'className={`nav-sidebar hidden lg:flex landscape:flex flex-col w-64'
)

# And the mobile bottom navigation
content = content.replace(
    'className="lg:hidden landscape:hidden fixed bottom-0',
    'className="nav-sidebar lg:hidden landscape:hidden fixed bottom-0'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

