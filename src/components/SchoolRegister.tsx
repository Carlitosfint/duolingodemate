import React, { useState } from 'react';
import { Icon } from './CustomIcons';
import { playClickSound, playRevealSound } from '../utils/audio';

type Step = 'colegio' | 'contacto' | 'pago' | 'exito';

const STEPS: { id: Step; label: string }[] = [
  { id: 'colegio', label: 'Colegio' },
  { id: 'contacto', label: 'Director/a' },
  { id: 'pago', label: 'Activar' },
];

const ALIAS_REGEX = /^[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeDomain = (raw: string) => {
  let d = raw.trim().toLowerCase().replace(/^@/, '');
  if (d && !d.includes('.')) d += '.com';
  return d;
};

export const SchoolRegister: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<Step>('colegio');
  const [schoolName, setSchoolName] = useState('');
  const [emailAlias, setEmailAlias] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [ruc, setRuc] = useState('');
  const [studentsEstimate, setStudentsEstimate] = useState('');
  const [website, setWebsite] = useState(''); // honeypot — real users never see this field
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ email: string; tempPassword: string; schoolName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const domain = normalizeDomain(emailAlias);

  const goNextFromColegio = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const alias = emailAlias.trim();
    if (!schoolName.trim() || !alias) {
      setError('Completa el nombre del colegio y el alias de correo.');
      return;
    }
    if (!ALIAS_REGEX.test(alias)) {
      setError('El alias solo puede tener letras, números, puntos y guiones (ej. "aloe").');
      return;
    }
    playClickSound();
    setStep('contacto');
  };

  const goNextFromContacto = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setError('Nombre, correo y teléfono de contacto son obligatorios.');
      return;
    }
    if (!EMAIL_REGEX.test(contactEmail.trim())) {
      setError('Ingresa un correo de contacto válido.');
      return;
    }
    playClickSound();
    setStep('pago');
  };

  const handleConfirm = async () => {
    setError('');
    setLoading(true);
    playClickSound();
    try {
      const res = await fetch('/api/schools/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: schoolName.trim(),
          emailAlias: emailAlias.trim(),
          contactName: contactName.trim(),
          contactEmail: contactEmail.trim(),
          contactPhone: contactPhone.trim(),
          ruc: ruc.trim() || undefined,
          studentsEstimate: studentsEstimate.trim() || undefined,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo registrar el colegio.');
        setLoading(false);
        return;
      }
      playRevealSound();
      setResult({ email: data.admin.email, tempPassword: data.tempPassword, schoolName: data.school.name });
      setStep('exito');
    } catch {
      setError('Error de conexión. Revisa tu internet.');
    }
    setLoading(false);
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const copyCredentials = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(`Correo: ${result.email}\nContraseña temporal: ${result.tempPassword}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail silently (permissions/insecure context); the
      // credentials are still visible on screen to copy by hand.
    }
  };

  return (
    <div className="register-wrapper min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans py-10" style={{ backgroundColor: '#f8fafc' }}>
      <style>{`
        .register-wrapper {
          background-image:
            radial-gradient(at 0% 0%, rgba(0, 87, 255, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(138, 43, 226, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(253, 212, 0, 0.05) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(255, 0, 0, 0.05) 0px, transparent 50%);
          background-attachment: fixed;
        }
        .register-glass-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
          animation: registerSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes registerSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .register-floating-blob {
          position: absolute; filter: blur(80px); z-index: 0; opacity: 0.3;
          animation: registerFloat 10s infinite alternate ease-in-out;
        }
        .register-blob-1 { width: 400px; height: 400px; background: #0057ff; top: -100px; left: -100px; }
        .register-blob-2 { width: 300px; height: 300px; background: #8a2be2; bottom: -50px; right: -50px; animation-delay: -5s; }
        @keyframes registerFloat { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(30px, 30px) scale(1.1); } }
        .register-input {
          background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; transition: all 0.3s ease;
        }
        .register-input:focus {
          background: #ffffff; border-color: #0057ff;
          box-shadow: 0 0 0 4px rgba(0, 87, 255, 0.1);
        }
      `}</style>

      <div className="register-floating-blob register-blob-1 rounded-full"></div>
      <div className="register-floating-blob register-blob-2 rounded-full"></div>

      <div className="w-full max-w-lg px-6 relative z-10">
        <div className="register-glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden z-10 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center border-2 border-blue-100">
                <Icon name="building" size={30} className="text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl md:text-[28px] text-slate-900 mb-1 font-black tracking-tight">Registra tu colegio</h1>
            <p className="text-slate-500 text-sm font-medium">
              {step === 'exito' ? '¡Ya casi terminamos!' : 'Súmate a la plataforma en unos minutos'}
            </p>
          </div>

          {step !== 'exito' && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                      i < stepIndex ? 'bg-emerald-500 text-white' : i === stepIndex ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {i < stepIndex ? <Icon name="check" size={14} /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${i === stepIndex ? 'text-blue-600' : 'text-slate-400'}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`w-8 h-0.5 rounded-full mb-4 ${i < stepIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {step === 'colegio' && (
            <form onSubmit={goNextFromColegio} className="space-y-5">
              {/* Honeypot: hidden from real users (off-screen, not display:none,
                  not tabbable), catches bots that fill every field blindly. */}
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] w-px h-px opacity-0"
                name="website"
              />
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">Nombre del colegio</label>
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="register-input w-full rounded-xl py-3 px-4 focus:outline-none font-medium"
                  placeholder="Colegio Los Robles"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">Alias de correo para tus alumnos</label>
                <input
                  value={emailAlias}
                  onChange={(e) => setEmailAlias(e.target.value)}
                  className="register-input w-full rounded-xl py-3 px-4 focus:outline-none font-medium"
                  placeholder="aloe"
                  required
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Los correos de tus alumnos se verán así: <span className="font-mono">20264821@{domain || 'tu-alias.com'}</span>
                </p>
              </div>
              {error && <p className="text-sm font-bold text-red-600">{error}</p>}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-colors">
                Continuar
              </button>
            </form>
          )}

          {step === 'contacto' && (
            <form onSubmit={goNextFromContacto} className="space-y-5">
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">Nombre del director/a</label>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="register-input w-full rounded-xl py-3 px-4 focus:outline-none font-medium"
                  placeholder="Nombre completo"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">Correo de contacto</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="mail" size={18} />
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="register-input w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none font-medium"
                    placeholder="director@correo.com"
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Con este correo iniciarás sesión como administrador del colegio.</p>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">Teléfono de contacto</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="phone" size={18} />
                  </div>
                  <input
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="register-input w-full rounded-xl py-3 pl-11 pr-4 focus:outline-none font-medium"
                    placeholder="987 654 321"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">RUC (opcional)</label>
                  <input
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value)}
                    className="register-input w-full rounded-xl py-3 px-4 focus:outline-none font-medium"
                    placeholder="10123456789"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">N° de alumnos (aprox.)</label>
                  <input
                    type="number"
                    min={0}
                    value={studentsEstimate}
                    onChange={(e) => setStudentsEstimate(e.target.value)}
                    className="register-input w-full rounded-xl py-3 px-4 focus:outline-none font-medium"
                    placeholder="150"
                  />
                </div>
              </div>
              {error && <p className="text-sm font-bold text-red-600">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setError(''); setStep('colegio'); }} className="px-5 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                  Atrás
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-colors">
                  Continuar
                </button>
              </div>
            </form>
          )}

          {step === 'pago' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border-2 border-blue-100 bg-blue-50/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-slate-800">Plan Piloto</span>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-full">Próximamente pagos en línea</span>
                </div>
                <ul className="space-y-1.5 text-sm text-slate-600 font-medium">
                  <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-emerald-500 shrink-0" /> {schoolName || 'Tu colegio'}</li>
                  <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-emerald-500 shrink-0" /> Correos con alias @{domain}</li>
                  <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-emerald-500 shrink-0" /> Cuenta de administrador para {contactName || 'el director/a'}</li>
                </ul>
              </div>
              <p className="text-xs text-slate-400 text-center px-2">
                Todavía no cobramos en línea — tu colegio se activa de inmediato al confirmar. Más adelante te contactaremos para el plan de pago definitivo.
              </p>
              {error && <p className="text-sm font-bold text-red-600 text-center">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" disabled={loading} onClick={() => { setError(''); setStep('contacto'); }} className="px-5 py-3.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50">
                  Atrás
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleConfirm}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-md shadow-emerald-500/20 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  <Icon name="rocket" size={18} />
                  {loading ? 'Activando...' : 'Confirmar y crear mi cuenta'}
                </button>
              </div>
            </div>
          )}

          {step === 'exito' && result && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                  <Icon name="check" size={32} className="text-emerald-500" />
                </div>
              </div>
              <p className="font-black text-slate-800 text-lg">{result.schoolName} ya está en la plataforma</p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-left">
                <p className="font-black text-emerald-700 text-sm mb-2">Tu acceso de administrador</p>
                <p className="text-sm text-emerald-800">
                  Correo: <span className="font-mono font-bold">{result.email}</span>
                </p>
                <p className="text-sm text-emerald-800">
                  Contraseña temporal: <span className="font-mono font-bold">{result.tempPassword}</span>
                </p>
                <p className="text-xs text-emerald-600 mt-2">
                  Anota esta contraseña ahora, no se volverá a mostrar. Es temporal: al entrar por primera vez crearás la tuya.
                </p>
                <button
                  type="button"
                  onClick={copyCredentials}
                  className="mt-3 text-xs font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                >
                  {copied ? '¡Copiado!' : 'Copiar correo y contraseña'}
                </button>
              </div>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-colors"
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          )}

          {step !== 'exito' && (
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <button type="button" onClick={onBackToLogin} className="text-xs text-slate-400 font-medium hover:text-blue-600 transition-colors">
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
