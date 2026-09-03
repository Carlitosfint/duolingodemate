import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

btn_target = """                  {/* Floating Pet Race Button */}
                  <button 
                    onClick={() => setShowPetRace(true)}
                    className="absolute bottom-8 right-8 z-50 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg border-4 border-white transform transition hover:scale-110 flex flex-col items-center justify-center animate-bounce"
                  >
                    <span className="text-3xl">🏁</span>
                    <span className="text-xs font-black uppercase tracking-widest mt-1">Carrera</span>
                  </button>"""

content = content.replace(btn_target, "")

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done")
