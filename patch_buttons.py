import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target1 = '''                       <Icon name="book" size={18} />
                       Códice'''

replacement1 = '''                       <span className="text-lg md:text-xl">📖</span>
                       <div className="flex flex-col items-start text-left">
                         <span className="leading-none mb-0.5 text-sm">Códice de Fórmulas</span>
                         <span className="text-[10px] font-medium opacity-80 leading-none">Repasa teoría y trucos 🧠✨</span>
                       </div>'''

if target1 in content:
    content = content.replace(target1, replacement1)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Replaced button texts successfully!")
else:
    print("Target 1 not found.")

