import sys

with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    line_num = i + 1
    
    # Tienda de Poderes
    if 1420 <= line_num <= 1450:
        continue
        
    # Tienda Integrada + Banners
    if 1609 <= line_num <= 1760:
        continue
        
    new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.writelines(new_lines)
