import sys

with open('src/components/CustomIcons.tsx', 'r') as f:
    content = f.read()

# Replace the first `ArrowRight, X, ` with nothing
content = content.replace('ArrowRight, X, ', '', 1)

with open('src/components/CustomIcons.tsx', 'w') as f:
    f.write(content)
