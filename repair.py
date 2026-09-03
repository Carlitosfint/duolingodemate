with open('src/App.tsx', 'r') as f:
    content = f.read()

# find where it went wrong
start_broken = content.find("const CIRCLE_COLORS = ['#FFD700', '#FF8C00', 'export const PageReveal")
end_broken = content.find("});", start_broken) + 3

# the original text we wanted to inject + the missing parts of CIRCLE_COLORS
fixed_part = "const CIRCLE_COLORS = ['#FFD700', '#FF8C00', '#DC143C', '#8B008B', '#000080'];\n\n" + """export const PageReveal = React.forwardRef<HTMLDivElement, { children: React.ReactNode, className?: string, isFullScreen?: boolean }>(({ children, className, isFullScreen = false }, ref) => {
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

content = content[:start_broken] + fixed_part + content[end_broken:]

with open('src/App.tsx', 'w') as f:
    f.write(content)
