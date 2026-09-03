import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_h3 = '<h3 className="font-black text-slate-800 text-lg mb-2">{topic.name}</h3>'
new_h3 = '<h3 className="font-black text-slate-800 text-base md:text-lg mb-2 leading-tight break-words">{topic.name}</h3>'

if old_h3 in content:
    content = content.replace(old_h3, new_h3)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find the h3")
