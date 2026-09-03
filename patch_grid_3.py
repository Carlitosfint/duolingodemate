import re

with open("src/App.tsx", "r") as f:
    content = f.read()

old_card = 'className="bg-white p-4 md:p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1 flex flex-col items-center text-center md:items-start md:text-left"'
new_card = 'className="bg-white p-5 md:p-6 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1 flex flex-col items-center text-center sm:items-start sm:text-left min-w-0"'

if old_card in content:
    content = content.replace(old_card, new_card)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Patched card 3 successfully")
else:
    print("Could not find the card 3")

old_h3 = 'className="font-black text-slate-800 text-base md:text-lg mb-2 leading-tight break-words"'
new_h3 = 'className="font-black text-slate-800 text-base md:text-lg mb-2 leading-tight break-words hyphens-auto w-full"'

if old_h3 in content:
    content = content.replace(old_h3, new_h3)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Patched h3 3 successfully")
else:
    print("Could not find the h3 3")
