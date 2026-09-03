import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("3500 + 1200", "3500 + 1500")

with open('src/App.tsx', 'w') as f:
    f.write(content)
