import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

lines[1110] = '                        </div>\n'

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
