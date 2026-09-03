import sys

with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

start_marker = "const points = useMemo(() => {"
end_marker = "  }, [nodeSpacing, amplitude, offset]);"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_logic = """const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= totalSteps; i++) {
      const y = ((totalSteps - i) * nodeSpacing) + offset;
      
      // More organic and varied meandering path
      const wave1 = Math.sin(i * 0.6) * (amplitude * 0.5);
      const wave2 = Math.sin(i * 1.1) * (amplitude * 0.35);
      const wave3 = Math.cos(i * 1.7) * (amplitude * 0.25);
      
      const x = offset + wave1 + wave2 + wave3;
      
      pts.push({ x, y, step: i });
    }
    return pts;
"""

content = content[:start_idx] + new_logic + content[end_idx:]

with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)

print("Done")
