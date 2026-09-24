import React, { useEffect, useState } from 'react';
import { Card, Button } from './UI';
import { Icon } from './CustomIcons';
import { authedFetch } from '../lib/api';

type School = {
  id: number;
  name: string;
  slug: string;
  emailDomain: string | null;
  plan: string | null;
  status: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string | null;
  students: number;
  activeStudents: number;
  staff: number;
  activeStaff: number;
};

// The platform operator's view. It shows schools and headcounts — never a
// student row. Running the platform doesn't require knowing who studies at
// any of these schools, so that data simply isn't fetched.
export const PlatformConsole: React.FC<{ email?: string; onLogout: () => void }> = ({ email, onLogout }) => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);


  const load = async () => {
    try {
      const res = await authedFetch('/api/platform/schools');
      if (res.ok) {
        setSchools(await res.json());
        setError(null);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'No se pudieron cargar los colegios.');
      }
    } catch {
      setError('Error de conexión al cargar los colegios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (school: School, status: string) => {
    const suspending = status === 'suspended';
    const warning = suspending
      ? `¿Suspender a ${school.name}? Nadie del colegio podrá entrar hasta reactivarlo (${school.activeStudents} alumnos y ${school.activeStaff} del personal).`
      : `¿Reactivar a ${school.name}?`;
    if (!window.confirm(warning)) return;
    setBusyId(school.id);
    try {
      const res = await authedFetch(`/api/platform/schools/${school.id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      if (res.ok) { setError(null); load(); }
      else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'No se pudo cambiar el estado.');
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setBusyId(null);
    }
  };

  const savePlan = async (school: School, plan: string) => {
    if (!plan.trim() || plan.trim() === (school.plan || '')) return;
    try {
      const res = await authedFetch(`/api/platform/schools/${school.id}/plan`, {
        method: 'POST',
        body: JSON.stringify({ plan: plan.trim() }),
      });
      if (res.ok) { setError(null); load(); }
      else {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'No se pudo cambiar el plan.');
      }
    } catch {
      setError('Error de conexión.');
    }
  };

  const totals = schools.reduce(
    (acc, s) => ({
      schools: acc.schools + 1,
      active: acc.active + (s.status === 'active' ? 1 : 0),
      students: acc.students + s.activeStudents,
      staff: acc.staff + s.activeStaff,
    }),
    { schools: 0, active: 0, students: 0, staff: 0 }
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">Consola de plataforma</h1>
            <p className="text-xs text-slate-500 font-bold mt-1">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={load} color="slate" className="px-4 py-2 text-xs gap-2">
              <Icon name="refresh_cw" size={14} /> Actualizar
            </Button>
            <Button onClick={onLogout} color="red" className="px-4 py-2 text-xs">Cerrar sesión</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Colegios', value: totals.schools },
            { label: 'Activos', value: totals.active },
            { label: 'Alumnos activos', value: totals.students },
            { label: 'Personal activo', value: totals.staff },
          ].map((tile) => (
            <Card key={tile.label} className="p-4 !items-start !text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tile.label}</span>
              <span className="text-2xl font-black text-slate-800">{tile.value}</span>
            </Card>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 font-bold text-sm">
            <Icon name="alert" size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Card className="p-0 !items-start !text-left w-full overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[900px]">
              <thead>
                <tr className="bg-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                  <th className="p-4">Colegio</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4 text-center">Alumnos</th>
                  <th className="p-4 text-center">Personal</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">Cargando colegios...</td></tr>
                ) : schools.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">Todavía no hay colegios registrados.</td></tr>
                ) : schools.map((school) => {
                  const suspended = school.status !== 'active';
                  return (
                    <tr key={school.id} className={suspended ? 'bg-slate-50 opacity-70' : ''}>
                      <td className="p-4">
                        <div className="font-black text-slate-800">{school.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{school.emailDomain || `${school.slug}.alumno.com`}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-slate-600">{school.contactName || '—'}</div>
                        <div className="text-[11px] text-slate-400 font-mono break-all">{school.contactEmail || '—'}</div>
                        <div className="text-[11px] text-slate-400">{school.contactPhone || ''}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-black text-blue-600">{school.activeStudents}</span>
                        {school.students !== school.activeStudents && (
                          <span className="text-[11px] text-slate-400 block">de {school.students}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-black text-purple-600">{school.activeStaff}</span>
                        {school.staff !== school.activeStaff && (
                          <span className="text-[11px] text-slate-400 block">de {school.staff}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <input
                          defaultValue={school.plan || ''}
                          onBlur={(e) => savePlan(school, e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
                          className="w-28 px-2 py-1 text-xs rounded-lg border border-slate-200 hover:border-slate-300 focus:border-blue-400 outline-none bg-white"
                        />
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${suspended ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {suspended ? 'Suspendido' : 'Activo'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => setStatus(school, suspended ? 'active' : 'suspended')}
                          color={suspended ? 'green' : 'slate'}
                          disabled={busyId === school.id}
                          className="px-3 py-1.5 text-[11px]"
                        >
                          {suspended ? 'Reactivar' : 'Suspender'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-[11px] text-slate-400 font-medium">
          Esta consola no muestra datos de alumnos. Operar la plataforma no requiere saber quién estudia en cada colegio.
        </p>
      </div>
    </div>
  );
};
