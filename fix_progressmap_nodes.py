import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

# Replace node type logic
start_marker = "const isUfo ="
end_marker = "const isPast ="

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_logic = """const isSpecial = (step + 1) % 3 === 0;
          const specialIdx = isSpecial ? Math.floor((step + 1) / 3) : 0;
          
          const isUfo = isSpecial && (specialIdx % 7 === 0);
          const isRace = isSpecial && (specialIdx % 7 === 3);
          const isChest = isSpecial && !isUfo && !isRace;
          
          """

content = content[:start_idx] + new_logic + content[end_idx:]

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)

print("Done")
