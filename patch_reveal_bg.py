import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace bgClass inside PageReveal's motion.div
content = content.replace(
    "className={`absolute inset-0 flex flex-col ${bgClass}`}",
    "className={`absolute inset-0 flex flex-col ${bgClass} overflow-hidden`}"
)

# And inject FloatingMathBackground inside the absolute inset-0 div
content = content.replace(
    "className={`absolute inset-0 flex flex-col ${bgClass} overflow-hidden`}\n        initial",
    "className={`absolute inset-0 flex flex-col ${bgClass} overflow-hidden`}\n        initial"
)

# Actually, the simplest is to inject it right before the children div
content = content.replace(
    "<div className={className} style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>",
    "<div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}><FloatingMathBackground /></div>\n        <div className={className} style={{ flex: 1, width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

