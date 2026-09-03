import re

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

def replace_line(num, search, replace):
    if search in lines[num - 1]:
        lines[num - 1] = lines[num - 1].replace(search, replace)
    else:
        print(f"Warning: could not find '{search}' on line {num}")

# Since the line numbers might have changed a bit, let's just iterate through and replace.
# If a line has '<PageReveal key="map"', we remember it, and we replace its closing tag.
# Since it's a bit nested, let's just read the file into a single string and do regex block replacements.

content = "".join(lines)

# 1. Update PageReveal Component
new_page_reveal = """export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean }> = ({ children, className, isFullScreen = false }) => {
  const [showCircles, setShowCircles] = React.useState(true);
  const [animationDone, setAnimationDone] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowCircles(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
       className={`fixed inset-0 z-[100] flex flex-col ${animationDone ? '' : 'overflow-hidden pointer-events-none'}`}
       initial={{ opacity: 1 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {showCircles && CIRCLE_COLORS.map((color, i) => (
        <motion.div
          key={color}
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
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
        animate={animationDone ? { clipPath: "none" } : { clipPath: "circle(150% at 50% 50%)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: CIRCLE_COLORS.length * 0.1 }}
        onAnimationComplete={() => setAnimationDone(true)}
        className={className}
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 20,
          pointerEvents: animationDone ? 'auto' : 'none',
          backgroundColor: '#f8fafc'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};"""

start_idx = content.find("export const PageReveal = React.forwardRef")
if start_idx == -1:
    start_idx = content.find("export const PageReveal: React.FC")
end_idx = content.find("});", start_idx)
if end_idx != -1 and "});" in content[start_idx:start_idx+3000]:
    end_idx += 3
else:
    end_idx = content.find("};", start_idx) + 2

content = content[:start_idx] + new_page_reveal + content[end_idx:]

# Remove mode="wait"
content = content.replace('<AnimatePresence mode="wait">', '<AnimatePresence>')

# main-app
content = content.replace('<PageReveal key="main-app"', '<motion.div key="main-app" exit={{ opacity: 0.99, transition: { duration: 1.5 } }}')
# We need to replace the </PageReveal> that closes main-app.
# This one is right before `) : (`
content = content.replace('</PageReveal>\n      ) : (\n        <PageReveal key="exercise-app"', '</motion.div>\n      ) : (\n        <PageReveal key="exercise-app"')

# Wait, in the earlier version it was:
# {viewMode !== 'exercise' && (
#   <motion.div key="main-app" ...>
#   ...
#   </motion.div>
# )}
# {viewMode === 'exercise' && (
#   <PageReveal key="exercise-app" ...>
# )}
# Let's check how it's actually written.
