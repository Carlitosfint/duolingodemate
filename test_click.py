import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add global click listener outside the App component.
click_listener = """
let globalLastClick = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  globalLastClick = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('click', (e) => {
    globalLastClick = { x: e.clientX, y: e.clientY };
  }, true);
}
"""

if "globalLastClick" not in content:
    # insert after imports
    content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\n" + click_listener)

with open('src/App.tsx', 'w') as f:
    f.write(content)

