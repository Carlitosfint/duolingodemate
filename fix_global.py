import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

click_listener = """
let globalLastClick = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  globalLastClick = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('click', (e) => {
    globalLastClick = { x: e.clientX, y: e.clientY };
  }, true);
}
"""

content = content.replace("const CIRCLE_COLORS", click_listener + "\nconst CIRCLE_COLORS")

with open('src/App.tsx', 'w') as f:
    f.write(content)

