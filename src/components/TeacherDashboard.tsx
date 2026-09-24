import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './CustomIcons';
import { Toast, ToastTone } from './Toast';
import { AdminCreateAccounts } from './AdminCreateAccounts';
import { SchoolSettings } from './SchoolSettings';
import { SchoolStaff } from './SchoolStaff';
import { ClassroomMistakes } from './ClassroomMistakes';
import { StudentManager } from './StudentManager';
import { apiRequest } from '../lib/api';
import { classroomOptions, type StudentRow } from '../lib/students';

// This used to be one long page that stacked school settings, the account
// creation form and the staff roster above the student list — so the thing
// used every day sat at the bottom, under everything used once a year.
// Each of those is now a tab, and the student list is the first one.

type TabId = 'students' | 'mistakes' | 'create' | 'staff' | 'school';

const TITLES: Record<string, string> = {
  admin: 'Panel del administrador',
  secretary: 'Panel de secretaría',
  teacher: 'Panel del profesor',
};

export const TeacherDashboard: React.FC<{ currentUserRole?: string; currentUserUid?: string }> = ({ currentUserRole, currentUserUid }) => {
  const isAdmin = currentUserRole === 'admin';
  // Enrollment (who a student is, where they're registered, their access)
  // belongs to the admin and the secretary, not to every teacher.
  const canManageEnrollment = isAdmin || currentUserRole === 'secretary';

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'students', label: 'Alumnos', icon: 'users' },
    { id: 'mistakes', label: 'Errores del salón', icon: 'book_x' },
    ...(canManageEnrollment ? [{ id: 'create' as const, label: 'Crear cuentas', icon: 'plus' }] : []),
    ...(isAdmin
      ? [
          { id: 'staff' as const, label: 'Personal', icon: 'teacher' },
          { id: 'school' as const, label: 'Colegio', icon: 'building' },
        ]
      : []),
  ];

  const [tab, setTab] = useState<TabId>('students');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mistakesClassroom, setMistakesClassroom] = useState('');

  const [toast, setToast] = useState<{ text: string; tone: ToastTone } | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((text: string, tone: ToastTone = 'info') => {
    window.clearTimeout(toastTimer.current);
    setToast({ text, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), 3500);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rows, school] = await Promise.all([
        apiRequest<StudentRow[]>('/api/teacher/students', 'No se pudo cargar la lista de alumnos.'),
        // The section list only feeds the enrollment form; without it the
        // list still works, so its failure isn't worth an error banner.
        apiRequest<{ sections?: string[] }>('/api/school', '').catch(() => null),
      ]);
      setStudents(rows);
      if (school) setSections(Array.isArray(school.sections) ? school.sections : []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la lista de alumnos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Accounts are created, and sections configured, in other tabs. Coming
  // back to the list shows them without having to press refresh.
  const openTab = (id: TabId) => {
    if (id === 'students' && tab !== 'students') load();
    setTab(id);
  };

  const updateRow = useCallback((row: StudentRow) => {
    setStudents((prev) => prev.map((s) => (s.uid === row.uid ? { ...s, ...row } : s)));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Out of the main column for the same reason as the student drawer,
          and so it shows above that drawer rather than behind it. */}
      {createPortal(<Toast toast={toast} />, document.body)}

      <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
        {TITLES[currentUserRole || ''] || 'Panel del colegio'}
      </h2>

      <nav
        role="tablist"
        aria-label="Secciones del panel"
        className="flex gap-1 overflow-x-auto no-scrollbar border-b-2 border-slate-100"
      >
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => openTab(t.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-3 -mb-0.5 border-b-2 font-black text-sm transition-colors ${
                active ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          );
        })}
      </nav>

      <div role="tabpanel">
        {tab === 'students' && (
          <StudentManager
            students={students}
            sections={sections}
            loading={loading}
            error={error}
            canManageEnrollment={canManageEnrollment}
            isAdmin={isAdmin}
            onReload={load}
            onUpdated={updateRow}
            onGoCreate={canManageEnrollment ? () => openTab('create') : undefined}
            notify={notify}
          />
        )}

        {tab === 'mistakes' && (
          <div className="space-y-4">
            <select
              value={mistakesClassroom}
              onChange={(e) => setMistakesClassroom(e.target.value)}
              aria-label="Salón"
              className="px-3 py-3 rounded-2xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="">Todos los salones</option>
              {classroomOptions(students).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ClassroomMistakes classroom={mistakesClassroom} />
          </div>
        )}

        {tab === 'create' && <AdminCreateAccounts canManageStaff={isAdmin} />}
        {tab === 'staff' && <SchoolStaff currentUserUid={currentUserUid} />}
        {tab === 'school' && <SchoolSettings />}
      </div>
    </div>
  );
};
