import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

lines[1172] = '                </motion.div>\n'

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
