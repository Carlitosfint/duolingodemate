import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

target = "{viewMode === 'map' && (<TabTransition type=\"swipe\" key=\"map\">"
end_target = "</TabTransition>)}"

start_idx = content.find(target)
if start_idx == -1:
    print("Not found")
    sys.exit(1)

insert_marker = "                  </div>\n                </div>\n              </TabTransition>)}"
insert_idx = content.find(insert_marker, start_idx)

if insert_idx == -1:
    print("Insert marker not found")
    sys.exit(1)

btn = """                  </div>
                  {/* Floating Pet Race Button */}
                  <button 
                    onClick={() => setShowPetRace(true)}
                    className="absolute bottom-8 right-8 z-50 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg border-4 border-white transform transition hover:scale-110 flex flex-col items-center justify-center animate-bounce"
                  >
                    <span className="text-3xl">🏁</span>
                    <span className="text-xs font-black uppercase tracking-widest mt-1">Carrera</span>
                  </button>
                </div>
              </TabTransition>)}"""

content = content[:insert_idx] + btn + content[insert_idx + len(insert_marker):]

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done")
