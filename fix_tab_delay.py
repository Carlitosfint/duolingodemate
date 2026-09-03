import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# We need to change `delay: i * 0.05` to `delay: isPresent ? i * 0.05 : (4 - i) * 0.05`
# in TabTransition.

content = content.replace(
    'transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.05 }}',
    'transition={{ duration: 0.5, ease: "easeInOut", delay: isPresent ? i * 0.05 : (4 - i) * 0.05 }}'
)

content = content.replace(
    'transition={{ duration: 0.6, ease: "easeInOut", delay: i * 0.05 }}',
    'transition={{ duration: 0.6, ease: "easeInOut", delay: isPresent ? i * 0.05 : (4 - i) * 0.05 }}'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

