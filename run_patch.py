import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

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

content = content.replace('<AnimatePresence mode="wait">', '<AnimatePresence>')

content = content.replace('<PageReveal key="main-app"', '<motion.div key="main-app" exit={{ opacity: 0.99, transition: { duration: 1.5 } }}')
content = content.replace('</PageReveal>\n      ) : (\n        <PageReveal key="exercise-app"', '</motion.div>\n      ) : (\n        <PageReveal key="exercise-app"')

tabs = ['map', 'codice', 'album', 'shop', 'mistakes', 'profile', 'teacher']
for tab in tabs:
    content = content.replace(f'<PageReveal key="{tab}"', f'<div key="{tab}"')

# For closing tags of tabs, they are all PageReveal. We can just replace all </PageReveal> with </div>
# EXCPET the last one which is for exercise-app!
# The easiest way is to change all </PageReveal> to </div>, then change the very last </div> back to </PageReveal>.
# Or wait, PageReveal is ONLY used for exercise-app now!
# So let's replace all </PageReveal> with </div>.
content = content.replace('</PageReveal>', '</div>')

# Then we find the last </div> before the end of AnimatePresence and turn it back into </PageReveal>.
# Actually, exercise-app is:
# <PageReveal key="exercise-app" ...>
#   ...
# </div>
# </AnimatePresence>
# Let's fix the closing tag for exercise-app specifically by finding `<PageReveal key="exercise-app"` and finding its corresponding closing. 
# But it's much easier to just replace the last </div> before </AnimatePresence>.
# Let's do it cleanly:
content = content.replace('</div>\n      </AnimatePresence>', '</PageReveal>\n      </AnimatePresence>')

with open('src/App.tsx', 'w') as f:
    f.write(content)
