import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Icon } from './CustomIcons';
import { Avatar } from './Avatar';
import { ToastTone } from './Toast';
import { apiRequest } from '../lib/api';
import { VALID_GRADES } from '../lib/validation';
import {
  accuracy,
  courseProgressFor,
  enrollmentChanges,
  enrollmentDraftFrom,
  enrollmentProblem,
  type EnrollmentDraft,
  type StudentRow,
} from '../lib/students';

// Everything about one student, and every action on them, in one place.
// It replaces editing straight in the table, where a DNI or a name was
// saved the moment the field lost focus: one stray click and the change was
// in, with nothing saying it had happened.

const Section: React.FC<{ title: string; children: React.ReactNode; hint?: string }> = ({ title, children, hint }) => (
  <section className="space-y-3">
    <div>
      <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
      {hint && <p className="text-xs text-slate-500 font-medium mt-1">{hint}</p>}
    </div>
    {children}
  </section>
);

// Destructive actions ask inline instead of through window.confirm, which
// blocks the page and on a phone shows the raw hostname as its title.
const ConfirmAction: React.FC<{
  label: string;
  question: string;
  confirmLabel: string;
  icon: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
}> = ({ label, question, confirmLabel, icon, danger, busy, onConfirm }) => {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button
        onClick={() => setAsking(true)}
        disabled={busy}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 font-black text-sm transition-colors disabled:opacity-50 ${
          danger
            ? 'border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700'
            : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
        }`}
      >
        <Icon name={icon} size={18} />
        {busy ? 'Un momento…' : label}
      </button>
    );
  }
  return (
    <div className={`p-4 rounded-2xl border-2 space-y-3 ${danger ? 'border-rose-200 bg-rose-50' : 'border-blue-200 bg-blue-50'}`}>
      <p className={`text-sm font-bold ${danger ? 'text-rose-800' : 'text-blue-900'}`}>{question}</p>
      <div className="flex gap-2">
        <button
          onClick={() => { setAsking(false); onConfirm(); }}
          className={`flex-1 px-4 py-2.5 rounded-xl font-black text-sm text-white ${danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {confirmLabel}
        </button>
        <button
          onClick={() => setAsking(false)}
          className="flex-1 px-4 py-2.5 rounded-xl font-black text-sm bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: React.ReactNode; tone?: string }> = ({ label, value, tone = 'text-slate-800' }) => (
  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
    <div className={`text-xl font-black ${tone}`}>{value}</div>
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{label}</div>
  </div>
);

const inputClass =
  'w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 bg-white font-bold text-sm text-slate-800 outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-500';

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export const StudentDrawer: React.FC<{
  student: StudentRow;
  sections: string[];
  canManageEnrollment: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onUpdated: (row: StudentRow) => void;
  notify: (text: string, tone?: ToastTone) => void;
}> = ({ student, sections, canManageEnrollment, isAdmin, onClose, onUpdated, notify }) => {
  const [busy, setBusy] = useState<string | null>(null);
  const [draft, setDraft] = useState<EnrollmentDraft>(() => enrollmentDraftFrom(student));
  const [formError, setFormError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // A new student means a new form. Deliberately not reset on every update
  // of the same student: giving coins shouldn't wipe a half-typed name.
  useEffect(() => {
    setDraft(enrollmentDraftFrom(student));
    setFormError(null);
    setNewPassword(null);
  }, [student.uid]);

  // Focus moves in once, on open. Tying it to onClose would re-run it on
  // every parent render — a toast disappearing would yank the cursor out of
  // the field the person is typing in.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const firstName = (student.name || 'el alumno').split(' ')[0];
  const inactive = student.active === false;

  const run = async <T,>(key: string, action: () => Promise<T>): Promise<T | undefined> => {
    setBusy(key);
    try {
      return await action();
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Algo salió mal.', 'warn');
      return undefined;
    } finally {
      setBusy(null);
    }
  };

  const patch = (key: string, updates: Record<string, unknown>, success: string) =>
    run(key, async () => {
      const row = await apiRequest<StudentRow>(`/api/teacher/student/${student.uid}`, 'No se pudo guardar el cambio.', {
        method: 'POST',
        body: JSON.stringify(updates),
      });
      onUpdated(row);
      notify(success);
      return row;
    });

  const changes = enrollmentChanges(student, draft);
  const dirty = Object.keys(changes).length > 0;

  const saveEnrollment = async () => {
    const problem = enrollmentProblem(changes);
    if (problem) {
      setFormError(problem);
      return;
    }
    setFormError(null);
    const row = await patch('enrollment', changes, 'Datos de matrícula guardados.');
    if (row) setDraft(enrollmentDraftFrom(row));
  };

  const resetPassword = () =>
    run('reset', async () => {
      const body = await apiRequest<{ tempPassword: string }>(
        `/api/admin/users/${student.uid}/reset-password`,
        'No se pudo restablecer la contraseña.',
        { method: 'POST' },
      );
      setNewPassword(body.tempPassword);
    });

  const setActive = (active: boolean) =>
    run('active', async () => {
      const body = await apiRequest<{ user: StudentRow }>(
        `/api/admin/users/${student.uid}/active`,
        'No se pudo actualizar el estado de la cuenta.',
        { method: 'POST', body: JSON.stringify({ active }) },
      );
      onUpdated(body.user);
      notify(active ? `${firstName} puede volver a entrar.` : `${firstName} quedó de baja. Su historial se conserva.`);
    });

  const copyPassword = () => {
    if (!newPassword) return;
    navigator.clipboard?.writeText(newPassword)
      .then(() => notify('Contraseña copiada.'))
      .catch(() => notify('No se pudo copiar. Anótala a mano.', 'warn'));
  };

  // The section list is the school's; a legacy value typed by hand before
  // sections were configured still shows, so opening the form never
  // silently changes it.
  const sectionOptions = Array.from(new Set([...sections, ...(student.section ? [student.section] : [])]));
  const precision = accuracy(student.stats);
  const mistakes = student.mistakes ?? [];

  // Portaled to <body>: rendered in place, the panel sits inside the app's
  // main column, whose stacking context capped its z-index — the floating
  // audio button was drawn on top of it.
  return createPortal(
    <div className="fixed inset-0 z-[900] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="student-drawer-title">
      <motion.div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
      >
        <header className="flex items-start gap-4 p-5 sm:p-6 border-b border-slate-100 shrink-0">
          <Avatar name={student.avatar || 'fox'} size={56} />
          <div className="min-w-0 flex-1">
            <h2 id="student-drawer-title" className="text-xl font-black text-slate-800 leading-tight break-words">
              {student.name || 'Sin nombre'}
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1 break-all">{student.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black">
                {student.classroom || 'Sin salón'}
              </span>
              {inactive && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-wide">
                  De baja
                </span>
              )}
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-2 -m-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <Icon name="x" size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
          <Section title="Avance">
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Resueltos" value={student.stats?.solved ?? 0} tone="text-emerald-600" />
              <Stat
                label="Aciertos"
                value={precision === null ? '—' : `${precision}%`}
                tone={precision === null ? 'text-slate-400' : precision >= 70 ? 'text-emerald-600' : precision >= 50 ? 'text-amber-600' : 'text-rose-600'}
              />
              <Stat label="Mejor racha" value={student.stats?.maxStreak ?? 0} tone="text-orange-500" />
            </div>
            <div className="space-y-2.5">
              {courseProgressFor(student).map((course) => (
                <div key={course.id}>
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <span className="text-sm font-bold text-slate-700">{course.name}</span>
                    <span className="text-xs font-black text-slate-500 shrink-0">Nivel {course.level} de 100</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, course.level)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="Premiar"
            hint={`${firstName} tiene ${student.coins ?? 0} monedas y ${student.tickets ?? 0} tickets.`}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => patch('coins', { coins: (student.coins ?? 0) + 100 }, `+100 monedas para ${firstName}.`)}
                disabled={busy !== null || inactive}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-800 font-black text-sm hover:bg-amber-100 disabled:opacity-50"
              >
                <Icon name="coins" size={18} /> +100 monedas
              </button>
              <button
                onClick={() => patch('tickets', { tickets: (student.tickets ?? 0) + 5 }, `+5 tickets para ${firstName}.`)}
                disabled={busy !== null || inactive}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-800 font-black text-sm hover:bg-blue-100 disabled:opacity-50"
              >
                <Icon name="ticket" size={18} /> +5 tickets
              </button>
            </div>
          </Section>

          <Section
            title="Errores recientes"
            hint={mistakes.length === 0 ? undefined : `${mistakes.length} ${mistakes.length === 1 ? 'ejercicio fallado' : 'ejercicios fallados'} guardados.`}
          >
            {mistakes.length === 0 ? (
              <p className="text-sm text-slate-500 font-medium">Todavía no ha fallado ningún ejercicio, o aún no ha practicado.</p>
            ) : (
              <ul className="space-y-2">
                {mistakes.slice(0, 5).map((m, i) => (
                  <li key={i} className="p-3 rounded-2xl border border-slate-100 bg-slate-50 space-y-1.5">
                    {m.topic && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wide">
                        {m.topic}
                      </span>
                    )}
                    <p className="text-sm text-slate-700 font-medium leading-snug">{truncate(m.problem || '', 160)}</p>
                    <p className="text-xs font-bold text-slate-500">
                      Respondió <span className="text-rose-600">{m.userAnswer || '—'}</span>
                      {' · '}correcta <span className="text-emerald-600">{m.correctAnswer || '—'}</span>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            title="Matrícula"
            hint={canManageEnrollment ? undefined : 'Estos datos los cambia el administrador o el secretario.'}
          >
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-black text-slate-500">Nombre completo</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  disabled={!canManageEnrollment}
                  className={`${inputClass} mt-1`}
                />
              </label>
              {canManageEnrollment && (
                <label className="block">
                  <span className="text-xs font-black text-slate-500">DNI</span>
                  <input
                    value={draft.dni}
                    onChange={(e) => setDraft({ ...draft, dni: e.target.value })}
                    inputMode="numeric"
                    className={`${inputClass} mt-1 font-mono`}
                  />
                </label>
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-black text-slate-500">Grado</span>
                  <select
                    value={draft.grade}
                    onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
                    disabled={!canManageEnrollment}
                    className={`${inputClass} mt-1`}
                  >
                    {!student.grade && <option value="">Sin grado</option>}
                    {VALID_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-black text-slate-500">Sección</span>
                  <select
                    value={draft.section}
                    onChange={(e) => setDraft({ ...draft, section: e.target.value })}
                    disabled={!canManageEnrollment}
                    className={`${inputClass} mt-1`}
                  >
                    <option value="">Sin sección</option>
                    {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              {canManageEnrollment && sections.length === 0 && (
                <p className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  Tu colegio todavía no tiene secciones.{' '}
                  {isAdmin ? 'Agrégalas en la pestaña Colegio.' : 'Pídele al administrador que las configure.'}
                </p>
              )}
              {formError && <p className="text-sm font-bold text-rose-600">{formError}</p>}
              {canManageEnrollment && (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={saveEnrollment}
                    disabled={!dirty || busy !== null}
                    className="flex-1 px-4 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
                  >
                    {busy === 'enrollment' ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                  {dirty && (
                    <button
                      onClick={() => { setDraft(enrollmentDraftFrom(student)); setFormError(null); }}
                      disabled={busy !== null}
                      className="px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50"
                    >
                      Descartar
                    </button>
                  )}
                </div>
              )}
            </div>
          </Section>

          {canManageEnrollment && (
            <Section title="Cuenta">
              <div className="space-y-2">
                {newPassword ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 space-y-2">
                    <p className="text-sm font-black text-emerald-800">Nueva contraseña de {firstName}</p>
                    <div className="flex items-center gap-2">
                      <span className="flex-1 font-mono font-black text-lg text-emerald-900 bg-white px-3 py-2 rounded-xl border border-emerald-200 select-all">
                        {newPassword}
                      </span>
                      <button
                        onClick={copyPassword}
                        className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                        aria-label="Copiar contraseña"
                      >
                        <Icon name="copy" size={18} />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-emerald-700">
                      Anótala ahora: no se vuelve a mostrar. Entrégasela solo a {firstName}.
                    </p>
                  </div>
                ) : (
                  <ConfirmAction
                    label="Restablecer contraseña"
                    question={`La contraseña actual de ${firstName} dejará de funcionar y se generará una nueva.`}
                    confirmLabel="Restablecer"
                    icon="key"
                    busy={busy === 'reset'}
                    onConfirm={resetPassword}
                  />
                )}
                {inactive ? (
                  <ConfirmAction
                    label="Reactivar cuenta"
                    question={`${firstName} podrá volver a iniciar sesión con su contraseña de siempre.`}
                    confirmLabel="Reactivar"
                    icon="user_check"
                    busy={busy === 'active'}
                    onConfirm={() => setActive(true)}
                  />
                ) : (
                  <ConfirmAction
                    label="Dar de baja"
                    question={`${firstName} no podrá iniciar sesión. Su historial se conserva y puedes reactivarlo cuando quieras.`}
                    confirmLabel="Dar de baja"
                    icon="user_minus"
                    danger
                    busy={busy === 'active'}
                    onConfirm={() => setActive(false)}
                  />
                )}
              </div>
            </Section>
          )}
        </div>
      </motion.aside>
    </div>,
    document.body,
  );
};
