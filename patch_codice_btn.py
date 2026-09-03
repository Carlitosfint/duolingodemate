import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """<span className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E8F0FE] text-blue-700 shadow-sm">
                DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic!] || 0) : (user?.progress || 0)) + 1} - {currentProblem.data.type.toUpperCase()}
              </span>"""

replacement = """<span className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E8F0FE] text-blue-700 shadow-sm">
                DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic!] || 0) : (user?.progress || 0)) + 1} - {currentProblem.data.type.toUpperCase()}
              </span>
              <button 
                onClick={() => { playClickSound(); setShowDictLab(true); }}
                className="absolute right-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:scale-105 active:scale-95 rounded-full transition-all shadow-sm"
                title="Códice de Fórmulas"
              >
                <Icon name="book" size={18} />
              </button>"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Patched Códice button successfully")
else:
    print("Could not find the target text in App.tsx")

