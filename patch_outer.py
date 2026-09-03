import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_outer_start = """      {viewMode !== 'exercise' ? (
        <div className="max-w-[1600px] xl:max-w-[1850px] w-full px-4 lg:px-6 xl:px-10 mx-auto flex flex-col lg:flex-row landscape:flex-row gap-4 lg:gap-6 landscape:gap-3 h-[calc(100vh-2rem)] z-30 relative animate-slide-up landscape-mini">"""

new_outer_start = """      <AnimatePresence mode="wait">
      {viewMode !== 'exercise' ? (
        <motion.div key="main-app" initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }} className="max-w-[1600px] xl:max-w-[1850px] w-full px-4 lg:px-6 xl:px-10 mx-auto flex flex-col lg:flex-row landscape:flex-row gap-4 lg:gap-6 landscape:gap-3 h-[calc(100vh-2rem)] z-30 relative landscape-mini">"""
content = content.replace(old_outer_start, new_outer_start)

old_outer_mid = """           </div>
        </div>
      ) : (
        <div className="w-full relative z-30 animate-slide-up max-w-[1400px] mx-auto landscape-mini">"""

new_outer_mid = """           </div>
        </motion.div>
      ) : (
        <motion.div key="exercise-app" initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -15 }} transition={{ duration: 0.3, ease: "easeOut" }} className="w-full relative z-30 max-w-[1400px] mx-auto landscape-mini">"""
content = content.replace(old_outer_mid, new_outer_mid)

old_outer_end = """      </main>
      </div>
      )}

      {/* Mobile Bottom Navigation */}"""

new_outer_end = """      </main>
      </motion.div>
      )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}"""
content = content.replace(old_outer_end, new_outer_end)

with open('src/App.tsx', 'w') as f:
    f.write(content)

