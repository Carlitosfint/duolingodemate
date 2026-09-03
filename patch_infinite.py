import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = '''                     </div>
                     <button onClick={() => setViewMode('practice')} className="p-2 bg-slate-200/50 rounded-lg hover:bg-slate-300/50 transition-colors">
                       <Icon name="x" size={20} className="text-slate-600" />
                     </button>'''

replacement = '''                     </div>
                     <div className="flex items-center gap-2">
                       <button 
                         onClick={() => { playClickSound(); setShowDictLab(true); }}
                         className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all shadow-sm"
                       >
                         <Icon name="book" size={18} />
                         Códice
                       </button>
                       <button onClick={() => setViewMode('practice')} className="p-2 bg-slate-200/50 rounded-lg hover:bg-slate-300/50 transition-colors">
                         <Icon name="x" size={20} className="text-slate-600" />
                       </button>
                     </div>'''

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Replaced infinite map successfully!")
else:
    print("Target not found.")
    
