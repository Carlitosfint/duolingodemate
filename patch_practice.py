import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                       <h2 className="text-xl md:text-2xl font-black text-slate-800">Práctica Infinita</h2>
                       <div className="flex bg-slate-200 p-1 rounded-xl">'''

replacement = '''                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                       <h2 className="text-xl md:text-2xl font-black text-slate-800">Práctica Infinita</h2>
                       <button 
                         onClick={() => { playClickSound(); setShowDictLab(true); }}
                         className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all shadow-sm"
                       >
                         <Icon name="book" size={18} />
                         Códice
                       </button>
                       <div className="flex bg-slate-200 p-1 rounded-xl">'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Replaced practice map successfully!")
else:
    print("Target not found.")

