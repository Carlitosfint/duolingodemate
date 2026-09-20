import React, { useEffect, useState } from 'react';
import { Card, Button } from './UI';
import { Icon } from './CustomIcons';
import { auth } from '../lib/firebase.ts';

type Staff = {
  uid: string;
  name: string | null;
  email: string;
  role: string | null;
  active: boolean;
  classrooms?: string[];
};

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  secretary: 'Secretario',
  teacher: 'Profesor',
};

// The admin could create a teacher and then never see that account again:
// no way to reset their password or give them leave. This is that roster.
export const SchoolStaff: React.FC<{ currentUserUid?: string }> = ({ currentUserUid }) => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<{ name: string; email: string; tempPassword: string } | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const authedFetch = async (url: string, options: RequestInit = {}) => {
    const user = auth.currentUser;
    if (!user) throw new Error('no-session');
    const token = await user.getIdToken();
    return fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) },
    });
  };

  const load = async () => {
    try {
      const res = await authedFetch('/api/admin/staff');
      if (res.ok) {
        setStaff(await res.json());
        setError(null);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'No se pudo cargar el personal.');
      }
    } catch (e) {
      setError(e instanceof Error && e.message === 'no-session'
        ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
        : 'Error de conexión al cargar el personal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Empty means the whole school, which is what a small school with one
  // teacher wants and what keeps every existing account working as before.
  const saveClassrooms = async (person: Staff, raw: string) => {
    const classrooms = raw.split(',').map((c) => c.trim()).filter(Boolean);
    const current = person.classrooms || [];
    if (classrooms.join('|') === current.join('|')) return;
    try {
      const res = await authedFetch(`/api/admin/users/${person.uid}/classrooms`, {
        method: 'POST',
        body: JSON.stringify({ classrooms }),
      });
      if (res.ok) {
        setError(null);
        load();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'No se pudieron guardar los salones.');
      }
    } catch {
      setError('Error de conexión al guardar los salones.');
    }
  };

  const act = async (person: Staff, action: 'reset' | 'toggle') => {
    const confirmText = action === 'reset'
      ? `¿Restablecer la contraseña de ${person.name}? La anterior dejará de funcionar.`
      : `¿Seguro que quieres ${person.active ? 'dar de baja a' : 'reactivar a'} ${person.name}?`;
    if (!window.confirm(confirmText)) return;

    setBusyUid(person.uid);
    setNewPassword(null);
    try {
      const res = action === 'reset'
        ? await authedFetch(`/api/admin/users/${person.uid}/reset-password`, { method: 'POST' })
        : await authedFetch(`/api/admin/users/${person.uid}/active`, {
            method: 'POST',
            body: JSON.stringify({ active: !person.active }),
          });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || 'No se pudo completar la acción.');
        return;
      }
      setError(null);
      if (action === 'reset') setNewPassword(body);
      else load();
    } catch (e) {
      setError(e instanceof Error && e.message === 'no-session'
        ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
        : 'Error de conexión.');
    } finally {
      setBusyUid(null);
    }
  };

  if (loading) {
    return <Card className="p-6 !items-start !text-left w-full"><p className="font-bold text-slate-500">Cargando personal...</p></Card>;
  }

  return (
    <Card className="p-6 md:p-8 !items-start !text-left w-full space-y-4">
      <div className="flex items-center justify-between w-full flex-wrap gap-3">
        <h3 className="text-xl font-black text-slate-800">Personal del colegio</h3>
        <Button onClick={load} color="slate" className="px-4 py-2 text-xs gap-2">
          <Icon name="refresh_cw" size={14} />
          Actualizar
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 font-bold text-sm w-full">
          <Icon name="alert" size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {newPassword && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 w-full">
          <p className="font-black text-emerald-800 text-sm mb-1">Contraseña restablecida: {newPassword.name}</p>
          <p className="text-sm text-emerald-900">
            Correo: <span className="font-mono font-bold">{newPassword.email}</span> — Nueva contraseña:{' '}
            <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">{newPassword.tempPassword}</span>
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => navigator.clipboard?.writeText(newPassword.tempPassword).catch(() => {})}
              className="text-xs font-black text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              Copiar contraseña
            </button>
            <button
              onClick={() => setNewPassword(null)}
              className="text-xs font-black text-slate-500 underline underline-offset-2 hover:text-slate-700"
            >
              Ocultar
            </button>
          </div>
          <p className="text-[11px] text-emerald-700 mt-2">Anótala ahora, no se volverá a mostrar.</p>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[620px]">
          <thead>
            <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
              <th className="p-3 rounded-tl-2xl">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Salones</th>
              <th className="p-3 text-center rounded-tr-2xl">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
            {staff.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">Aún no hay personal registrado.</td></tr>
            ) : staff.map((person) => {
              const isSelf = person.uid === currentUserUid;
              return (
                <tr key={person.uid} className={person.active ? '' : 'bg-slate-50 opacity-60'}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-800">{person.name || '—'}</span>
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-widest">Tú</span>
                      )}
                      {!person.active && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-widest">De baja</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 font-medium font-mono text-xs break-all">{person.email}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider">
                      {ROLE_LABEL[person.role || ''] || person.role}
                    </span>
                  </td>
                  <td className="p-3">
                    {person.role === 'teacher' ? (
                      <input
                        defaultValue={(person.classrooms || []).join(', ')}
                        onBlur={(e) => saveClassrooms(person, e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                        placeholder="Todos"
                        className="w-40 px-2 py-1 text-xs rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-400 outline-none bg-white"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">Todo el colegio</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      {/* Your own account goes through the login's email flow,
                          which works for staff: they sign in with a real address. */}
                      {isSelf ? (
                        <span className="text-[11px] text-slate-400 font-medium italic">Usa el login</span>
                      ) : (
                        <>
                          <button
                            onClick={() => act(person, 'reset')}
                            disabled={busyUid === person.uid}
                            className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-40"
                            title="Restablecer contraseña"
                          >
                            <Icon name="key" size={14} />
                          </button>
                          <button
                            onClick={() => act(person, 'toggle')}
                            disabled={busyUid === person.uid}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-40 ${person.active ? 'bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                            title={person.active ? 'Dar de baja' : 'Reactivar cuenta'}
                          >
                            <Icon name={person.active ? 'user_minus' : 'user_check'} size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
