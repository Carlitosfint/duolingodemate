import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                     </div>
                     <div className="flex bg-slate-100 p-1 rounded-xl">'''

replacement = '''                     </div>
                     <button 
                       onClick={() => { playClickSound(); setShowDictLab(true); }}
                       className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all shadow-sm"
                     >
                       <Icon name="book" size={18} />
                       Códice
                     </button>
                     <div className="flex bg-slate-100 p-1 rounded-xl">'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Target not found.")
    print("Target repr:", repr(target))
    # Look for it with regex
    match = re.search(r'</div>\s*<div className="flex bg-slate-100 p-1 rounded-xl">', content)
    if match:
        print("Found with regex:", repr(match.group(0)))
        content = content[:match.start()] + replacement + content[match.end():]
        with open('src/App.tsx', 'w') as f:
            f.write(content)
        print("Replaced with regex!")
