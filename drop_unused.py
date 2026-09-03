import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    line_num = i + 1
    
    if 458 <= line_num <= 504:
        continue
        
    new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
