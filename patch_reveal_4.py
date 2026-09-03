import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Let's fix the z-index and opacity handling for the exiting component
# If it's exiting, it should definitely stay visible and opaque.
content = content.replace(
    "exit={{ opacity: 1, transition: { duration: 3 } }}",
    "exit={{ opacity: 1, transition: { duration: 3.5 } }}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

