import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Create the new component
new_component = """
const CourseSelector = ({ activeCourse, setActiveCourse }: { activeCourse: string, setActiveCourse: (course: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const courses = [
    { id: 'razonamiento', name: 'RM Básico', icon: '🧠', color: 'text-blue-600', bg: 'bg-blue-100' },
    { id: 'razonamiento_5to', name: 'RM 5to', icon: '🔥', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { id: 'trigonometria', name: 'Trigonom.', icon: '📐', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { id: 'geometria_5to', name: 'Geo 5to', icon: '🧊', color: 'text-rose-600', bg: 'bg-rose-100' },
  ];
  
  const active = courses.find(c => c.id === activeCourse) || courses[0];

  return (
    <div className="relative group z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-b-4 border-slate-200 rounded-xl font-black text-slate-700 shadow-sm active:translate-y-px active:border-b-2 transition-all min-w-[160px]"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{active.icon}</span>
          <span className={active.color}>{active.name}</span>
        </div>
        <Icon name="chevron_down" size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 w-full p-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-50 flex flex-col gap-1 origin-top animate-in fade-in zoom-in-95 duration-100">
            {courses.map(course => (
              <button
                key={course.id}
                onClick={() => { setActiveCourse(course.id); setIsOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm text-left transition-colors ${activeCourse === course.id ? course.bg + ' ' + course.color : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span className="text-base">{course.icon}</span>
                <span>{course.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

"""

# Insert the component before export default function App()
content = content.replace("export default function App() {", new_component + "export default function App() {")

# Replace Map Mode select
map_select = """                     <div className="flex bg-slate-100 p-1 rounded-xl">
                       <select
                         value={activeCourse}
                         onChange={(e) => setActiveCourse(e.target.value as any)}
                         className="flex-1 px-3 py-2 text-sm font-bold text-slate-700 bg-white border-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none appearance-none"
                         style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}
                       >
                         <option value="razonamiento">RM Básico</option>
                         <option value="razonamiento_5to">RM 5to</option>
                         <option value="trigonometria">Trigonometría</option>
                         <option value="geometria_5to">Geometría 5to</option>
                       </select>
                     </div>"""
                     
map_replacement = """                     <CourseSelector activeCourse={activeCourse} setActiveCourse={setActiveCourse} />"""
content = content.replace(map_select, map_replacement)

# Replace Infinite Mode select
inf_select = """                       <div className="flex bg-slate-200 p-1 rounded-xl min-w-[200px]">
                         <select
                           value={activeCourse}
                           onChange={(e) => setActiveCourse(e.target.value as any)}
                           className="flex-1 w-full px-3 py-2 text-sm font-bold text-slate-700 bg-white border-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none appearance-none"
                           style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em' }}
                         >
                           <option value="razonamiento">RM Básico</option>
                           <option value="razonamiento_5to">RM 5to</option>
                           <option value="trigonometria">Trigonometría</option>
                           <option value="geometria_5to">Geometría 5to</option>
                         </select>
                       </div>"""
                       
inf_replacement = """                       <CourseSelector activeCourse={activeCourse} setActiveCourse={setActiveCourse} />"""
content = content.replace(inf_select, inf_replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)
