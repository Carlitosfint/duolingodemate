import re

with open("src/components/TruthTableInput.tsx", "r") as f:
    content = f.read()

old_code = "const newVal = arr.join('').replace(/ /g, '');"
new_code = "const newVal = arr.join('');"

if old_code in content:
    content = content.replace(old_code, new_code)
    with open("src/components/TruthTableInput.tsx", "w") as f:
        f.write(content)
    print("Patched truth table input")
else:
    print("Could not find code")
