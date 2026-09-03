import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "const maskImage ="
end_marker = "const [mountId] ="

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_content = """const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, transparent ${holeRadius}px, black calc(${holeRadius}px + 1px))`;
  const clip0 = useMotionTemplate`circle(${r0}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip1 = useMotionTemplate`circle(${r1}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip2 = useMotionTemplate`circle(${r2}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip3 = useMotionTemplate`circle(${r3}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip4 = useMotionTemplate`circle(${r4}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clips = [clip0, clip1, clip2, clip3, clip4];

  """

content = content[:start_idx] + new_content + content[end_idx:]

start_marker2 = "{CIRCLE_COLORS.map((color, i) => {"
end_marker2 = "})}\n        </motion.div>"

start_idx2 = content.find(start_marker2)
end_idx2 = content.find(end_marker2, start_idx2)

if start_idx2 == -1 or end_idx2 == -1:
    print("Could not find markers 2")
    sys.exit(1)

new_content2 = """{CIRCLE_COLORS.map((color, i) => {
            return (
              <motion.div
                key={`${mountId}-${color}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10 + i,
                  backgroundColor: color,
                  clipPath: clips[i],
                  WebkitClipPath: clips[i]
                }}
              />
            );
          """

content = content[:start_idx2] + new_content2 + content[end_idx2:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done")
