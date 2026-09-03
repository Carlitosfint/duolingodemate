import sys
import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make sure we add AnimatePresence mode wait before {viewMode === 'map' && (
content = re.sub(
    r'(\{viewMode === \'map\' && \(\s*<>\s*\{\/\* Map Header \*\/})',
    r'<AnimatePresence mode="wait">\n              \1',
    content
)

# And close it after {viewMode === 'teacher' && (...)}
content = re.sub(
    r'(\{viewMode === \'teacher\' && \([\s\S]*?</div>\s*\)\s*\})',
    r'\1\n              </AnimatePresence>',
    content
)

# Replace 'map' opening
content = re.sub(
    r'\{viewMode === \'map\' && \(\s*<>\s*\{\/\* Map Header \*\/\}',
    r'{viewMode === \'map\' && (\n                <motion.div key="map" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="flex-1 flex flex-col h-full relative z-10">\n                  {/* Map Header */}',
    content
)

# Replace 'map' closing
content = re.sub(
    r'(<ProgressMap[\s\S]*?/>\s*</div>)\s*</>\s*\)',
    r'\1\n                </motion.div>\n              )',
    content
)

# Function to wrap single div views with motion
def wrap_view(mode_str, class_str):
    global content
    pattern = r'(\{viewMode === \'' + mode_str + r'\' && \(\s*)<div className="([^"]+)">'
    replacement = r'\1<motion.div key="' + mode_str + r'" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }} className="\2">'
    content = re.sub(pattern, replacement, content)
    
    # replace the closing div
    pattern_end = r'(\{viewMode === \'' + mode_str + r'\' && \([\s\S]*?)\s*</div>\s*\)'
    replacement_end = r'\1\n                </motion.div>\n              )'
    content = re.sub(pattern_end, replacement_end, content)


wrap_view('codice', '')
wrap_view('album', '')
wrap_view('mistakes', '')
wrap_view('profile', '')
wrap_view('teacher', '')

with open('src/App.tsx', 'w') as f:
    f.write(content)
