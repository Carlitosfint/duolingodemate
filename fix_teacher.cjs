const fs = require('fs');
const code = `import React, { useEffect, useState } from 'react';
import { Card, Button } from './UI.tsx';
import { Icon } from './CustomIcons.tsx'; 
import { auth } from '../lib/firebase.ts';

export const TeacherDashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/teacher/students', {
        headers: {
          Authorization: \`Bearer \${token}\`
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

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-8 text-center font-bold text-slate-500">Cargando alumnos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800">Panel de Profesor / Admin</h2>
        <Button onClick={fetchStudents} color="blue" className="px-4 py-2 text-sm gap-2">
          <Icon name="refresh_cw" size={16} />
          Actualizar
        </Button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <th className="p-4 rounded-tl-3xl">Estudiante</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Progreso (Nivel)</th>
              <th className="p-4 text-center">Monedas</th>
              <th className="p-4 text-center">Tickets</th>
              <th className="p-4 text-center">Resueltos</th>
              <th className="p-4 text-center rounded-tr-3xl">Racha Max</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No hay estudiantes registrados aún.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const stats = student.stats || {};
                return (
                  <tr key={student.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">
                          {student.avatar === 'fox' ? '🦊' : student.avatar === 'cat' ? '🐱' : student.avatar === 'panda' ? '🐼' : student.avatar === 'tiger' ? '🐯' : student.avatar === 'lion' ? '🦁' : student.avatar === 'bear' ? '🐻' : '🦊'}
                        </div>
                        <div className="font-black text-slate-800 line-clamp-1">{student.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">{student.email}</td>
                    <td className="p-4 text-center text-blue-600 font-black">{student.progress}</td>
                    <td className="p-4 text-center text-amber-500 font-black">{student.coins}</td>
                    <td className="p-4 text-center text-blue-500 font-black">{student.tickets}</td>
                    <td className="p-4 text-center text-emerald-500 font-black">{stats.solved || 0}</td>
                    <td className="p-4 text-center text-rose-500 font-black">{stats.maxStreak || 0}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
`;
fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
