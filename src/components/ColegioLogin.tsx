import React, { useState, useRef } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { Icon } from './CustomIcons';
import { playClickSound, playErrorAlertSound, playRevealSound } from '../utils/audio';
import { auth } from '../lib/firebase';

// "No account with that email" and "wrong password" read the same on
// purpose: telling them apart confirms which addresses exist — and student
// addresses are just a year and four digits, easy to go through one by one.
const WRONG_CREDENTIALS = 'Correo o contraseña incorrectos.';
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Ese correo no tiene un formato válido. Revísalo.',
  'auth/user-disabled': 'Esta cuenta está dada de baja. Si crees que es un error, habla con secretaría.',
  'auth/user-not-found': WRONG_CREDENTIALS,
  'auth/wrong-password': WRONG_CREDENTIALS,
  'auth/invalid-credential': WRONG_CREDENTIALS,
  'auth/invalid-login-credentials': WRONG_CREDENTIALS,
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/too-many-requests': 'Demasiados intentos seguidos. Espera unos minutos y vuelve a intentarlo.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
};

const getAuthErrorMessage = (code?: string) =>
  (code && AUTH_ERROR_MESSAGES[code]) || 'Ocurrió un error. Intenta de nuevo.';

export const ColegioLogin: React.FC<{ onLoginSuccess: () => void; onRegisterSchool: () => void }> = ({ onLoginSuccess, onRegisterSchool }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'error' | 'success'>('error');
  const [forgot, setForgot] = useState<null | 'choose' | 'student' | 'staff' | 'sent'>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSending, setResetSending] = useState(false);
  const [revealingHole, setRevealingHole] = useState(false);
  const [fadingUI, setFadingUI] = useState(false);

  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);
  const circle4Ref = useRef<HTMLDivElement>(null);
  const circle5Ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showMessage = (message: string, variant: 'error' | 'success' = 'error') => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const triggerErrorShake = () => {
    const circles = [circle1Ref.current, circle2Ref.current, circle3Ref.current, circle4Ref.current, circle5Ref.current];
    if (containerRef.current) containerRef.current.style.zIndex = '9998';

    circles.forEach((c) => {
      if (c) {
        c.style.animation = 'none';
        c.style.transform = 'translate(-50%, 50%)';
        c.style.transition = 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)';
      }
    });

    // reflow
    void circles[0]?.offsetWidth;

    circles.forEach((c, i) => {
      setTimeout(() => {
        if (c) c.style.transform = 'translate(-50%, 50%) scale(1.3)';
      }, i * 20);
    });

    setTimeout(() => {
      circles.forEach((c, i) => {
        setTimeout(() => {
          if (c) c.style.transform = 'translate(-50%, 50%)';
        }, i * 20);
      });
    }, 200);

    setTimeout(() => {
      if (containerRef.current) containerRef.current.style.zIndex = '40';
    }, 400);
  };

  const triggerSuccessExpand = () => {
    setFadingUI(true);
    if (cardRef.current) {
      cardRef.current.style.transition = 'opacity 0.35s ease';
      cardRef.current.style.opacity = '0';
    }
    if (containerRef.current) containerRef.current.style.zIndex = '9999';

    const circles = [circle1Ref.current, circle2Ref.current, circle3Ref.current, circle4Ref.current, circle5Ref.current];
    playRevealSound();

    circles.forEach((c, i) => {
      setTimeout(() => {
        if (c) c.classList.add('expand');
      }, i * 85);
    });

    // Una vez que el 5.º círculo (azul #000066) cubre la pantalla, se abre un
    // círculo transparente desde su interior mostrando directamente la pantalla siguiente.
    setTimeout(() => {
      setRevealingHole(true);
      const container = containerRef.current;
      if (!container) {
        onLoginSuccess();
        return;
      }
      const maxRadius = Math.hypot(window.innerWidth, window.innerHeight) * 1.15;
      const duration = 850;
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Smooth cubic-bezier-like easeInOut
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const r = eased * maxRadius;
        const mask = `radial-gradient(circle at 50% 100%, transparent ${r}px, black ${r + 1.5}px)`;
        container.style.webkitMaskImage = mask;
        container.style.maskImage = mask;
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          onLoginSuccess();
        }
      };

      requestAnimationFrame(step);
    }, 1050);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      triggerSuccessExpand();
    } catch (err: any) {
      setLoading(false);
      playErrorAlertSound();
      showMessage(getAuthErrorMessage(err?.code));
      triggerErrorShake();
    }
  };

  const openForgot = () => {
    playClickSound();
    setResetEmail(email.trim());
    setForgot('choose');
  };

  const sendStaffReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = resetEmail.trim();
    if (!target) {
      showMessage('Escribe tu correo.');
      return;
    }
    setResetSending(true);
    try {
      await sendPasswordResetEmail(auth, target);
      setForgot('sent');
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found') setForgot('sent');
      else showMessage(getAuthErrorMessage(err?.code));
    } finally {
      setResetSending(false);
    }
  };

  return (
    <div
      className={`${revealingHole ? '' : 'login-wrapper'} fixed inset-0 w-full flex items-center justify-center overflow-hidden font-sans z-[9999]`}
      style={{ backgroundColor: revealingHole ? 'transparent' : '#f8fafc', pointerEvents: fadingUI ? 'none' : 'auto' }}
    >
      <style>{`
        .login-wrapper {
          background-image:
            radial-gradient(at 0% 0%, rgba(0, 87, 255, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(138, 43, 226, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(253, 212, 0, 0.05) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(255, 0, 0, 0.05) 0px, transparent 50%);
          background-attachment: fixed;
        }

        .login-glass-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 12px 44px -10px rgba(15, 23, 42, 0.08);
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(40px);
        }

        .circle {
          position: absolute; bottom: 0; left: 50%; border-radius: 50%;
          transform: translate(-50%, 150%);
          animation: popUpCircle 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .login-side-note {
          opacity: 0;
          animation: fadeNote 0.6s ease-out 0.7s forwards;
        }
        @keyframes fadeNote { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes popUpCircle { to { transform: translate(-50%, 50%); } }

        .circles-container {
          position: fixed; inset: 0; z-index: 40; pointer-events: none; overflow: hidden;
        }
        .circle-1 { width: 350px; height: 350px; background-color: #ffcc00; animation-delay: 0.2s; }
        .circle-2 { width: 310px; height: 310px; background-color: #ff6600; animation-delay: 0.3s; }
        .circle-3 { width: 270px; height: 270px; background-color: #cc0000; animation-delay: 0.4s; }
        .circle-4 { width: 230px; height: 230px; background-color: #660066; animation-delay: 0.5s; }
        .circle-5 { width: 190px; height: 190px; background-color: #000066; animation-delay: 0.6s; }

        .circle.expand {
          animation: expandCircle 0.95s cubic-bezier(0.65, 0, 0.35, 1) forwards !important;
        }
        @keyframes expandCircle {
          from { transform: translate(-50%, 50%) scale(1); }
          to { transform: translate(-50%, 50%) scale(35); opacity: 1; }
        }

        .input-light {
          background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; transition: all 0.3s ease;
        }
        .input-light:focus {
          background: #ffffff; border-color: #0057ff;
          box-shadow: 0 0 0 4px rgba(0, 87, 255, 0.1);
        }

        .floating-blob {
          position: absolute; filter: blur(80px); z-index: 0; opacity: 0.3;
          animation: float 10s infinite alternate ease-in-out;
        }
        .blob-1 { width: 400px; height: 400px; background: #0057ff; top: -100px; left: -100px; }
        .blob-2 { width: 300px; height: 300px; background: #8a2be2; bottom: -50px; right: -50px; animation-delay: -5s; }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 30px) scale(1.1); }
        }

        .toast-notification {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(-20px);
          opacity: 0;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .toast-notification.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      `}</style>

      {!revealingHole && (
        <>
          <div className="floating-blob blob-1 rounded-full"></div>
          <div className="floating-blob blob-2 rounded-full"></div>
        </>
      )}

      {/* Toast Notification */}
      <div className={`toast-notification px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 border ${
        toastVariant === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'
      } ${showToast ? 'show' : ''}`}>
        <Icon name={toastVariant === 'success' ? 'check' : 'zap'} size={20} className={toastVariant === 'success' ? 'text-emerald-600' : 'text-red-600'} />
        <p className="font-medium text-sm">{toastMessage}</p>
      </div>

      <div className="circles-container" ref={containerRef}>
        <div ref={circle1Ref} className="circle circle-1"></div>
        <div ref={circle2Ref} className="circle circle-2"></div>
        <div ref={circle3Ref} className="circle circle-3"></div>
        <div ref={circle4Ref} className="circle circle-4"></div>
        <div ref={circle5Ref} className="circle circle-5"></div>
      </div>

      {/* Cuadro blanco alargado hacia abajo (pb-28 / pb-32) pero desplazado un poco hacia arriba (-mt-6)
          para que el botón Iniciar Sesión quede arriba y los 5 círculos (z-40) se superpongan
          sobre la base del cuadro blanco (z-30), logrando el efecto escalonado. */}
      <div className="w-full max-w-md px-6 -mt-6 relative z-30">
        <div ref={cardRef} className="login-glass-card rounded-[2rem] px-8 sm:px-10 pt-7 pb-28 sm:pb-32 relative overflow-hidden z-30 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <img src="/img/logo_colegio.png" alt="Logo Colegio" className="h-20 w-auto object-contain" />
            </div>
            <h1 className="text-[30px] text-slate-900 mb-0.5 font-black tracking-tight">Bienvenido</h1>
            <p className="text-slate-500 text-sm font-medium">Inicia sesión</p>
          </div>

          {forgot ? (
            <div className="space-y-5" aria-live="polite">
              {forgot === 'choose' && (
                <>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Recupera tu acceso</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">¿Quién eres?</p>
                  </div>
                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setForgot('student'); }}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-colors"
                    >
                      <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Icon name="user" size={20} /></span>
                      <span className="font-black text-slate-800">Soy alumno</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setForgot('staff'); }}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-colors"
                    >
                      <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Icon name="teacher" size={20} /></span>
                      <span className="font-black text-slate-800">Soy profesor o trabajo en el colegio</span>
                    </button>
                  </div>
                </>
              )}

              {forgot === 'student' && (
                <div className="space-y-3">
                  <h2 className="text-lg font-black text-slate-900">Pídesela a tu colegio</h2>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Tu correo del colegio no recibe mensajes, así que no podemos enviarte un enlace.
                    Pídele a secretaría que te dé una contraseña nueva: lo hacen desde su panel en un minuto.
                  </p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Cuando entres con ella, la app te pedirá crear una que solo sepas tú.
                  </p>
                </div>
              )}

              {forgot === 'staff' && (
                <form onSubmit={sendStaffReset} className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Te enviamos un enlace</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Escribe el correo con el que entras a la plataforma.</p>
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    autoComplete="username"
                    aria-label="Correo electrónico"
                    className="input-light w-full rounded-xl py-3.5 px-4 focus:outline-none font-medium"
                    placeholder="tucorreo@ejemplo.com"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={resetSending}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-70"
                  >
                    {resetSending ? 'Enviando…' : 'Enviar enlace'}
                  </button>
                </form>
              )}

              {forgot === 'sent' && (
                <div className="space-y-3">
                  <h2 className="text-lg font-black text-slate-900">Revisa tu correo</h2>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    Si hay una cuenta con <span className="font-bold text-slate-800 break-all">{resetEmail.trim()}</span>, te llegará
                    un enlace para crear una contraseña nueva. Puede tardar unos minutos; mira también en spam.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => { playClickSound(); setForgot(null); }}
                className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Volver a iniciar sesión
              </button>
            </div>
          ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">CORREO ELECTRÓNICO</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="mail" size={20} />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-light w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none font-medium"
                    placeholder="tucorreo@ejemplo.com"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label htmlFor="login-password" className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">CONTRASEÑA</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="lock" size={20} />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-light w-full rounded-xl py-3.5 pl-12 pr-12 focus:outline-none font-medium"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                  </button>
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={openForgot}
                    className="text-[11px] text-blue-500 hover:text-blue-700 font-bold underline underline-offset-2"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {loading ? 'Validando...' : 'Iniciar Sesión'}
                </button>
              </div>
            </div>
          </form>
          )}

          {/* En móvil se muestra justo debajo del botón y por encima de la zona donde pisan los círculos */}
          <div className="md:hidden mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
            <div>
              <p className="text-[11px] font-black text-slate-700">¿Sin cuenta?</p>
              <p className="text-[11px] text-slate-400 font-medium leading-snug">Pídela en secretaría.</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black text-slate-700">¿Tu colegio?</p>
              <button type="button" onClick={onRegisterSchool} className="text-[11px] text-blue-600 font-bold hover:underline underline-offset-2">
                Regístralo →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Notas de escritorio: izquierda y derecha, lejos de los círculos */}
      {!fadingUI && (
        <>
          <div className="hidden md:flex login-side-note fixed bottom-8 left-8 z-30 items-center gap-3 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl pl-3 pr-5 py-3 shadow-sm max-w-[280px]">
            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Icon name="user" size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-slate-800 leading-tight">¿No tienes cuenta?</p>
              <p className="text-xs text-slate-500 font-medium leading-snug">Pídesela a secretaría de tu colegio.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRegisterSchool}
            className="hidden md:flex login-side-note group fixed bottom-8 right-8 z-30 items-center gap-3 bg-white/90 backdrop-blur border border-slate-200 hover:border-blue-300 hover:shadow-md rounded-2xl pl-3 pr-5 py-3 shadow-sm max-w-[300px] text-left transition-all"
          >
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Icon name="teacher" size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-slate-800 leading-tight">¿Tu colegio no está aquí?</p>
              <p className="text-xs text-blue-600 font-bold leading-snug group-hover:underline underline-offset-2">Regístralo aquí →</p>
            </div>
          </button>
        </>
      )}
    </div>
  );
};
