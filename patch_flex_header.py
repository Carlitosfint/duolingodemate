import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = '<div className="flex justify-center items-center mb-8 gap-2 shrink-0">'
replacement = '<div className="flex justify-center items-center mb-8 gap-2 shrink-0 relative w-full">'

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Patched header relative container")
else:
    print("Could not find header container")

