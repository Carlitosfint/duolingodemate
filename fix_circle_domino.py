import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Restore the domino effect delay
content = content.replace(
    "delay: 0 // Remove delay so they all appear together",
    "delay: isExpandingFinal ? 0 : i * 0.05"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

