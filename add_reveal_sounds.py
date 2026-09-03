import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add sound to Phase 1
content = content.replace(
    'animate(holeRadius, 50, { duration: 0.4, ease: "easeInOut" }); // 50px = ~12vmin',
    'playTransitionSound();\n    animate(holeRadius, 50, { duration: 0.4, ease: "easeInOut" }); // 50px = ~12vmin'
)

# Add sound to Phase 3
content = content.replace(
    'animate(holeRadius, 50, { duration: 0.3, ease: "easeInOut" });\n      animate(pageRadius, 50, { duration: 0.3, ease: "easeInOut" });',
    'playRevealSound();\n      animate(holeRadius, 50, { duration: 0.3, ease: "easeInOut" });\n      animate(pageRadius, 50, { duration: 0.3, ease: "easeInOut" });'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

