import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the bottom nav
old_nav = """      {/* Mobile Bottom Navigation */}
      {viewMode !== 'exercise' && (
        <div className="nav-sidebar lg:hidden landscape:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 p-2 z-[100] flex justify-around items-center pb-safe">"""

new_nav = """      {/* Mobile Bottom Navigation */}
      {viewMode !== 'exercise' && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 3.0, ease: "easeOut" }}
          className="nav-sidebar lg:hidden landscape:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 p-2 z-[100] flex justify-around items-center pb-safe"
        >"""

if old_nav in content:
    content = content.replace(old_nav, new_nav)
    # also replace the closing </div>
    # we know it's at the end of the mobile bottom navigation
    content = content.replace(
"""          </button>
        </div>
      )}

      {/* Renders all floating popup modal views */}""",
"""          </button>
        </motion.div>
      )}

      {/* Renders all floating popup modal views */}"""
    )
    print("Nav replaced")
else:
    print("Could not find old nav")

with open('src/App.tsx', 'w') as f:
    f.write(content)

