import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

new_page_reveal = """export const PageReveal = React.forwardRef<HTMLDivElement, { children: React.ReactNode, className?: string, isFullScreen?: boolean }>(({ children, className, isFullScreen = false }, ref) => {
  const [showCircles, setShowCircles] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowCircles(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {showCircles && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {CIRCLE_COLORS.map((color, i) => (
            <motion.div
              key={color}
              initial={{ clipPath: "circle(0% at 50% 50%)" }}
              animate={{ clipPath: "circle(150% at 50% 50%)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: color,
              }}
            />
          ))}
        </div>,
        document.body
      )}
      {children}
    </motion.div>
  );
});"""

start_idx = content.find("export const PageReveal: React.FC")
if start_idx == -1:
    start_idx = content.find("export const PageReveal =")

end_idx = content.find("};", start_idx) + 2
if "});" in content[start_idx:start_idx+3000]:
    end_idx = content.find("});", start_idx) + 3

# Need to import ReactDOM if not imported
if "import ReactDOM" not in content:
    content = content.replace("import React, {", "import ReactDOM from 'react-dom';\nimport React, {")

content = content[:start_idx] + new_page_reveal + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
