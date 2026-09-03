import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_card = 'className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1"'
new_card = 'className="bg-white p-4 md:p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1 flex flex-col items-center text-center md:items-start md:text-left"'

if old_card in content:
    content = content.replace(old_card, new_card)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Patched card successfully")
else:
    print("Could not find the card")
