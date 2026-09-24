import React, { useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Icon } from './CustomIcons';
import { Avatar } from './Avatar';
import { ToastTone } from './Toast';
import { StudentDrawer } from './StudentDrawer';
import {
  accuracy,
  classroomOptions,
  countByStatus,
  filterStudents,
  type StatusFilter,
  type StudentRow,
} from '../lib/students';

// The list is for finding a student; everything you do to one happens in
// their drawer. The old table did both at once — every row carried eight
// one-click buttons, including one that dropped the student 20 levels.

const accuracyTone = (value: number | null) =>
  value === null ? 'text-slate-300' : value >= 70 ? 'text-emerald-600' : value >= 50 ? 'text-amber-600' : 'text-rose-600';

export const StudentManager: React.FC<{
  students: StudentRow[];
  sections: string[];
  loading: boolean;
  error: string | null;
  canManageEnrollment: boolean;
  isAdmin: boolean;
  onReload: () => void;
  onUpdated: (row: StudentRow) => void;
  onGoCreate?: () => void;
  notify: (text: string, tone?: ToastTone) => void;
}> = ({ students, sections, loading, error, canManageEnrollment, isAdmin, onReload, onUpdated, onGoCreate, notify }) => {
  const [query, setQuery] = useState('');
  const [classroom, setClassroom] = useState('all');
  const [status, setStatus] = useState<StatusFilter>('active');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  const counts = useMemo(() => countByStatus(students), [students]);
  const classrooms = useMemo(() => classroomOptions(students), [students]);
  const visible = useMemo(
    () => filterStudents(students, { query, classroom, status }),
    [students, query, classroom, status],
  );
  const selected = selectedUid ? students.find((s) => s.uid === selectedUid) : undefined;
  const filtered = query.trim() !== '' || classroom !== 'all';

  const clearFilters = () => {
    setQuery('');
    setClassroom('all');
    setStatus('active');
  };

  const statusTabs: { id: StatusFilter; label: string; count: number }[] = [
    { id: 'active', label: 'Activos', count: counts.active },
    { id: 'inactive', label: 'De baja', count: counts.inactive },
    { id: 'all', label: 'Todos', count: counts.total },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <label className="relative flex-1 min-w-0">
          <span className="sr-only">Buscar alumno</span>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon name="search" size={18} />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, correo o DNI"
            className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-800 outline-none focus:border-blue-400"
          />
        </label>
        <div className="flex gap-2">
          <select
            value={classroom}
            onChange={(e) => setClassroom(e.target.value)}
            aria-label="Filtrar por salón"
            className="flex-1 lg:flex-none min-w-0 px-3 py-3 rounded-2xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            <option value="all">Todos los salones</option>
            {classrooms.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="none">Sin salón</option>
          </select>
          <button
            onClick={onReload}
            disabled={loading}
            className="shrink-0 px-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 disabled:opacity-50"
            aria-label="Actualizar lista"
            title="Actualizar lista"
          >
            <Icon name="refresh_cw" size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100" role="tablist" aria-label="Estado de la cuenta">
          {statusTabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={status === t.id}
              onClick={() => setStatus(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors ${
                status === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label} <span className="text-slate-400">{t.count}</span>
            </button>
          ))}
        </div>
        {filtered && (
          <p className="text-xs font-bold text-slate-500">
            {visible.length} {visible.length === 1 ? 'resultado' : 'resultados'}
            <button onClick={clearFilters} className="ml-2 text-blue-600 underline underline-offset-2 hover:text-blue-800">
              Limpiar filtros
            </button>
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 font-bold text-sm">
          <Icon name="alert" size={18} className="shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button onClick={onReload} className="shrink-0 underline underline-offset-2 hover:text-rose-900">Reintentar</button>
        </div>
      )}

      <div className="rounded-3xl border-2 border-slate-100 bg-white overflow-hidden">
        <div className="hidden md:grid grid-cols-[minmax(0,1fr)_7rem_6rem_6rem_1.5rem] gap-4 px-5 py-3 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Alumno</span>
          <span>Salón</span>
          <span className="text-right">Resueltos</span>
          <span className="text-right">Aciertos</span>
          <span />
        </div>

        {loading && students.length === 0 ? (
          <p className="p-10 text-center font-bold text-slate-400">Cargando alumnos…</p>
        ) : students.length === 0 && !error ? (
          <div className="p-10 text-center space-y-3">
            <p className="font-black text-slate-700">Todavía no hay alumnos.</p>
            {canManageEnrollment && onGoCreate ? (
              <button onClick={onGoCreate} className="text-sm font-black text-blue-600 underline underline-offset-2">
                Crear las primeras cuentas
              </button>
            ) : (
              <p className="text-sm text-slate-500 font-medium">Aparecerán aquí cuando el colegio los matricule.</p>
            )}
          </div>
        ) : visible.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="font-black text-slate-700">
              {query.trim() ? `Ningún alumno coincide con “${query.trim()}”.` : 'No hay alumnos con estos filtros.'}
            </p>
            <button onClick={clearFilters} className="text-sm font-black text-blue-600 underline underline-offset-2">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {visible.map((s) => {
              const precision = accuracy(s.stats);
              const inactive = s.active === false;
              return (
                <li key={s.uid}>
                  <button
                    onClick={() => setSelectedUid(s.uid)}
                    className={`w-full text-left grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_7rem_6rem_6rem_1.5rem] items-center gap-3 md:gap-4 px-4 md:px-5 py-3 transition-colors hover:bg-blue-50/60 focus:bg-blue-50 outline-none ${
                      inactive ? 'opacity-60' : ''
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Avatar name={s.avatar || 'fox'} size={40} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="font-black text-slate-800 truncate">{s.name || 'Sin nombre'}</span>
                          {inactive && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-black uppercase tracking-wide">
                              De baja
                            </span>
                          )}
                        </span>
                        <span className="block text-xs font-medium text-slate-400 truncate">
                          {s.email}
                          <span className="md:hidden"> · {s.classroom || 'Sin salón'}</span>
                        </span>
                      </span>
                    </span>
                    <span className="hidden md:block text-sm font-bold text-slate-600 truncate">{s.classroom || '—'}</span>
                    <span className="hidden md:block text-right text-sm font-black text-slate-700">{s.stats?.solved ?? 0}</span>
                    <span className={`hidden md:block text-right text-sm font-black ${accuracyTone(precision)}`}>
                      {precision === null ? '—' : `${precision}%`}
                    </span>
                    <span className="text-slate-300 justify-self-end">
                      <Icon name="chevron_right" size={20} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <StudentDrawer
            key={selected.uid}
            student={selected}
            sections={sections}
            canManageEnrollment={canManageEnrollment}
            isAdmin={isAdmin}
            onClose={() => setSelectedUid(null)}
            onUpdated={onUpdated}
            notify={notify}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
