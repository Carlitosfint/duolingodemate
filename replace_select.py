import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Map mode
map_buttons = """                     <div className="flex bg-slate-100 p-1 rounded-xl">
                       <button 
                         onClick={() => setActiveCourse('razonamiento')}
                         className={`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'razonamiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                         RM Básico
                       </button>
                       <button 
                         onClick={() => setActiveCourse('razonamiento_5to')}
                         className={`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                         RM 5to
                       </button>
                       <button 
                         onClick={() => setActiveCourse('trigonometria')}
                         className={`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                         Trigonom.
                       </button>
                       <button 
                         onClick={() => setActiveCourse('geometria_5to')}
                         className={`flex-1 px-2 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'geometria_5to' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                       >
                         Geometría 5to
                       </button>
                     </div>"""
                     
map_select = """                     <div className="flex bg-slate-100 p-1 rounded-xl">
                       <select
                         value={activeCourse}
                         onChange={(e) => setActiveCourse(e.target.value as any)}
                         className="flex-1 px-3 py-2 text-sm font-bold text-slate-700 bg-white border-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none appearance-none"
                         style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}
                       >
                         <option value="razonamiento">RM Básico</option>
                         <option value="razonamiento_5to">RM 5to</option>
                         <option value="trigonometria">Trigonometría</option>
                         <option value="geometria_5to">Geometría 5to</option>
                       </select>
                     </div>"""
                     
content = content.replace(map_buttons, map_select)

# Infinite mode
inf_buttons = """                       <div className="flex bg-slate-200 p-1 rounded-xl">
                         <button 
                           onClick={() => setActiveCourse('razonamiento')}
                           className={`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'razonamiento' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           RM Básico
                         </button>
                         <button 
                           onClick={() => setActiveCourse('razonamiento_5to')}
                           className={`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'razonamiento_5to' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           RM 5to
                         </button>
                         <button 
                           onClick={() => setActiveCourse('trigonometria')}
                           className={`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'trigonometria' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           Trigonometría
                         </button>
                         <button 
                           onClick={() => setActiveCourse('geometria_5to')}
                           className={`px-3 py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all ${activeCourse === 'geometria_5to' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           Geometría 5to
                         </button>
                       </div>"""
                       
inf_select = """                       <div className="flex bg-slate-200 p-1 rounded-xl min-w-[200px]">
                         <select
                           value={activeCourse}
                           onChange={(e) => setActiveCourse(e.target.value as any)}
                           className="flex-1 w-full px-3 py-2 text-sm font-bold text-slate-700 bg-white border-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none appearance-none"
                           style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}
                         >
                           <option value="razonamiento">RM Básico</option>
                           <option value="razonamiento_5to">RM 5to</option>
                           <option value="trigonometria">Trigonometría</option>
                           <option value="geometria_5to">Geometría 5to</option>
                         </select>
                       </div>"""

content = content.replace(inf_buttons, inf_select)

with open("src/App.tsx", "w") as f:
    f.write(content)
