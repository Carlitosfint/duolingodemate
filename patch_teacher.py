import re

with open("src/components/TeacherDashboard.tsx", "r") as f:
    content = f.read()

# Add states for classroom filtering
states_block = """  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);"""
states_replace = """  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroomFilter, setSelectedClassroomFilter] = useState<string>('all');"""
content = content.replace(states_block, states_replace)

# Add classroom filter to the header
header_block = """      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800">Panel de Profesor / Admin</h2>
        <Button onClick={fetchStudents} color="blue" className="px-4 py-2 text-sm gap-2">
          <Icon name="refresh_cw" size={16} />
          Actualizar
        </Button>
      </div>"""
header_replace = """      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800">Panel de Profesor / Admin</h2>
        <div className="flex items-center gap-4">
          <select 
            value={selectedClassroomFilter} 
            onChange={(e) => setSelectedClassroomFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los Salones</option>
            <option value="none">Sin Salón</option>
            {Array.from(new Set(students.map(s => s.classroom).filter(Boolean))).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button onClick={fetchStudents} color="blue" className="px-4 py-2 text-sm gap-2">
            <Icon name="refresh_cw" size={16} />
            Actualizar
          </Button>
        </div>
      </div>"""
content = content.replace(header_block, header_replace)

# Table headers
th_block = """              <th className="p-4 rounded-tl-3xl">Estudiante</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Progreso</th>"""
th_replace = """              <th className="p-4 rounded-tl-3xl">Estudiante</th>
              <th className="p-4">Email</th>
              <th className="p-4">Salón</th>
              <th className="p-4 text-center">Progreso</th>"""
content = content.replace(th_block, th_replace)

# Colspan fallback
colspan_block = """                <td colSpan={7} className="p-8 text-center text-slate-500">"""
colspan_replace = """                <td colSpan={8} className="p-8 text-center text-slate-500">"""
content = content.replace(colspan_block, colspan_replace)

# Filter logic and rows
rows_block = """              students.map((student) => {
                const stats = student.stats || {};
                return ("""
rows_replace = """              students.filter(s => {
                if (selectedClassroomFilter === 'all') return true;
                if (selectedClassroomFilter === 'none') return !s.classroom;
                return s.classroom === selectedClassroomFilter;
              }).map((student) => {
                const stats = student.stats || {};
                return ("""
content = content.replace(rows_block, rows_replace)

# Table data rows
td_block = """                    <td className="p-4 text-slate-500 font-medium">{student.email}</td>
                    <td className="p-4 text-center text-blue-600 font-black">{student.progress}</td>"""
td_replace = """                    <td className="p-4 text-slate-500 font-medium">{student.email}</td>
                    <td className="p-4">
                      <select
                        value={student.classroom || ''}
                        onChange={(e) => updateStudent(student.uid, { classroom: e.target.value })}
                        className="px-2 py-1 text-xs rounded-lg border border-slate-200 text-slate-600 outline-none focus:ring-1 focus:ring-blue-500 w-24 bg-slate-50 hover:bg-white"
                      >
                        <option value="">- Asignar -</option>
                        <option value="5to A">5to A</option>
                        <option value="5to B">5to B</option>
                        <option value="4to A">4to A</option>
                        <option value="4to B">4to B</option>
                        <option value="3ro A">3ro A</option>
                        <option value="3ro B">3ro B</option>
                      </select>
                    </td>
                    <td className="p-4 text-center text-blue-600 font-black">{student.progress}</td>"""
content = content.replace(td_block, td_replace)

with open("src/components/TeacherDashboard.tsx", "w") as f:
    f.write(content)
