import React, { useState } from 'react';
import { Card, Button } from './UI';
import { auth } from '../lib/firebase';

type CreateResult = { name: string; email: string; tempPassword?: string; status: 'ok' | 'error'; error?: string };

const authedFetch = async (url: string, options: RequestInit = {}) => {
  const token = await auth.currentUser?.getIdToken();
  return fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
};

export const AdminCreateAccounts: React.FC<{ canCreateTeachers: boolean }> = ({ canCreateTeachers }) => {
  const [mode, setMode] = useState<'individual' | 'bulk'>('individual');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateResult | null>(null);
  const [error, setError] = useState('');

  const [bulkText, setBulkText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<CreateResult[] | null>(null);
  const [bulkError, setBulkError] = useState('');

  const handleCreateOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await authedFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo crear la cuenta.');
      } else {
        setResult({ name: data.user.name, email: data.user.email, tempPassword: data.tempPassword, status: 'ok' });
        setName('');
        setEmail('');
        setRole('student');
      }
    } catch {
      setError('Error de conexión. Revisa tu internet.');
    }
    setLoading(false);
  };

  // One student per line: "Nombre, correo@ejemplo.com"
  const parseBulkText = () =>
    bulkText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [studentName, studentEmail] = line.split(',').map((part) => part?.trim() || '');
        return { name: studentName, email: studentEmail };
      });

  const handleCreateBulk = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkError('');
    setBulkResults(null);
    const students = parseBulkText();
    if (students.length === 0) {
      setBulkError('Escribe al menos un alumno.');
      return;
    }
    setBulkLoading(true);
    try {
      const res = await authedFetch('/api/admin/users/bulk', {
        method: 'POST',
        body: JSON.stringify({ students }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBulkError(data.error || 'No se pudo procesar la carga.');
      } else {
        setBulkResults(data.results);
        if ((data.results as CreateResult[]).every((r) => r.status === 'ok')) {
          setBulkText('');
        }
      }
    } catch {
      setBulkError('Error de conexión. Revisa tu internet.');
    }
    setBulkLoading(false);
  };

  return (
    <Card className="p-6 md:p-8 !items-start !text-left w-full space-y-6">
      <div className="flex items-center justify-between w-full flex-wrap gap-3">
        <h3 className="text-xl font-black text-slate-800">Crear cuentas</h3>
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setMode('individual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-colors ${mode === 'individual' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setMode('bulk')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-colors ${mode === 'bulk' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}
          >
            Carga masiva
          </button>
        </div>
      </div>

      {mode === 'individual' ? (
        <form onSubmit={handleCreateOne} className="w-full space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
          {canCreateTeachers && (
            <div>
              <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'student' | 'teacher' | 'admin')}
                className="px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          <Button type="submit" color="blue" disabled={loading} className="px-6 py-2.5">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCreateBulk} className="w-full space-y-4">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">
              Lista de alumnos (uno por línea: Nombre, correo@ejemplo.com)
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={'Ana Torres, ana.torres@correo.com\nLuis Gómez, luis.gomez@correo.com'}
            />
          </div>
          {bulkError && <p className="text-sm font-bold text-red-600">{bulkError}</p>}
          <Button type="submit" color="blue" disabled={bulkLoading} className="px-6 py-2.5">
            {bulkLoading ? 'Creando...' : 'Crear cuentas'}
          </Button>
        </form>
      )}

      {result && (
        <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="font-black text-emerald-700 text-sm mb-1">Cuenta creada: {result.name}</p>
          <p className="text-sm text-emerald-800">
            Correo: <span className="font-mono font-bold">{result.email}</span> — Contraseña temporal:{' '}
            <span className="font-mono font-bold">{result.tempPassword}</span>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Anota esta contraseña ahora, no se volverá a mostrar. Compártela con la persona; puede cambiarla luego desde "¿Olvidaste tu contraseña?" en el login.
          </p>
        </div>
      )}

      {bulkResults && (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <th className="p-2">Nombre</th>
                <th className="p-2">Correo</th>
                <th className="p-2">Contraseña temporal</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bulkResults.map((r, i) => (
                <tr key={i}>
                  <td className="p-2 font-bold">{r.name}</td>
                  <td className="p-2 font-mono">{r.email}</td>
                  <td className="p-2 font-mono">{r.tempPassword || '—'}</td>
                  <td className={`p-2 font-bold ${r.status === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {r.status === 'ok' ? 'Creada' : r.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">Anota estas contraseñas ahora, no se volverán a mostrar.</p>
        </div>
      )}
    </Card>
  );
};
