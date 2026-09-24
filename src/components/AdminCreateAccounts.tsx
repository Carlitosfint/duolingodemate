import React, { useState } from 'react';
import { Card, Button } from './UI';
import { authedFetch } from '../lib/api';

type CreateResult = { name: string; email?: string; tempPassword?: string; status: 'ok' | 'error'; error?: string };
type Grade = '3ro' | '4to' | '5to';
type Role = 'student' | 'teacher' | 'secretary' | 'admin';


// Rendered for admins and secretaries. A secretary can only enroll
// students — appointing staff (teacher/secretary/admin) is reserved
// for the admin, so canManageStaff hides that choice entirely rather
// than showing options that would just get rejected by the server.
export const AdminCreateAccounts: React.FC<{ canManageStaff: boolean }> = ({ canManageStaff }) => {
  const [mode, setMode] = useState<'individual' | 'bulk'>('individual');
  const [role, setRole] = useState<Role>('student');

  // Student fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [grade, setGrade] = useState<Grade>('3ro');
  // Teacher/admin fields
  const [name, setName] = useState('');
  // Shared
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateResult | null>(null);
  const [error, setError] = useState('');
  const [dniConflict, setDniConflict] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const [bulkGrade, setBulkGrade] = useState<Grade>('3ro');
  const [bulkText, setBulkText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState<CreateResult[] | null>(null);
  const [bulkError, setBulkError] = useState('');
  const [bulkCopied, setBulkCopied] = useState(false);

  // A bulk load can create up to 200 accounts, and the temp passwords are
  // shown exactly once — without these the only options were transcribing
  // them by hand or resetting every account one by one.
  const createdRows = (bulkResults || []).filter((r) => r.status === 'ok' && r.tempPassword);

  const bulkAsText = () =>
    createdRows.map((r) => `${r.name}\t${r.email}\t${r.tempPassword}`).join('\n');

  const copyBulk = async () => {
    try {
      await navigator.clipboard.writeText(`Nombre\tCorreo\tContraseña temporal\n${bulkAsText()}`);
      setBulkCopied(true);
      setTimeout(() => setBulkCopied(false), 2000);
    } catch {
      // Clipboard can fail (permissions/insecure context); the table is
      // still on screen and the CSV download below still works.
    }
  };

  const downloadBulkCsv = () => {
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [
      ['Nombre', 'Correo', 'Contraseña temporal'].map(escape).join(','),
      ...createdRows.map((r) => [r.name, r.email || '', r.tempPassword || ''].map(escape).join(',')),
    ].join('\n');
    // BOM so Excel opens the accents correctly.
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuentas-${bulkGrade}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetStudentFields = () => {
    setFirstName('');
    setLastName('');
    setDni('');
    setEmail('');
  };

  const handleCreateOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDniConflict(false);
    setResult(null);
    setLoading(true);
    try {
      const body =
        role === 'student'
          ? { role, firstName, lastName, dni, grade, email: email.trim() || undefined }
          : { role, name, email };
      const res = await authedFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo crear la cuenta.');
        if (data.code === 'dni_exists') setDniConflict(true);
      } else {
        setResult({ name: data.user.name, email: data.user.email, tempPassword: data.tempPassword, status: 'ok' });
        if (role === 'student') resetStudentFields();
        else { setName(''); setEmail(''); }
      }
    } catch {
      setError('Error de conexión. Revisa tu internet.');
    }
    setLoading(false);
  };

  // A DNI conflict during creation usually means the student already
  // has an account at another school on the platform and is
  // transferring in — move their existing row instead of duplicating it.
  const handleTransfer = async () => {
    setTransferring(true);
    setError('');
    try {
      const res = await authedFetch('/api/admin/users/transfer', {
        method: 'POST',
        body: JSON.stringify({ dni, grade }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo transferir al alumno.');
      } else {
        setResult({ name: data.user.name, email: data.user.email, status: 'ok' });
        setDniConflict(false);
        resetStudentFields();
      }
    } catch {
      setError('Error de conexión. Revisa tu internet.');
    }
    setTransferring(false);
  };

  // One student per line: "Nombre, Apellido, DNI" (correo opcional al final)
  const parseBulkText = () =>
    bulkText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [studentFirstName, studentLastName, studentDni, studentEmail] = line.split(',').map((part) => part?.trim() || '');
        return { firstName: studentFirstName, lastName: studentLastName, dni: studentDni, email: studentEmail || undefined };
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
        body: JSON.stringify({ grade: bulkGrade, students }),
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
          {canManageStaff && (
            <div>
              <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="secretary">Secretario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          )}

          {role === 'student' ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Nombre</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Marian"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Apellido</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="Martinez"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">DNI</label>
                  <input
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    placeholder="12345678"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Grado</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as Grade)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="3ro">3ro de Secundaria</option>
                    <option value="4to">4to de Secundaria</option>
                    <option value="5to">5to de Secundaria</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">
                  Correo (opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  placeholder="Déjalo vacío para generarlo automático"
                />
              </div>
            </>
          ) : (
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
          )}

          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          {dniConflict && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-sm font-bold text-amber-700">
                ¿Es un alumno que se transfiere de otro colegio? Puedes moverlo a este colegio en vez de crear una cuenta nueva.
              </p>
              <Button
                type="button"
                color="yellow"
                disabled={transferring}
                onClick={handleTransfer}
                className="px-4 py-2 text-sm"
              >
                {transferring ? 'Transfiriendo...' : 'Transferir a mi colegio'}
              </Button>
            </div>
          )}
          <Button type="submit" color="blue" disabled={loading} className="px-6 py-2.5">
            {loading ? 'Creando...' : 'Crear cuenta'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCreateBulk} className="w-full space-y-4">
          <div>
            <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">Grado de esta carga</label>
            <select
              value={bulkGrade}
              onChange={(e) => setBulkGrade(e.target.value as Grade)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="3ro">3ro de Secundaria</option>
              <option value="4to">4to de Secundaria</option>
              <option value="5to">5to de Secundaria</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">La carga masiva es solo para alumnos, todos del mismo grado.</p>
          </div>
          <div>
            <label className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">
              Lista de alumnos (uno por línea: Nombre, Apellido, DNI — correo opcional al final)
            </label>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder={'Ana, Torres, 71234567\nLuis, Gómez, 72345678, luis.gomez@correo.com'}
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
          {result.tempPassword ? (
            <>
              <p className="font-black text-emerald-700 text-sm mb-1">Cuenta creada: {result.name}</p>
              <p className="text-sm text-emerald-800">
                Correo: <span className="font-mono font-bold">{result.email}</span> — Contraseña temporal:{' '}
                <span className="font-mono font-bold">{result.tempPassword}</span>
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                Anota esta contraseña ahora, no se volverá a mostrar. Compártela solo con esa persona: es temporal, y al entrar por primera vez tendrá que crear la suya.
              </p>
            </>
          ) : (
            <p className="font-black text-emerald-700 text-sm">
              {result.name} fue transferido a tu colegio. Su correo y contraseña no cambiaron.
            </p>
          )}
        </div>
      )}

      {bulkResults && (
        <div className="w-full">
          {createdRows.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Button onClick={downloadBulkCsv} color="green" className="px-4 py-2 text-xs">
                Descargar CSV ({createdRows.length})
              </Button>
              <Button onClick={copyBulk} color="slate" className="px-4 py-2 text-xs">
                {bulkCopied ? '¡Copiado!' : 'Copiar todo'}
              </Button>
            </div>
          )}
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
                  <td className="p-2 font-mono">{r.email || '—'}</td>
                  <td className="p-2 font-mono">{r.tempPassword || '—'}</td>
                  <td className={`p-2 font-bold ${r.status === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {r.status === 'ok' ? 'Creada' : r.error}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Descarga o copia estas contraseñas ahora: no se volverán a mostrar.
          </p>
        </div>
      )}
    </Card>
  );
};
