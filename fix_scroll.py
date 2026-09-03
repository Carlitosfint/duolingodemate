import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Make the inner container of PageReveal scrollable
content = content.replace(
    "style={{ flex: 1, width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>",
    "style={{ flex: 1, width: '100%', height: '100%', position: 'relative', zIndex: 1, overflowY: 'auto', overflowX: 'hidden' }}>"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

