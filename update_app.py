import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update PageReveal component to only do circles and reveal the content properly overlaying everything.
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
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 20,
          pointerEvents: animationDone ? 'auto' : 'none',
          backgroundColor: '#f8fafc' // The background color of the exercise view so it hides what's underneath after clipPath completes
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
if end_idx != -1:
    end_idx += 3
else:
    end_idx = content.find("};", start_idx) + 2

content = content[:start_idx] + new_page_reveal + content[end_idx:]

# Remove mode="wait" from AnimatePresence
content = content.replace('<AnimatePresence mode="wait">', '<AnimatePresence>')

# Replace main-app PageReveal with motion.div and exit delay
content = content.replace('<PageReveal key="main-app"', '<motion.div key="main-app" exit={{ opacity: 0.99, transition: { duration: 1.5 } }}')
content = content.replace('</PageReveal>\n      ) : (\n        <PageReveal key="exercise-app"', '</motion.div>\n      ) : (\n        <PageReveal key="exercise-app"')

# Wait, there's another PageReveal for exercise-app? Let's check how many </PageReveal> exist.
# The internal tabs are also PageReveal.
# Let's replace the internal tabs PageReveal with simple div.
# We will just replace '<PageReveal key="map"' with '<div key="map"' and so on.
tabs = ['map', 'codice', 'album', 'shop', 'mistakes', 'profile', 'teacher']
for tab in tabs:
    content = content.replace(f'<PageReveal key="{tab}"', f'<div key="{tab}"')

# Also replace their closing tags. 
# This requires some care. Let's find each tab and replace its corresponding </PageReveal> with </div>.
# Since we just replaced the opening, we can't just blind replace </PageReveal> if we don't know which one.
# But since only exercise-app will remain as PageReveal, we can replace all </PageReveal> with </div>
# EXCEPT the one for exercise-app!
