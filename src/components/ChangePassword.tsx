import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ApiError, apiRequest } from '../lib/api';
import { passwordChecks, passwordProblem } from '../lib/password';
import { Icon } from './CustomIcons';

// One form, two situations:
// - forced: right after signing in with a temporary password (a new account,
//   or one the school just reset). Nothing else in the app opens until it's
//   done, because until then the password is one other people have seen.
// - voluntary: from the profile, whenever the person wants.

const WRONG_PASSWORD = new Set(['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials']);

const PasswordInput: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  autoComplete: string;
  autoFocus?: boolean;
}> = ({ id, label, value, onChange, show, autoComplete, autoFocus }) => (
  <label htmlFor={id} className="block">
    <span className="block text-[11px] text-slate-500 mb-1.5 tracking-widest uppercase font-bold">{label}</span>
    <input
      id={id}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      className="w-full rounded-xl py-3 px-4 border border-slate-300 bg-slate-50 font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
    />
  </label>
);

export const ChangePasswordForm: React.FC<{
  email: string;
  dni?: string | null;
  mode: 'forced' | 'voluntary';
  onDone: () => void;
  onCancel?: () => void;
}> = ({ email, dni, mode, onDone, onCancel }) => {
  // In the forced flow the person signed in seconds ago, so the server
  // accepts the change without the current password. It asks for it only
  // if the screen was left open too long — then this field appears.
  const [needsCurrent, setNeedsCurrent] = useState(mode === 'voluntary');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checks = passwordChecks(next, { email, dni });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (needsCurrent && !current) return setError('Escribe tu contraseña actual.');
    const problem = passwordProblem(next, { email, dni });
    if (problem) return setError(problem);
    if (next !== repeat) return setError('Las dos contraseñas nuevas no coinciden.');
    if (needsCurrent && current === next) return setError('La contraseña nueva tiene que ser distinta de la actual.');

    setBusy(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.');

      if (needsCurrent) {
        try {
          await reauthenticateWithCredential(user, EmailAuthProvider.credential(email, current));
          await user.getIdToken(true);
        } catch (err: any) {
          if (WRONG_PASSWORD.has(err?.code)) throw new Error('La contraseña actual no es correcta.');
          if (err?.code === 'auth/too-many-requests') throw new Error('Demasiados intentos. Espera unos minutos.');
          throw new Error('No se pudo comprobar tu contraseña actual. Revisa tu conexión.');
        }
      }

      try {
        await apiRequest('/api/user/password', 'No se pudo cambiar la contraseña.', {
          method: 'POST',
          body: JSON.stringify({ newPassword: next }),
        });
      } catch (err) {
        if (err instanceof ApiError && err.code === 'requires_recent_login') {
          setNeedsCurrent(true);
          throw new Error(mode === 'forced'
            ? 'Por seguridad, escribe también la contraseña con la que entraste.'
            : err.message);
        }
        throw err;
      }

      // The server changed the password, which ends this session's ability
      // to renew itself. Signing in again with the new one keeps the person
      // in, instead of being thrown out when the current token expires.
      await signInWithEmailAndPassword(auth, email, next).catch(() => {
        // The password did change; at worst they'll be asked to sign in
        // with it later. Not a reason to show an error now.
      });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña.');
    } finally {
      setBusy(false);
    }
  };

  const form = (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {/* Lets the browser's password manager save the new password against
          the right account. */}
      <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />

      {needsCurrent && (
        <PasswordInput
          id="pw-current"
          label={mode === 'forced' ? 'Contraseña con la que entraste' : 'Contraseña actual'}
          value={current}
          onChange={setCurrent}
          show={show}
          autoComplete="current-password"
          autoFocus
        />
      )}
      <PasswordInput
        id="pw-new"
        label="Contraseña nueva"
        value={next}
        onChange={setNext}
        show={show}
        autoComplete="new-password"
        autoFocus={!needsCurrent}
      />
      <ul className="space-y-1" aria-label="Requisitos de la contraseña">
        {checks.map((c) => (
          <li key={c.id} className={`flex items-center gap-2 text-xs font-bold ${c.ok ? 'text-emerald-600' : 'text-slate-400'}`}>
            <Icon name={c.ok ? 'check' : 'x'} size={14} />
            {c.label}
          </li>
        ))}
      </ul>
      <PasswordInput
        id="pw-repeat"
        label="Repite la contraseña nueva"
        value={repeat}
        onChange={setRepeat}
        show={show}
        autoComplete="new-password"
      />
      {repeat.length > 0 && repeat !== next && (
        <p className="text-xs font-bold text-amber-600">Todavía no coinciden.</p>
      )}

      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 cursor-pointer select-none">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="w-4 h-4 accent-blue-600" />
        Mostrar contraseñas
      </label>

      {error && (
        <p role="alert" className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold">
          <Icon name="alert" size={16} className="shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      <div className={mode === 'voluntary' ? 'flex gap-2' : ''}>
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-colors disabled:opacity-60"
        >
          {busy ? 'Guardando…' : mode === 'forced' ? 'Guardar y continuar' : 'Cambiar contraseña'}
        </button>
        {mode === 'voluntary' && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );

  if (mode === 'voluntary') return form;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-8 sm:p-10">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Icon name="key" size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crea tu contraseña</h1>
          <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
            Entraste con una contraseña temporal que te dio el colegio. Crea una que solo sepas tú: desde ahora
            entrarás con ella y la temporal dejará de funcionar.
          </p>
          <p className="text-xs text-slate-400 font-bold mt-3 break-all">Cuenta: {email}</p>
        </div>
        {form}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-2"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </div>
  );
};
