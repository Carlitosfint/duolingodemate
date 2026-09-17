import React, { useEffect, useState } from 'react';
import { Card, Button } from './UI';
import { Icon } from './CustomIcons';
import { auth } from '../lib/firebase.ts';
import { AdminCreateAccounts } from './AdminCreateAccounts';

export const TeacherDashboard: React.FC<{ currentUserRole?: string }> = ({ currentUserRole }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassroomFilter, setSelectedClassroomFilter] = useState<string>('all');

  const fetchStudents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/teacher/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateStudent = async (uid: string, updates: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`/api/teacher/student/${uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        fetchStudents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-8 text-center font-bold text-slate-500">Cargando alumnos...</div>;
  }

  return (
    <div className="space-y-6">
      {currentUserRole === 'admin' && <AdminCreateAccounts />}

      <div className="flex items-center justify-between">
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
      </div>

      <Card className="p-0 !items-start !text-left w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <th className="p-4 rounded-tl-3xl">Estudiante</th>
              <th className="p-4">Email</th>
              <th className="p-4">Salón</th>
              <th className="p-4 text-center">Progreso</th>
              <th className="p-4 text-center">Monedas</th>
              <th className="p-4 text-center">Tickets</th>
              <th className="p-4 text-center">Resueltos</th>
              <th className="p-4 text-center rounded-tr-3xl">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No hay estudiantes registrados aún.
                </td>
              </tr>
            ) : (
              students.filter(s => {
                if (selectedClassroomFilter === 'all') return true;
                if (selectedClassroomFilter === 'none') return !s.classroom;
                return s.classroom === selectedClassroomFilter;
              }).map((student) => {
                const stats = student.stats || {};
                return (
                  <tr key={student.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {student.avatar === 'fox' ? '🦊' : student.avatar === 'cat' ? '🐱' : student.avatar === 'panda' ? '🐼' : student.avatar === 'tiger' ? '🐯' : student.avatar === 'lion' ? '🦁' : student.avatar === 'bear' ? '🐻' : '🦊'}
                        </div>
                        <div className="font-black text-slate-800 break-words whitespace-normal min-w-[150px]">{student.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{student.email}</td>
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
                    <td className="p-4 text-center text-blue-600 font-black">{student.progress}</td>
                    <td className="p-4 text-center text-amber-500 font-black">{student.coins}</td>
                    <td className="p-4 text-center text-blue-500 font-black">{student.tickets}</td>
                    <td className="p-4 text-center text-emerald-500 font-black">{stats.solved || 0}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => updateStudent(student.uid, { coins: (student.coins || 0) + 100 })} className="bg-amber-100 text-amber-700 p-2 rounded-lg hover:bg-amber-200 transition-colors" title="Dar 100 monedas">
                          <Icon name="coins" size={14} />
                        </button>
                        <button onClick={() => updateStudent(student.uid, { tickets: (student.tickets || 0) + 5 })} className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors" title="Dar 5 tickets">
                          <Icon name="ticket" size={14} />
                        </button>
                        <button onClick={() => updateStudent(student.uid, { progress: Math.max(0, (student.progress || 0) - 20) })} className="bg-rose-100 text-rose-700 p-2 rounded-lg hover:bg-rose-200 transition-colors" title="Retroceder nivel">
                          <Icon name="arrow_down" size={14} />
                        </button>
                        <button onClick={() => updateStudent(student.uid, { progress: (student.progress || 0) + 20 })} className="bg-emerald-100 text-emerald-700 p-2 rounded-lg hover:bg-emerald-200 transition-colors" title="Avanzar nivel">
                          <Icon name="arrow_up" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
};
