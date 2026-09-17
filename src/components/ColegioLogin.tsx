import React, { useState, useRef } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { Icon } from './CustomIcons';
import { playClickSound, playErrorAlertSound, playRevealSound } from '../utils/audio';
import { auth } from '../lib/firebase';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Correo electrónico inválido.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
  'auth/user-not-found': 'No existe una cuenta con ese correo.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/missing-password': 'Ingresa una contraseña.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo en unos minutos.',
  'auth/network-request-failed': 'Error de conexión. Revisa tu internet.',
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
      if (containerRef.current) containerRef.current.style.zIndex = '20';
    }, 400);
  };

  const triggerSuccessExpand = () => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'opacity 0.4s';
      cardRef.current.style.opacity = '0';
    }
    if (containerRef.current) containerRef.current.style.zIndex = '9999';

    const circles = [circle1Ref.current, circle2Ref.current, circle3Ref.current, circle4Ref.current, circle5Ref.current];
    playRevealSound();

    circles.forEach((c, i) => {
      setTimeout(() => {
        if (c) c.classList.add('expand');
      }, i * 70);
    });

    setTimeout(() => {
      onLoginSuccess();
    }, 1400);
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

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showMessage('Ingresa tu correo para recuperar la contraseña.');
      return;
    }
    playClickSound();
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showMessage('Te enviamos un correo para restablecer tu contraseña.', 'success');
    } catch (err: any) {
      showMessage(getAuthErrorMessage(err?.code));
    }
  };

  return (
    <div className="login-wrapper min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans" style={{ backgroundColor: '#f8fafc' }}>
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
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
          animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(40px);
        }

        .login-wrapper .circle {
          transform: translate(-50%, 150%);
          animation: popUpCircle 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes popUpCircle { to { transform: translate(-50%, 50%); } }

        .circles-container {
          position: fixed; bottom: 0; left: 50%; z-index: 20; pointer-events: none;
        }
        .circle {
          position: absolute; bottom: 0; left: 0; border-radius: 50%;
        }
        .circle-1 { width: 350px; height: 350px; background-color: #ffcc00; animation-delay: 0.2s; }
        .circle-2 { width: 310px; height: 310px; background-color: #ff6600; animation-delay: 0.3s; }
        .circle-3 { width: 270px; height: 270px; background-color: #cc0000; animation-delay: 0.4s; }
        .circle-4 { width: 230px; height: 230px; background-color: #660066; animation-delay: 0.5s; }
        .circle-5 { width: 190px; height: 190px; background-color: #000066; animation-delay: 0.6s; }

        .circle.expand {
          animation: expandCircle 1s cubic-bezier(0.65, 0, 0.35, 1) forwards !important;
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

      <div className="floating-blob blob-1 rounded-full"></div>
      <div className="floating-blob blob-2 rounded-full"></div>

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

      <div className="w-full max-w-md px-6 relative z-10">
        <div ref={cardRef} className="login-glass-card rounded-[2rem] p-10 relative overflow-hidden z-10 bg-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <img src="/img/logo_colegio.png" alt="Logo Colegio" className="h-28 w-auto object-contain" />
            </div>
            <h1 className="text-[32px] text-slate-900 mb-2 font-black tracking-tight">Bienvenido</h1>
            <p className="text-slate-500 text-sm font-medium">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">CORREO ELECTRÓNICO</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="mail" size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-light w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none font-medium"
                    placeholder="tucorreo@ejemplo.com"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-2 tracking-widest uppercase font-bold">CONTRASEÑA</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icon name="lock" size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-light w-full rounded-xl py-3.5 pl-12 pr-4 focus:outline-none font-medium"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors focus:outline-none"
                  >
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                  </button>
                </div>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-blue-500 hover:text-blue-700 font-bold underline underline-offset-2"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
              <div className="pt-4">
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

          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-400 font-medium">
              ¿No tienes cuenta? Pídele a tu profesor o al colegio que te la cree.
            </p>
            <p className="text-xs text-slate-400 font-medium">
              ¿Tu colegio aún no está en la plataforma?{' '}
              <button
                type="button"
                onClick={onRegisterSchool}
                className="text-blue-500 hover:text-blue-700 font-bold underline underline-offset-2"
              >
                Regístralo aquí
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
