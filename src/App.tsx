import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence, usePresence, useMotionValue, useMotionTemplate, animate } from 'motion/react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import { ProblemData, CurrentProblem, AlbumState, Stats, ShopItem, MarketEvent, PetBuff, UnplacedPiece } from './types';
import { roulettePrizes, themes, initialAlbums, PET_BUFFS, MARKET_EVENTS, SHOP_BANNERS, TROPHIES } from './data';
import {
  playClickSound,
  playCatchSound,
  playErrorAlertSound,
  playRouletteTick,
  startTickingSound,
  playFrenzySound,
  playShieldSound,
  playRainbowSound,
  playRumbleSound,
  playEpicRevealSound,
  playThemeAmbientMusic,
  playTransitionSound,
  playRevealSound,
  setMusicEnabled,
  isMusicEnabled,
} from './utils/audio';
import { generateMathProblem } from './utils/math';
import { isCorrectAnswer, keyValue, parseAnswer } from './lib/answers';
import { isZero, nextBatch, onConfirmed, onSignIn, type SyncState } from './lib/balance';
import { pickPrize, spinTo } from './lib/wheel';
import { DAILY_CHALLENGES, challengeValue, schoolToday } from './lib/claims';
import { useAnimatedNumber } from './utils/animated';
import { Button, Card, BentoTile, FloatingMathBackground } from './components/UI';
import { ConfettiOverlay } from './components/ConfettiOverlay';
const PlatformConsole = lazy(() => import('./components/PlatformConsole').then(m => ({ default: m.PlatformConsole })));
const SchoolRegister = lazy(() => import('./components/SchoolRegister').then(m => ({ default: m.SchoolRegister })));
const TeacherDashboard = lazy(() => import('./components/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const ShellGameMinigame = lazy(() => import('./components/ShellGameMinigame').then(m => ({ default: m.ShellGameMinigame })));
const PetRaceMinigame = lazy(() => import('./components/PetRaceMinigame').then(m => ({ default: m.PetRaceMinigame })));

import { Toast, ToastTone } from './components/Toast';
import { AudioToggle } from './components/AudioToggle';
import { ColegioLogin } from './components/ColegioLogin';
import { ChangePasswordForm } from './components/ChangePassword';

import { ProgressMap } from './components/ProgressMap';
import { InitialSetup } from './components/InitialSetup';
import { ProblemVisualizer } from './components/Visualizer';
import { TruthTableInput } from './components/TruthTableInput';
import { DictLabModal } from './components/DictLabModal';
import { AlbumModal } from './components/AlbumModal';
import { MistakesModal } from './components/MistakesModal';
import { ProfileModal } from './components/ProfileModal';
import { TeacherModeModal, type TutorProblem } from './components/TeacherModeModal';
import { apiRequest } from './lib/api';
import { WelcomeBonusModal } from './components/WelcomeBonusModal';
import { DailyChallengesModal } from './components/DailyChallengesModal';
import { ChestModal } from './components/ChestModal';
import { TicketModal } from './components/TicketModal';
import { ProgressModal } from './components/ProgressModal';
import { UserState } from './types';
import { THEME_STYLES } from './data';
import { Icon } from './components/CustomIcons';
import { Avatar, AVATAR_OPTIONS } from './components/Avatar';



const Loading = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

// One price per item: the quick-powers panel on the home screen charged 300
// for a shield and 500 for Double while the shop charged 60 and 200.
const SHIELD_PRICE = 60;
const SHIELD_PACK_PRICE = 150; // 3 shields
const DOUBLE_PRICE = 200;
const SUPERNOVA_PRICE = 150;

// This browser's id and sync batch counter. Kept across sign-outs, unlike
// the rest of the game state: the counter has to keep going up, or the
// server would take a new batch for one it has already applied.
function nextDeviceSeq(): { device: string; seq: number } {
  let saved: { id?: string; seq?: number } = {};
  try { saved = JSON.parse(localStorage.getItem('fin_device') || '{}') || {}; } catch { /* start over */ }
  const id = typeof saved.id === 'string' && saved.id.length >= 8
    ? saved.id
    : (globalThis.crypto?.randomUUID?.() ?? `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`);
  const seq = (typeof saved.seq === 'number' ? saved.seq : 0) + 1;
  try { localStorage.setItem('fin_device', JSON.stringify({ id, seq })); } catch { /* private mode */ }
  return { device: id, seq };
}

// Everything the game caches on the device for whoever is signed in. Not
// 'fin_device': its batch counter must keep increasing across accounts.
const LOCAL_GAME_KEYS = [
  'fin_user', 'fin_infinite_progress', 'fin_albums_state', 'fin_unplaced_pieces',
  'fin_current_problem', 'fin_equiped_pet', 'fin_purchased_pets', 'fin_purchased_themes',
  'fin_stats', 'fin_mistakes', 'fin_streak', 'fin_supernova', 'fin_shields',
  'fin_double', 'fin_coins_spent', 'fin_skips_used', 'fin_tutorial_step', 'fin_theme',
  'fin_sync_state',
];

function readBalanceSync(): SyncState | null {
  try {
    const saved = JSON.parse(localStorage.getItem('fin_sync_state') || 'null');
    return saved && typeof saved.uid === 'string' && saved.base ? saved : null;
  } catch {
    return null;
  }
}

let globalLastClick = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  globalLastClick = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  const updateClick = (x: number, y: number) => {
    if (x !== 0 || y !== 0) {
      globalLastClick = { x, y };
    }
  };

  window.addEventListener('click', (e) => updateClick(e.clientX, e.clientY), true);
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
      updateClick(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true, capture: true });
}

const CIRCLE_COLORS = ['#FFD700', '#FF8C00', '#DC143C', '#8B008B', '#000080'];


const TabTransition: React.FC<{ children: React.ReactNode, type?: string, zIndexOffset?: number }> = ({ children, zIndexOffset = 0 }) => {
  const [isPresent, safeToRemove] = usePresence();
  
  const isFirstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (!isPresent) {
       playTransitionSound();
       const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 1000);
       return () => clearTimeout(timer);
    } else {
       if (!isFirstRenderRef.current) {
         playRevealSound();
       }
       isFirstRenderRef.current = false;
    }
  }, [isPresent, safeToRemove]);

  // isPresent false -> exiting (cover the screen)
  // isPresent true -> entering (uncover the screen)
  return (
    <div className="absolute inset-0 flex flex-col" style={{ zIndex: 10 + zIndexOffset }}>
       {/* Transition layers */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden flex" style={{ zIndex: 20 }}>
         {CIRCLE_COLORS.map((color, i) => {
           return (
              <motion.div
                key={`blocks-${color}`}
                initial={{ y: isPresent ? '0%' : '100%' }}
                animate={{ y: isPresent ? '-100%' : '0%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: isPresent ? i * 0.08 : (4 - i) * 0.08 }}
                style={{ flex: 1, height: '100%', backgroundColor: color, zIndex: 25 }}
              />
           );
         })}
       </div>
       
       {/* Content */}
       <div 
         className="flex-1 w-full h-full relative"
         style={{ zIndex: 10 }}
       >
         {children}
       </div>
    </div>
  );
};

export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string, skipInitial?: boolean }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50', skipInitial = false }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [phase, setPhase] = React.useState(skipInitial ? 5 : 0);
  
  // Store click coordinates relative to viewport
  const [clickPos] = React.useState(() => ({ x: globalLastClick.x, y: globalLastClick.y }));

  // Motion values
  const holeRadius = useMotionValue(0);
  const pageRadius = useMotionValue(0);
  
  const r0 = useMotionValue(0);
  const r1 = useMotionValue(0);
  const r2 = useMotionValue(0);
  const r3 = useMotionValue(0);
  const r4 = useMotionValue(0);
  const circleRadii = [r0, r1, r2, r3, r4];
  
  const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, transparent ${holeRadius}px, black calc(${holeRadius}px + 1px))`;

  const clip0 = useMotionTemplate`circle(${r0}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip1 = useMotionTemplate`circle(${r1}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip2 = useMotionTemplate`circle(${r2}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip3 = useMotionTemplate`circle(${r3}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clip4 = useMotionTemplate`circle(${r4}px at ${clickPos.x}px ${clickPos.y}px)`;
  const clips = [clip0, clip1, clip2, clip3, clip4];

  const [mountId] = React.useState(() => Math.random().toString(36).substring(7));

  const [radii] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const vmin = Math.min(window.innerWidth, window.innerHeight);
      const vmax = Math.max(window.innerWidth, window.innerHeight);
      return { base: vmin * 0.35, step: vmin * 0.05, max: vmax * 2.5 };
    }
    return { base: 350, step: 50, max: 2500 };
  });

  React.useEffect(() => {
    if (!isPresent) {
       // Exiting component: wait until entering animation completes
       const timer = setTimeout(() => {
         safeToRemove && safeToRemove();
       }, 3500);
       return () => clearTimeout(timer);
    }

    if (skipInitial) {
      setPhase(5);
      return;
    }

    // Phase 1: Lens opens showing old page
    playTransitionSound();
    circleRadii.forEach((r, i) => {
      animate(r, radii.base - i * radii.step, {
         duration: 0.4,
         delay: i * 0.05,
         ease: [0.34, 1.56, 0.64, 1]
       });
    });
    animate(holeRadius, 50, { duration: 0.4, ease: "easeInOut" });

    // Phase 2: Lens closes
    const t2 = setTimeout(() => {
      animate(holeRadius, 0, { duration: 0.3, ease: "easeInOut" });
    }, 1900);

    // Phase 3: Lens opens showing NEW page
    const t3 = setTimeout(() => {
      playRevealSound();
      animate(holeRadius, 50, { duration: 0.3, ease: "easeInOut" });
      animate(pageRadius, 50, { duration: 0.3, ease: "easeInOut" });
    }, 2200);

    // Phase 4: Expand to full screen
    const t4 = setTimeout(() => {
      setPhase(4);
      const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.5;

      circleRadii.forEach((r) => {
        animate(r, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
      });
      animate(holeRadius, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
      animate(pageRadius, maxR, { duration: 0.6, ease: [0.64, 0, 0.78, 0] });
    }, 2600);

    // Phase 5: Clean up, make interactive
    const t5 = setTimeout(() => {
      setPhase(5);
    }, 3200);

    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [isPresent, safeToRemove, skipInitial, holeRadius, pageRadius, radii, ...circleRadii]);

  const currentZ = !isPresent ? 0 : (phase >= 5 ? 10 : 9999);
  
  // pageClip is applied to the new page content
  const pageClip = useMotionTemplate`circle(${pageRadius}px at ${clickPos.x}px ${clickPos.y}px)`;

  return (
    <motion.div 
      className={`fixed inset-0 flex flex-col ${phase >= 5 ? '' : 'overflow-hidden pointer-events-none'}`}
      style={{ zIndex: currentZ }}
      exit={{ opacity: 1, transition: { duration: 1 } }}
    >
      {/* 5 Circles with Hole Mask */}
      {phase < 5 && isPresent && (
        <motion.div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 10, 
            pointerEvents: 'none',
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%'
          }}
        >
          {CIRCLE_COLORS.map((color, i) => {
            return (
              <motion.div
                key={`${mountId}-${color}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10 + i,
                  backgroundColor: color,
                  clipPath: clips[i],
                  WebkitClipPath: clips[i]
                }}
              />
            );
          })}
        </motion.div>
      )}
      
      {/* The New Page Content */}
      <motion.div
        className={`absolute inset-0 flex flex-col ${bgClass}`}
        style={{
          zIndex: 20,
          pointerEvents: phase >= 5 ? 'auto' : 'none',
          clipPath: phase >= 5 ? 'none' : (isPresent ? pageClip : 'none'),
          WebkitClipPath: phase >= 5 ? 'none' : (isPresent ? pageClip : 'none'),
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}><FloatingMathBackground /></div>
        <div className={className} style={{ flex: 1, width: '100%', position: 'relative', zIndex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};


const CourseSelector = ({ activeCourse, setActiveCourse, user }: { activeCourse: string, setActiveCourse: (course: any) => void, user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const allCourses = [
    { id: 'razonamiento', name: 'RM Básico', icon: '🧠', color: 'text-blue-600', bg: 'bg-blue-100', allowedGrades: ['3ro'] },
    { id: 'razonamiento_5to', name: 'RM 5to', icon: '🔥', color: 'text-emerald-600', bg: 'bg-emerald-100', allowedGrades: ['4to', '5to'] },
    { id: 'trigonometria', name: 'Trigonom.', icon: '📐', color: 'text-indigo-600', bg: 'bg-indigo-100', allowedGrades: ['4to', '5to'] },
    { id: 'geometria_5to', name: 'Geo 5to', icon: '🧊', color: 'text-rose-600', bg: 'bg-rose-100', allowedGrades: ['5to'] },
  ];
  
  const courses = user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'secretary' 
    ? allCourses 
    : allCourses.filter(c => c.allowedGrades.includes(user?.grade || '3ro'));
    
  const active = courses.find(c => c.id === activeCourse) || courses[0];

  return (
    <div className="relative group z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-b-4 border-slate-200 rounded-xl font-black text-slate-700 shadow-sm active:translate-y-px active:border-b-2 transition-all min-w-[160px]"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{active.icon}</span>
          <span className={active.color}>{active.name}</span>
        </div>
        <Icon name="chevron_down" size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 w-full p-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-50 flex flex-col gap-1 origin-top animate-in fade-in zoom-in-95 duration-100">
            {courses.map(course => (
              <button
                key={course.id}
                onClick={() => { setActiveCourse(course.id); setIsOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm text-left transition-colors ${activeCourse === course.id ? course.bg + ' ' + course.color : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <span className="text-base">{course.icon}</span>
                <span>{course.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  const getCourseProgress = (c, u) => {
    if (c === 'trigonometria') return u?.courseProgress?.trigonometria || 0;
    if (c === 'razonamiento_5to') return u?.courseProgress?.razonamiento_5to || 0;
    if (c === 'geometria_5to') return u?.courseProgress?.geometria_5to || 0;
    return u?.progress || 0;
  };

  // Only students see the setup screen, and it only picks the avatar: name,
  // role and grade are the school's enrollment data, fixed server-side.
  const handleInitialSetupComplete = async (data: { avatar: string }) => {
    if (user) {
      setUser({ ...user, avatar: data.avatar, setupCompleted: true });
      setShowWelcomeBonus(true);
      setTutorialStep(1);
    }
  };

  // Authentication & Character Choice
  const [infiniteProgress, setInfiniteProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('fin_infinite_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('fin_infinite_progress', JSON.stringify(infiniteProgress));
  }, [infiniteProgress]);

  
  const [user, setUser] = useState<UserState | null>(() => {
    const saved = localStorage.getItem('fin_user');
    if (saved) return JSON.parse(saved);
    return null;
  });

  // Real Firebase session: authChecked flips once Firebase resolves any
  // persisted session; showLoginScreen is decided only once from that,
  // so a fresh login's success animation in ColegioLogin isn't cut short
  // by the auth state updating mid-animation.
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState<boolean | null>(null);
  const [showRegisterScreen, setShowRegisterScreen] = useState(false);

  // Los minijuegos se cargan aparte, y aparecen de golpe cuando el alumno cae
  // en uno: se traen en cuanto el navegador está libre para que no haya espera.
  useEffect(() => {
    const warm = () => {
      import('./components/ShellGameMinigame');
      import('./components/PetRaceMinigame');
    };
    const idle = (window as any).requestIdleCallback;
    if (idle) { const id = idle(warm); return () => (window as any).cancelIdleCallback?.(id); }
    const t = setTimeout(warm, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setAuthUser(fbUser);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authChecked && showLoginScreen === null) {
      setShowLoginScreen(!authUser);
    }
  }, [authChecked, authUser, showLoginScreen]);

  const [profileLoadError, setProfileLoadError] = useState<string | null>(null);
  // Set when the account still has the temporary password the school gave
  // it. While set, the only thing on screen is the form to replace it.
  const [mustChangePassword, setMustChangePassword] = useState(false);
  // Only for the password rules ("no uses tu DNI"). Kept in memory, never in
  // the profile cached in localStorage: school computers are shared.
  const [accountDni, setAccountDni] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  // Whoever runs the platform has no school, so /api/user rejects them. That
  // rejection is the cue to check whether this is an operator instead.
  const [platformAdmin, setPlatformAdmin] = useState<{ email?: string } | null>(null);
  // Read inside the hydration effect, which only depends on authUser.
  const userRef = useRef(user);
  // Where this device stands with the server on coins and tickets (see
  // src/lib/balance.ts). Persisted, so a batch sent as the tab closed is
  // resent next time instead of being lost or counted twice.
  const balanceSync = useRef<SyncState | null>(readBalanceSync());
  const saveBalanceSync = (state: SyncState) => {
    balanceSync.current = state;
    try { localStorage.setItem('fin_sync_state', JSON.stringify(state)); } catch { /* private mode */ }
  };
  userRef.current = user;

  // Loads the real account — name, role, school — from the backend on every
  // sign-in. Accounts are provisioned by an admin with a fixed role, so the
  // client must never invent one.
  //
  // Progress is merged rather than overwritten, always keeping whichever side
  // is further along. Two reasons: students who played before this synced at
  // all have their whole history only in localStorage and would otherwise be
  // reset to zero on their next login; and a sync that failed to reach the
  // server (offline, closed tab) must never cost the student their work.
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!authUser || hydratedRef.current) return;
    hydratedRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const token = await authUser.getIdToken();
        const res = await fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } });
        if (cancelled) return;
        if (!res.ok) {
          hydratedRef.current = false;
          // 403 is definitive (the account isn't registered at any school), so
          // it always surfaces. A transient failure only blocks the student
          // when there's no cached profile to fall back on — otherwise they
          // keep playing offline and the next successful sync catches up.
          if (res.status === 403) {
            const platform = await fetch('/api/platform/me', { headers: { Authorization: `Bearer ${token}` } })
              .then((r) => r.json())
              .catch(() => ({ isPlatformAdmin: false }));
            if (cancelled) return;
            if (platform.isPlatformAdmin) {
              setPlatformAdmin({ email: platform.email });
              return;
            }
            // The server distinguishes "no account" from a deactivated account
            // and a suspended school; showing its message keeps the student
            // from being told the wrong reason.
            const body = await res.json().catch(() => ({}));
            setProfileLoadError(body.error || 'No hay una cuenta registrada para este usuario. Contacta a tu colegio.');
          } else if (!userRef.current) {
            setProfileLoadError('No se pudo cargar tu perfil. Intenta de nuevo.');
          }
          return;
        }
        const dbUser = await res.json();
        if (cancelled) return;

        // The game state cached on this device belongs to whoever used it
        // last. If that was someone else — a shared school computer where a
        // session ended without "Cerrar sesión" — none of it may be merged
        // into this account: start clean, as signing out would have.
        const cachedEmail = userRef.current?.email?.toLowerCase();
        if (cachedEmail && dbUser.email && cachedEmail !== String(dbUser.email).toLowerCase()) {
          LOCAL_GAME_KEYS.forEach(key => localStorage.removeItem(key));
          window.location.reload();
          return;
        }
        setMustChangePassword(dbUser.mustChangePassword === true);
        setAccountDni(dbUser.dni ?? null);
        setSchoolName(dbUser.schoolName ?? null);
        setClaimedChallenges(dbUser.claims?.daily?.date === schoolToday() ? dbUser.claims.daily.ids ?? [] : []);

        const mergeByKey = (a: Record<string, number> = {}, b: Record<string, number> = {}) => {
          const out: Record<string, number> = { ...a };
          for (const [k, v] of Object.entries(b)) out[k] = Math.max(Number(out[k]) || 0, Number(v) || 0);
          return out;
        };

        const cached = userRef.current;
        const signedIn = onSignIn(
          { coins: dbUser.coins ?? 0, tickets: dbUser.tickets ?? 0 },
          cached ? { coins: cached.coins, tickets: cached.tickets } : null,
          balanceSync.current,
          authUser.uid,
        );
        saveBalanceSync(signedIn.state);

        setUser(prev => ({
          // Identity and enrollment always come from the server — they're the
          // school's data, not the device's.
          // The server's name first: this used to prefer the one cached on
          // the device, so a correction made by the secretary never reached
          // the student — and the stale name was synced back over it.
          name: dbUser.name || prev?.name || authUser.displayName || authUser.email?.split('@')[0] || 'Estudiante',
          email: dbUser.email || authUser.email || '',
          avatar: prev?.avatar || dbUser.avatar || 'fox',
          role: dbUser.role || 'student',
          grade: dbUser.grade || undefined,
          classroom: dbUser.classroom || '',
          setupCompleted: dbUser.setupCompleted || prev?.setupCompleted || false,
          coins: signedIn.local.coins,
          tickets: signedIn.local.tickets,
          progress: Math.max(dbUser.progress ?? 0, prev?.progress ?? 0),
          courseProgress: mergeByKey(prev?.courseProgress, dbUser.courseProgress),
        }));
        setInfiniteProgress(prev => mergeByKey(prev, dbUser.infiniteProgress));
        setStats(prev => ((dbUser.stats?.solved ?? 0) > (prev?.solved ?? 0) ? dbUser.stats : prev));
        setMistakesList(prev => ((dbUser.mistakes?.length ?? 0) > prev.length ? dbUser.mistakes : prev));
        setAlbumsState(prev => {
          const owned = (s: Record<string, AlbumState>) =>
            Object.values(s || {}).reduce((n, a: any) => n + (a?.piecesOwned?.length || 0), 0);
          return owned(dbUser.albums) > owned(prev) ? dbUser.albums : prev;
        });
      } catch {
        if (!cancelled) {
          hydratedRef.current = false;
          if (!userRef.current) setProfileLoadError('Error de conexión al cargar tu perfil.');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [authUser]);


  // Central Game States
  const [activeTheme, setActiveTheme] = useState<string>(() => localStorage.getItem('fin_theme') || 'default');
  const [purchasedThemes, setPurchasedThemes] = useState<string[]>(() => {
    const saved = localStorage.getItem('fin_purchased_themes');
    return saved ? JSON.parse(saved) : ['default'];
  });
  
  const [albumsState, setAlbumsState] = useState<Record<string, AlbumState>>(() => {
    const saved = localStorage.getItem('fin_albums_state');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [unplacedPieces, setUnplacedPieces] = useState<UnplacedPiece[]>(() => {
    const saved = localStorage.getItem('fin_unplaced_pieces');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentProblem, setCurrentProblem] = useState<CurrentProblem>(() => {
    const saved = localStorage.getItem('fin_current_problem');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.data && !p.data.visualData) {
        // Regenerate if no visualData
        const prob = generateMathProblem(false, null, 0);
        return { data: prob, solved: false, timestamp: Date.now() };
      }
      return p;
    }
    const prob = generateMathProblem(false, null, 0);
    return { data: prob, solved: false, timestamp: Date.now() };
  });

    
  const [equipedPet, setEquipedPet] = useState<PetBuff>(() => {
    try {
      const saved = localStorage.getItem('fin_equiped_pet');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return PET_BUFFS[0];
  });
  const [purchasedPets, setPurchasedPets] = useState<string[]>(() => {
    const saved = localStorage.getItem('fin_purchased_pets');
    return saved ? JSON.parse(saved) : ['none'];
  });

  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('fin_stats');
    return saved ? JSON.parse(saved) : {
      solved: 0,
      failedAttempts: 0,
      totalGenerations: 1,
      boostsTriggered: 0,
      maxStreak: 0,
      distractions: 0,
      goldenWins: 0,
      legendaryWins: 0,
      supernovas: 0,
      exerciseTimes: []
    };
  });

  const [coinsSpent, setCoinsSpent] = useState<number>(() => {
    return parseInt(localStorage.getItem('fin_coins_spent') || '0', 10);
  });
  const [skipsUsed, setSkipsUsed] = useState<number>(() => {
    return parseInt(localStorage.getItem('fin_skips_used') || '0', 10);
  });

  // Defaults to 0 (hidden): the tutorial is only ever started explicitly,
  // from handleInitialSetupComplete right after a brand-new account finishes
  // setup, or from "Ver Tutorial". Defaulting to 1 here used to re-trigger it
  // on every login where localStorage was empty — which is every login right
  // after handleLogout, since it deliberately wipes local state so the next
  // student on a shared computer doesn't inherit the previous one's session.
  const [tutorialStep, setTutorialStep] = useState<number>(() => {
    const saved = localStorage.getItem('fin_tutorial_step');
    return saved === null ? 0 : parseInt(saved, 10);
  });

  // UI inputs & feedbacks
  const [inputAnswer, setInputAnswer] = useState("");
  const [mistakesList, setMistakesList] = useState<{ problem: string; userAnswer: string; correctAnswer: string; explanation: string; topic?: string }[]>(() => {
    const saved = localStorage.getItem('fin_mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals & Overlays Visibility
  const [toast, setToast] = useState<{ text: string; tone: ToastTone } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((text: string, tone: ToastTone = 'warn') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ text, tone });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [welcomePrize, setWelcomePrize] = useState<{ icon: string; name: string } | null>(null);
  const [showMistakes, setShowMistakes] = useState(false);
  const [showDictLab, setShowDictLab] = useState(false);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'practice' | 'infinite_map' | 'exercise' | 'codice' | 'album' | 'shop' | 'mistakes' | 'profile' | 'teacher' | 'teacher_dash'>('map');
  const [shopTab, setShopTab] = useState<'powers' | 'chests' | 'themes'>('powers');
  const hasEnteredExerciseRef = useRef(false);
  useEffect(() => {
    if (viewMode === 'exercise') {
      hasEnteredExerciseRef.current = true;
    }
  }, [viewMode]);
  const isStaff = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'secretary';

  // El personal (profesor/secretario/admin) aterriza directo en su panel,
  // no en el mapa de aventura pensado para alumnos.
  useEffect(() => {
    if (isStaff) setViewMode('teacher_dash');
  }, [user?.role]);

    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<'razonamiento' | 'trigonometria' | 'razonamiento_5to' | 'geometria_5to' | null>(null);
  
  // Derivar el curso activo basándonos en el grado
  const allCoursesData = [
    { id: 'razonamiento', allowedGrades: ['3ro'] },
    { id: 'razonamiento_5to', allowedGrades: ['4to', '5to'] },
    { id: 'trigonometria', allowedGrades: ['4to', '5to'] },
    { id: 'geometria_5to', allowedGrades: ['5to'] },
  ];
  
  const availableCourses = user?.role === 'admin' || user?.role === 'teacher' || user?.role === 'secretary' 
    ? allCoursesData.map(c => c.id)
    : allCoursesData.filter(c => c.allowedGrades.includes(user?.grade || '3ro')).map(c => c.id);
    
  const activeCourse = (selectedCourse && availableCourses.includes(selectedCourse)) 
    ? selectedCourse 
    : (availableCourses[0] as any);
  
  const setActiveCourse = setSelectedCourse;

// Regenerate problem when entering exercise from the main map
  useEffect(() => {
    if (user && viewMode === 'exercise' && !selectedTopic) {
      const pLevel = getCourseProgress(activeCourse, user);
      const prob = generateMathProblem(false, null, pLevel, activeCourse);
      setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
    }
  }, [user?.progress, viewMode, selectedTopic, activeCourse]);
  const [expandedChallenges, setExpandedChallenges] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  
  // Minigames & Wheel Overlay States
  const [showShellGame, setShowShellGame] = useState(false);
  const [showPetRace, setShowPetRace] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [lastPrize, setLastPrize] = useState<string | null>(null);

  // Active feedback alerts
  // 'hint': the answer couldn't be read as a number, so nothing was graded.
  const [answerState, setAnswerState] = useState<{ type: 'idle' | 'hint' | 'correct' | 'wrong'; text: React.ReactNode }>({ type: 'idle', text: null });
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('fin_streak') || '0', 10));
  const [isSupernova, setIsSupernova] = useState(() => localStorage.getItem('fin_supernova') === 'true');
  const [showConfetti, setShowConfetti] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<{id: string, price: number, isAlreadyPurchased: boolean} | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Shield protection
  const [shieldCount, setShieldCount] = useState(() => parseInt(localStorage.getItem('fin_shields') || '0', 10));
  const [activeDoubleDividends, setActiveDoubleDividends] = useState(() => localStorage.getItem('fin_double') === 'true');

  // Distractions & Focus-mode Warning
  const [lastTabLeave, setLastTabLeave] = useState<number>(0);
  const [showDistractionWarning, setShowDistractionWarning] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<React.ReactNode>("");
  const [claimedChallenges, setClaimedChallenges] = useState<number[]>([]);

  // Refs
  const audioInitialized = useRef(false);

// Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('fin_user', JSON.stringify(user));
    }
  }, [user, infiniteProgress, stats, albumsState]);

  // Pushes progress to the server. Until this existed the game lived purely
  // in localStorage: the teacher dashboard showed zeros for every student,
  // and logging out (which deliberately clears local state on shared school
  // computers) destroyed the student's history for good.
  const syncStateRef = useRef({ user, stats, albumsState, infiniteProgress, mistakesList, authUser });
  syncStateRef.current = { user, stats, albumsState, infiniteProgress, mistakesList, authUser };

  // One sync at a time: two in flight would both diff against the same
  // confirmed balance. A request made meanwhile runs right after.
  const syncInFlight = useRef<Promise<void> | null>(null);
  const syncAgain = useRef(false);

  const syncToServer = useCallback((): Promise<void> => {
    if (syncInFlight.current) {
      syncAgain.current = true;
      return syncInFlight.current;
    }
    const run = async () => {
      const snapshot = syncStateRef.current;
      const state = balanceSync.current;
      // Nothing to diff against until sign-in has loaded the server's
      // balance; the first sync after that carries everything.
      if (!snapshot.user || !snapshot.authUser || !state || state.uid !== snapshot.authUser.uid) return;

      let working = state;
      const batch = nextBatch({ coins: snapshot.user.coins, tickets: snapshot.user.tickets }, state);
      if (batch.seq === null && !isZero(batch.delta)) {
        // Recorded before it's sent, so a lost answer means a resend of
        // this exact batch, never a second one.
        const { device, seq } = nextDeviceSeq();
        working = { ...state, pending: { seq, device, delta: batch.delta } };
        saveBalanceSync(working);
      }
      const pending = working.pending;

      const payload = JSON.stringify({
        ...(pending
          ? { deviceId: pending.device, seq: pending.seq, coinsDelta: pending.delta.coins, ticketsDelta: pending.delta.tickets }
          : {}),
        progress: snapshot.user.progress,
        courseProgress: snapshot.user.courseProgress || {},
        infiniteProgress: snapshot.infiniteProgress,
        stats: snapshot.stats,
        albums: snapshot.albumsState,
        mistakes: snapshot.mistakesList,
        avatar: snapshot.user.avatar,
        setupCompleted: snapshot.user.setupCompleted,
      });
      const token = await snapshot.authUser.getIdToken();
      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: payload,
        // Lets the last sync survive the tab closing; browsers cap such
        // requests at 64 KB, and a long mistakes list can exceed that.
        keepalive: payload.length < 60_000,
      });
      if (!res.ok) return;
      const row = await res.json();
      const server = { coins: row.coins ?? 0, tickets: row.tickets ?? 0 };
      saveBalanceSync({ uid: working.uid, base: server, pending: null });
      setUser(prev => {
        if (!prev) return prev;
        const { local } = onConfirmed(server, { coins: prev.coins, tickets: prev.tickets }, working);
        return local.coins === prev.coins && local.tickets === prev.tickets ? prev : { ...prev, ...local };
      });
    };
    const done = run()
      // Offline or the server is down: the pending batch stays recorded and
      // goes out with the next sync.
      .catch(() => {})
      .finally(() => {
        syncInFlight.current = null;
        if (syncAgain.current) {
          syncAgain.current = false;
          void syncToServer();
        }
      });
    syncInFlight.current = done;
    return done;
  }, []);

  useEffect(() => {
    if (!user || !authUser) return;
    const timer = setTimeout(syncToServer, 1500);
    return () => clearTimeout(timer);
  }, [user, stats, albumsState, infiniteProgress, mistakesList, authUser, syncToServer]);

  // Closing the tab mid-debounce would otherwise drop the last answers.
  useEffect(() => {
    const flush = () => { if (document.visibilityState === 'hidden') syncToServer(); };
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pagehide', syncToServer);
    return () => {
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('pagehide', syncToServer);
    };
  }, [syncToServer]);

  useEffect(() => {
    localStorage.setItem('fin_albums_state', JSON.stringify(albumsState));
  }, [albumsState]);

  useEffect(() => {
    localStorage.setItem('fin_unplaced_pieces', JSON.stringify(unplacedPieces));
  }, [unplacedPieces]);

  useEffect(() => {
    localStorage.setItem('fin_current_problem', JSON.stringify(currentProblem));
  }, [currentProblem]);

  useEffect(() => {
    localStorage.setItem('fin_equiped_pet', JSON.stringify(equipedPet));
  }, [equipedPet]);

  useEffect(() => {
    localStorage.setItem('fin_purchased_pets', JSON.stringify(purchasedPets));
  }, [purchasedPets]);

  useEffect(() => {
    localStorage.setItem('fin_purchased_themes', JSON.stringify(purchasedThemes));
  }, [purchasedThemes]);

  useEffect(() => {
    localStorage.setItem('fin_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('fin_mistakes', JSON.stringify(mistakesList));
  }, [mistakesList]);

  useEffect(() => {
    localStorage.setItem('fin_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('fin_supernova', String(isSupernova));
  }, [isSupernova]);

  useEffect(() => {
    localStorage.setItem('fin_shields', String(shieldCount));
  }, [shieldCount]);

  useEffect(() => {
    localStorage.setItem('fin_double', String(activeDoubleDividends));
  }, [activeDoubleDividends]);

  useEffect(() => {
    localStorage.setItem('fin_coins_spent', String(coinsSpent));
  }, [coinsSpent]);

  useEffect(() => {
    localStorage.setItem('fin_skips_used', String(skipsUsed));
  }, [skipsUsed]);

  useEffect(() => {
    localStorage.setItem('fin_tutorial_step', String(tutorialStep));
  }, [tutorialStep]);

  // Tab distraction watcher — only meaningful for students doing exercises;
  // a teacher/admin switching tabs to use the dashboard isn't "distracted".
  useEffect(() => {
    if (user?.role !== 'student') return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setLastTabLeave(Date.now());
      } else {
        if (lastTabLeave > 0) {
          const elapsed = (Date.now() - lastTabLeave) / 1000;
          if (elapsed > 4) {
            setStats(prev => ({ ...prev, distractions: prev.distractions + 1 }));
            setShowDistractionWarning(true);
            playErrorAlertSound();
          }
          setLastTabLeave(0);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [lastTabLeave, user?.role]);

  // Ambient music controller
  useEffect(() => {
    if (user) {
      playThemeAmbientMusic(activeTheme);
      const handleUserInteraction = () => {
        playThemeAmbientMusic(activeTheme);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
      return () => {
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };
    }
  }, [activeTheme, user]);

  // Secure Server proxy call to Gemini
  // Errors come back as text for the tutor's bubble: the student is in the
  // middle of an exercise, and a toast about a failed request is less
  // useful there than the tutor saying it can't answer right now.
  const askTutor = async (problem: TutorProblem, question: string): Promise<string> => {
    try {
      const body = await apiRequest<{ text: string }>('/api/tutor', 'El tutor no pudo responder. Intenta de nuevo en un momento.', {
        method: 'POST',
        body: JSON.stringify({ problem, question }),
      });
      return body.text;
    } catch (error) {
      return error instanceof Error ? error.message : 'El tutor no pudo responder. Intenta de nuevo en un momento.';
    }
  };

  const tutorProblem: TutorProblem | null = currentProblem?.data
    ? {
        intro: currentProblem.data.intro,
        topic: currentProblem.data.type,
        answer: String(currentProblem.data.expectedAnswer ?? ''),
        explanation: currentProblem.data.explanation,
      }
    : null;


  // Pick Welcome box
  const handleWelcomePick = (idx: number) => {
    if (!user) return;
    playEpicRevealSound();
    let bonus = { coins: 150, tickets: 15, name: "Bono de Bienvenida" };
    if (idx === 1) bonus = { coins: 0, tickets: 0, name: "Suscripción Inversor" };
    if (idx === 2) bonus = { coins: 250, tickets: 10, name: "Cofre de Bienvenida" };
    
    setWelcomePrize({ icon: idx === 1 ? "📉" : "🪙", name: bonus.name });
    setUser(prev => prev ? {
      ...prev,
      coins: prev.coins + bonus.coins,
      tickets: prev.tickets + bonus.tickets
    } : null);
  };

  // Coupon codes are checked and paid by the server, once per student (see
  // src/lib/claims.ts). The new balance arrives with the sync that follows.
  const claimPromoCode = async () => {
    playClickSound();
    const code = promoCode.trim();
    if (!code) return;
    try {
      const body = await apiRequest<{ reward: { coins: number } }>('/api/user/claim', 'No se pudo canjear el código.', {
        method: 'POST',
        body: JSON.stringify({ kind: 'code', code }),
      });
      setPromoFeedback(<span className="flex items-center gap-1"><Icon name="check" className="text-green-500" size={18} /> ¡Código válido! Recibes +{body.reward.coins} <Icon name="coins" size={18} /></span>);
      playRainbowSound();
      setPromoCode("");
      void syncToServer();
    } catch (error) {
      setPromoFeedback(<span className="flex items-center gap-1"><Icon name="x" className="text-red-500" size={18} /> {error instanceof Error ? error.message : 'No se pudo canjear el código.'}</span>);
      playErrorAlertSound();
    }
    setTimeout(() => setPromoFeedback(""), 4000);
  };

  // Direct Theme equip or purchase in the Shop
  const handleThemeClick = (t: any) => {
    if (!user) return;
    const purchased = purchasedThemes.includes(t.id);
    if (purchased) {
      setActiveTheme(t.id);
      setPreviewTheme(null);
      localStorage.setItem('fin_theme', t.id);
      playClickSound();
      showToast(`Tema "${t.name}" equipado.`, 'info');
      return;
    }
    if (user.coins >= t.price) {
      setUser(prev => prev ? { ...prev, coins: prev.coins - t.price } : null);
      setCoinsSpent(prev => prev + t.price);
      setPurchasedThemes(prev => [...prev, t.id]);
      setActiveTheme(t.id);
      setPreviewTheme(null);
      localStorage.setItem('fin_theme', t.id);
      playRainbowSound();
      showToast(`¡Compraste y equipaste el tema "${t.name}"!`, 'info');
    } else {
      playErrorAlertSound();
      showToast('No tienes suficientes monedas para este estilo.');
    }
  };

  const confirmThemePurchase = () => {
    if (!user || !previewTheme) return;
    if (previewTheme.isAlreadyPurchased) {
      setActiveTheme(previewTheme.id);
      localStorage.setItem('fin_theme', previewTheme.id);
      playClickSound();
      setPreviewTheme(null);
    } else {
      if (user.coins >= previewTheme.price) {
        setUser(prev => prev ? { ...prev, coins: prev.coins - previewTheme.price } : null);
        setCoinsSpent(prev => prev + previewTheme.price);
        setPurchasedThemes(prev => [...prev, previewTheme.id]);
        setActiveTheme(previewTheme.id);
        localStorage.setItem('fin_theme', previewTheme.id);
        playRainbowSound();
        setPreviewTheme(null);
      } else {
        playErrorAlertSound();
      }
    }
  };


  // Skip challenge
  const skipProblem = () => {
    if (!user) return;
    setPreviewTheme(null); // Revert preview if skipping
    let skipCost = 60;
    if ((equipedPet || PET_BUFFS[0]).buffType === 'skip_discount') {
      skipCost = Math.max(0, 60 - (equipedPet || PET_BUFFS[0]).value);
    }
    

    if (user.coins >= skipCost) {
      setUser(prev => prev ? { ...prev, coins: prev.coins - skipCost } : null);
      setSkipsUsed(prev => prev + 1);
      
      const isGolden = Math.random() > 0.85;
      const prob = generateMathProblem(isGolden, selectedTopic, currentLevel(), activeCourse);
      setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
      setInputAnswer("");
      setAnswerState({ type: 'idle', text: null });
      playClickSound();
    } else {
      playErrorAlertSound();
    }
  };

  const currentLevel = () =>
    selectedTopic ? (infiniteProgress[selectedTopic] || 0) : getCourseProgress(activeCourse, user);

  // Evaluate user submission
  const advanceEventProgress = () => {
    const nextStreak = streak + 1;
    let extraTickets = 0;
    let ticketsEarned = 0;
    
    if (nextStreak % 5 === 0) {
      extraTickets = nextStreak + ((equipedPet || PET_BUFFS[0]).buffType === 'combo_extra' ? (equipedPet || PET_BUFFS[0]).value : 0);
      ticketsEarned += extraTickets;
      playFrenzySound();
      setStats(prev => ({ ...prev, supernovas: prev.supernovas + 1 }));
    }
    
    const isInfiniteMode = !!selectedTopic;
    setUser(prev => {
      if (!prev) return null;
      if (isInfiniteMode) {
        return { ...prev, tickets: prev.tickets + ticketsEarned };
      }
      if (activeCourse === 'trigonometria') {
        const cp = prev.courseProgress || {};
        return { ...prev, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, trigonometria: Math.min(100, (cp.trigonometria || 0) + 1) } };
      }
      if (activeCourse === 'razonamiento_5to') {
        const cp = prev.courseProgress || {};
        return { ...prev, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, razonamiento_5to: Math.min(100, (cp.razonamiento_5to || 0) + 1) } };
      }
      if (activeCourse === 'geometria_5to') {
        const cp = prev.courseProgress || {};
        return { ...prev, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, geometria_5to: Math.min(100, (cp.geometria_5to || 0) + 1) } };
      }
      return { ...prev, tickets: prev.tickets + ticketsEarned, progress: Math.min(100, prev.progress + 1) };
    });
      if (isInfiniteMode && selectedTopic) {
        setInfiniteProgress(prev => ({
          ...prev,
          [selectedTopic]: (prev[selectedTopic] || 0) + 1
        }));
      }
      
      setStreak(nextStreak);
  };

  const checkAnswerSubmit = (e: React.FormEvent) => {
    const isInfiniteMode = !!selectedTopic;
    e.preventDefault();
    setPreviewTheme(null); // Revert preview if answering
    if (!user || currentProblem.solved) return;
    
    const isTruthTable = currentProblem.data.visualData?.type === 'truth_table';
    const valStr = inputAnswer.trim();

    if (isTruthTable) {
      if (!/^[VF]{4}$/i.test(valStr)) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400); // match animation duration
        playErrorAlertSound();
        return;
      }
    } else if (parseAnswer(valStr).length === 0) {
      // Not a number we can read: it isn't graded, the field just shakes
      // and says what it expects, instead of being marked wrong.
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400); // match animation duration
      playErrorAlertSound();
      setAnswerState({ type: 'hint', text: 'Escribe solo el número. Puedes usar coma decimal o una fracción, como 7/2.' });
      return;
    }

    const correctVal = keyValue(currentProblem.data.expectedAnswer) ?? 0;

    // Numbers are compared as numbers however they're written (see
    // src/lib/answers.ts); truth tables are compared letter by letter.
    const isCorrect = isTruthTable
      ? valStr.toUpperCase() === String(currentProblem.data.expectedAnswer).toUpperCase()
      : isCorrectAnswer(valStr, currentProblem.data.expectedAnswer);

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
      playRainbowSound();

      
      // Computes bases reward
      let coinsEarned = isInfiniteMode ? 20 : 0;
      let ticketsEarned = 10;
      
      // Apply buff multipliers
      if ((equipedPet || PET_BUFFS[0]).buffType === 'coins') coinsEarned += (equipedPet || PET_BUFFS[0]).value;
      if ((equipedPet || PET_BUFFS[0]).buffType === 'tickets') ticketsEarned += (equipedPet || PET_BUFFS[0]).value;
            
      // Golden modifiers
      if (currentProblem.data.isGolden) {
        coinsEarned *= 2;
        ticketsEarned *= 2;
      }
      if (currentProblem.data.isGolden) {
        coinsEarned *= 2;
        ticketsEarned *= 2;
      }

      // Supernova: every 5th hit in a row, or the next hit after buying
      // "Rally Alcista". The purchase used to set a flag nothing read — the
      // student paid 150 coins for no effect at all.
      const nextStreak = streak + 1;
      let extraTickets = 0;
      if (nextStreak % 5 === 0 || isSupernova) {
        extraTickets = Math.max(nextStreak, 5) + ((equipedPet || PET_BUFFS[0]).buffType === 'combo_extra' ? (equipedPet || PET_BUFFS[0]).value : 0);
        ticketsEarned += extraTickets;
        if (isSupernova) setIsSupernova(false);
        playFrenzySound();
        setStats(prev => ({ ...prev, supernovas: prev.supernovas + 1 }));
      }

      // Double Dividends buff
      if (activeDoubleDividends) {
        ticketsEarned *= 2;
        setActiveDoubleDividends(false);
      }

      // Award resources
      setUser(prev => {
        if (!prev) return null;
        if (isInfiniteMode) {
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned };
        }
        if (activeCourse === 'trigonometria') {
          const cp = prev.courseProgress || {};
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, trigonometria: Math.min(100, (cp.trigonometria || 0) + 1) } };
        }
        if (activeCourse === 'razonamiento_5to') {
          const cp = prev.courseProgress || {};
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, razonamiento_5to: Math.min(100, (cp.razonamiento_5to || 0) + 1) } };
        }
        if (activeCourse === 'geometria_5to') {
          const cp = prev.courseProgress || {};
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, geometria_5to: Math.min(100, (cp.geometria_5to || 0) + 1) } };
        }
        return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, progress: Math.min(100, prev.progress + 1) };
      });
      if (isInfiniteMode && selectedTopic) {
        setInfiniteProgress(prev => ({
          ...prev,
          [selectedTopic]: (prev[selectedTopic] || 0) + 1
        }));
      }

      setStreak(nextStreak);
      
      let speedText = nextStreak > 1 ? ` ¡Racha de x${nextStreak}! 🔥` : "";
      let boostText = extraTickets > 0 ? <span className="inline-flex items-center gap-1 text-purple-600">[¡SUPERNOVA! +{extraTickets} <Icon name="ticket" size={18} />]</span> : null;
      let goldenText = currentProblem.data.isGolden ? <span><Icon name="star" size={18} /> ¡DESAFÍO GOLDEN COMPLETO!</span> : "";

      setAnswerState({
        type: 'correct',
        text: <span className="flex items-center gap-1 flex-wrap justify-center">¡Correcto! {coinsEarned > 0 && <><span className="text-amber-500">+{coinsEarned}</span> <Icon name="coins" size={18} className="text-amber-500" /> |</>} <span className="text-blue-500">+{ticketsEarned}</span> <Icon name="ticket" size={18} className="text-blue-500" /> {speedText} {boostText} {goldenText}</span>
      });

      // Update statistics
      setStats(prev => {
        const topic = currentProblem.data.type || 'General';
        const currentTopicTickets = (prev.ticketsByTopic && prev.ticketsByTopic[topic]) || 0;
        return {
          ...prev,
          solved: prev.solved + 1,
          maxStreak: Math.max(prev.maxStreak, nextStreak),
          goldenWins: currentProblem.data.isGolden ? prev.goldenWins + 1 : prev.goldenWins,
          legendaryWins: correctVal >= 50 ? prev.legendaryWins + 1 : prev.legendaryWins,
          ticketsByTopic: {
            ...prev.ticketsByTopic,
            [topic]: currentTopicTickets + ticketsEarned
          }
        };
      });

      // Updates currentProblem
      setCurrentProblem(prev => ({ ...prev, solved: true }));

      // Events are now handled from the map directly, not auto-triggered here.

    } else {
      // Wrong response. The answer is deliberately NOT revealed here: it used
      // to be shown along with "¡Vuelve a intentarlo!", so the student could
      // read it and retype it for full rewards — the question taught nothing
      // and the progression meant nothing. Now the question closes, the miss
      // is filed under "Errores" (answer + explanation there, to review), and
      // the student moves on to a new one at the same level.
      playErrorAlertSound();

      if (shieldCount > 0) {
        setShieldCount(prev => prev - 1);
        setAnswerState({
          type: 'wrong',
          text: <><Icon name="x" className="inline-block" size={18} /> Incorrecto, pero tu Escudo salvó tu racha de 🔥 {streak}. Lo guardamos en Errores para repasarlo.</>
        });
        playShieldSound();
      } else {
        setStreak(0);
        setAnswerState({
          type: 'wrong',
          text: <span className="flex items-center gap-1 flex-wrap justify-center"><Icon name="x" size={18} /> Incorrecto. Lo guardamos en tus Errores con la explicación para que lo repases.</span>
        });
      }

      // Recorded whether or not a shield absorbed the streak loss: the shield
      // protects the streak, it doesn't mean the student got it right.
      const exist = mistakesList.some(m => m.problem === currentProblem.data.intro);
      if (!exist) {
        setMistakesList(prev => [
          {
            problem: currentProblem.data.intro,
            userAnswer: inputAnswer.trim(),
            correctAnswer: currentProblem.data.expectedAnswer,
            explanation: currentProblem.data.explanation,
            // What makes the teacher's view possible: without the topic a
            // mistake is just one problem, not a pattern across the class.
            topic: currentProblem.data.type,
          },
          ...prev
        ]);
      }

      setCurrentProblem(prev => ({ ...prev, failed: true }));
      setStats(prev => ({ ...prev, failedAttempts: prev.failedAttempts + 1 }));
    }
  };

  // Next level/new problem
  const loadNextProblem = () => {
    playClickSound();
    setPreviewTheme(null); // Revert preview just in case
    
    const isGolden = Math.random() > 0.85;
    const prob = generateMathProblem(isGolden, selectedTopic, currentLevel(), activeCourse);
    setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
    setInputAnswer("");
    setAnswerState({ type: 'idle', text: null });
  };
  // Generate random chest items
  const openRandomChest = (rarity: string) => {
    playEpicRevealSound();
    
    let numPieces = 4; // Always 4 pieces as requested
    let coins = rarity === 'legendary' ? 120 : (rarity === 'rare' ? 60 : 30);
    let tickets = rarity === 'legendary' ? 15 : (rarity === 'rare' ? 8 : 4);

    const wonPiecesList: UnplacedPiece[] = [];
    const newUnplacedPieces = [...unplacedPieces];

    for (let i = 0; i < numPieces; i++) {
      let alb = initialAlbums[Math.floor(Math.random() * initialAlbums.length)];
      let pIdx = Math.floor(Math.random() * alb.pieces);
      
      // Attempt to avoid duplicates (max 10 attempts)
      for (let attempt = 0; attempt < 10; attempt++) {
         const st = albumsState[alb.id] || { piecesOwned: [] };
         const isUnplaced = newUnplacedPieces.some(p => p.albumId === alb.id && p.pieceIndex === pIdx);
         if (!st.piecesOwned.includes(pIdx) && !isUnplaced) {
            break;
         }
         alb = initialAlbums[Math.floor(Math.random() * initialAlbums.length)];
         pIdx = Math.floor(Math.random() * alb.pieces);
      }
      
      const pieceData = { emoji: alb.emoji, albumName: alb.name, pieceIndex: pIdx, albumId: alb.id, cols: alb.cols, pieces: alb.pieces };
      wonPiecesList.push(pieceData);
      newUnplacedPieces.push(pieceData);
    }

    setUnplacedPieces(newUnplacedPieces);
    setOpenChestAnimation({
      isOpen: true,
      rewardType: rarity,
      piecesWon: wonPiecesList,
      coinsWon: coins,
      ticketsWon: tickets,
      rarity
    });

    setUser(prev => prev ? {
      ...prev,
      coins: prev.coins + coins,
      tickets: prev.tickets + tickets
    } : null);
  };

  const [openChestAnimation, setOpenChestAnimation] = useState<{
    isOpen: boolean;
    rewardType: string;
    piecesWon: any[];
    coinsWon: number;
    ticketsWon: number;
    rarity: string;
  }>({
    isOpen: false,
    rewardType: 'common',
    piecesWon: [],
    coinsWon: 0,
    ticketsWon: 0,
    rarity: 'common'
  });

  // Claim collection puzzle completion rewards
  const claimAlbumReward = (albumId: string) => {
    const alb = initialAlbums.find(a => a.id === albumId);
    if (!alb || !user) return;
    const st = albumsState[albumId];
    if (st && st.completed && !st.claimed) {
      setAlbumsState(prev => ({
        ...prev,
        [albumId]: { ...prev[albumId], claimed: true }
      }));
      setUser(prev => prev ? { ...prev, tickets: prev.tickets + alb.reward } : null);
      playRainbowSound();
    }
  };

  const placePiece = (unplacedIndex: number) => {
    const piece = unplacedPieces[unplacedIndex];
    if (!piece) return;

    playClickSound(); // maybe another satisfying "pop" sound or something
    
    setAlbumsState(prev => {
      const current = prev[piece.albumId];
      const owned = current?.piecesOwned || [];
      // Copied, never pushed into: mutating prev's array in place makes the
      // update invisible to React and corrupts the previous state.
      const piecesOwned = owned.includes(piece.pieceIndex) ? owned : [...owned, piece.pieceIndex];
      const alb = initialAlbums.find(a => a.id === piece.albumId);
      return {
        ...prev,
        [piece.albumId]: {
          piecesOwned,
          completed: alb ? piecesOwned.length === alb.pieces : current?.completed || false,
          claimed: current?.claimed || false,
        },
      };
    });

    setUnplacedPieces(prev => {
      const next = [...prev];
      next.splice(unplacedIndex, 1);
      return next;
    });
  };

  // Roulette Wheel spin draw
  const handleSpinWheel = () => {
    if (!user || tickets < 15 || spinning) return;
    setSpinning(true);
    setLastPrize(null);
    setUser(prev => prev ? { ...prev, tickets: prev.tickets - 15 } : null);

    startTickingSound(4000);

    // Aimed at the slice as it's drawn (each as wide as its probability),
    // from wherever the wheel is now — see src/lib/wheel.ts. It used to
    // stop on a different prize from the one awarded.
    const prizeIndex = pickPrize(roulettePrizes, Math.random());
    const prize: any = roulettePrizes[prizeIndex];
    setWheelRotation(spinTo(wheelRotation, roulettePrizes, prizeIndex, Math.random()));

    setTimeout(() => {
      setSpinning(false);
      setLastPrize(prize.text);
      playEpicRevealSound();

      if (prize.type === 'coins') {
        setUser(prev => prev ? { ...prev, coins: prev.coins + prize.val } : null);
      } else if (prize.type === 'tickets') {
        setUser(prev => prev ? { ...prev, tickets: prev.tickets + prize.val } : null);
      }
    }, 4000);
  };

  // Minigame completions. Unlike chests, the pieces land straight in the
  // album (nothing to place by hand) — the modal is just the reveal.
  const awardMinigamePieces = (count: number, rarity: string) => {
    advanceEventProgress();
    if (count <= 0 || !user) return;

    // Drawn outside the updater: React calls updaters twice in StrictMode,
    // which would otherwise double every won piece in the reveal modal.
    const wonPieces = Array.from({ length: count }, () => {
      const alb = initialAlbums[Math.floor(Math.random() * initialAlbums.length)];
      const pieceIndex = Math.floor(Math.random() * alb.pieces);
      return { emoji: alb.emoji, albumName: alb.name, pieceIndex, albumId: alb.id, cols: alb.cols, pieces: alb.pieces };
    });

    setAlbumsState(prev => {
      const next = { ...prev };
      for (const piece of wonPieces) {
        const owned = next[piece.albumId]?.piecesOwned || [];
        const piecesOwned = owned.includes(piece.pieceIndex) ? owned : [...owned, piece.pieceIndex];
        next[piece.albumId] = {
          piecesOwned,
          completed: piecesOwned.length === piece.pieces,
          claimed: next[piece.albumId]?.claimed || false,
        };
      }
      return next;
    });

    setOpenChestAnimation({
      isOpen: true,
      rewardType: 'minigame',
      piecesWon: wonPieces,
      coinsWon: 0,
      ticketsWon: 0,
      rarity,
    });
  };

  const onFinishShellGame = (piecesWon: number) => {
    setShowShellGame(false);
    awardMinigamePieces(piecesWon, 'common');
  };

  const onFinishPetRace = (piecesWon: number) => {
    setShowPetRace(false);
    awardMinigamePieces(piecesWon, 'rare');
  };

  // Easy shortcuts
  const themeObj = themes.find(t => t.id === (previewTheme?.id || activeTheme)) || themes[0];
  const currentThemeStyle = THEME_STYLES[previewTheme?.id || activeTheme] || THEME_STYLES.default;
  const coinsReal = user?.coins || 0;
  const ticketsReal = user?.tickets || 0;
  const coins = useAnimatedNumber(coinsReal);
  const tickets = useAnimatedNumber(ticketsReal);
  const progress = getCourseProgress(activeCourse, user);

  const getNextMilestoneText = () => {
    const nextProgress = Math.min(100, progress + 1);
    if (nextProgress > 0 && nextProgress % 20 === 0) return "¡Ruleta de la Suerte!";
    if ((nextProgress + 1) % 12 === 0) return "¡Minijuego Shell Game!";
    if ((nextProgress + 1) % 12 === 6) return "¡Carrera de Campeones!";
    if ((nextProgress + 1) % 3 === 0) return "¡Cofre de Recompensas!";
    return "¡Desafío Geométrico!";
  };

  // Wipes local game-state cache so the next student on a shared
  // computer never sees the previous student's progress.
  const handleLogout = async () => {
    playClickSound();
    // Must happen before signOut (the token goes away) and before the wipe
    // below, or the student's session is lost instead of saved.
    await syncToServer();
    while (syncInFlight.current) await syncInFlight.current;
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
    LOCAL_GAME_KEYS.forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  // Claimed on the server, once a day each. They used to be settled in
  // memory only, so reloading the page made every challenge claimable again.
  const claimingChallenge = useRef(false);
  const claimChallenge = async (challenge: any) => {
    if (claimedChallenges.includes(challenge.id) || claimingChallenge.current) return;
    claimingChallenge.current = true;
    playClickSound();
    try {
      // The server checks the challenge against the balance and stats it
      // has, so it has to have the latest ones first.
      await syncToServer();
      while (syncInFlight.current) await syncInFlight.current;
      const body = await apiRequest<{ user: { claims?: { daily?: { ids?: number[] } } } }>(
        '/api/user/claim',
        'No se pudo reclamar el premio.',
        { method: 'POST', body: JSON.stringify({ kind: 'daily', id: challenge.id }) },
      );
      setClaimedChallenges(body.user.claims?.daily?.ids ?? [...claimedChallenges, challenge.id]);
      showToast(`¡Premio reclamado! +${challenge.reward.amount} ${challenge.reward.type === 'coins' ? 'monedas' : 'tickets'}`, 'info');
      void syncToServer();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'No se pudo reclamar el premio.', 'warn');
    } finally {
      claimingChallenge.current = false;
    }
  };

  const challengeInputs = { coins, tickets, progress: user?.progress, courseProgress: user?.courseProgress, stats };
  const dailyChallenges = DAILY_CHALLENGES.map((c) => ({
    ...c,
    current: Math.min(challengeValue(c.metric, challengeInputs), c.target),
  }));

  if (!authChecked || showLoginScreen === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (showLoginScreen && showRegisterScreen) {
    return <Suspense fallback={<Loading />}><SchoolRegister onBackToLogin={() => setShowRegisterScreen(false)} /></Suspense>;
  }

  const loginOverlay = showLoginScreen ? (
    <ColegioLogin
      key="colegio-login-overlay"
      onLoginSuccess={() => setShowLoginScreen(false)}
      onRegisterSchool={() => setShowRegisterScreen(true)}
    />
  ) : null;

  if (!authUser && showLoginScreen) {
    return <>{loginOverlay}</>;
  }

  if (platformAdmin) {
    return <>{loginOverlay}<Suspense fallback={<Loading />}><PlatformConsole email={platformAdmin.email} onLogout={handleLogout} /></Suspense></>;
  }

  if (profileLoadError) {
    return (
      <>
        {loginOverlay}
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-sm text-center space-y-4">
            <p className="font-bold text-slate-700">{profileLoadError}</p>
            <button
              onClick={() => { setProfileLoadError(null); handleLogout(); }}
              className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-2 text-sm"
            >
              Cerrar sesión e intentar con otra cuenta
            </button>
          </div>
        </div>
      </>
    );
  }

  if (mustChangePassword && authUser?.email) {
    return (
      <>
        {loginOverlay}
        <ChangePasswordForm
          mode="forced"
          email={authUser.email}
          dni={accountDni}
          onDone={() => {
            setMustChangePassword(false);
            showToast('Listo: ya tienes tu propia contraseña.', 'info');
          }}
          onCancel={handleLogout}
        />
      </>
    );
  }

  if (!user) {
    return (
      <>
        {loginOverlay}
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      {loginOverlay}
      <AnimatePresence>
        {/* Choosing an animal avatar is part of the student game; a teacher
            signing in for the first time shouldn't be greeted with it. */}
        {user && !user.setupCompleted && !isStaff && (
          <InitialSetup name={user.name} onComplete={handleInitialSetupComplete} />
        )}
      </AnimatePresence>
      <div className={`min-h-screen w-full transition-all duration-500 p-4 pb-16 font-sans select-none relative overflow-x-hidden ${currentThemeStyle.bgClass}`}>
      <FloatingMathBackground />

      {/* Confetti Celebration */}
      {showConfetti && <ConfettiOverlay />}

      <Toast toast={toast} />

      {/* Tutorial Overlay (Interactive Guide) — never for staff, whose accounts
          skip straight to a completed setup and have no game loop to learn. */}
      {!isStaff && tutorialStep > 0 && tutorialStep <= 3 && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <Card className="w-full max-w-lg border-4 border-blue-500 bg-white p-6 md:p-8 text-center animate-pop relative shadow-2xl">
            {/* Step badge */}
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-black text-xs uppercase tracking-widest rounded-full">
                Paso {tutorialStep} de 3
              </span>
              <button 
                onClick={() => { playClickSound(); setTutorialStep(0); }}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs underline cursor-pointer"
              >
                Saltar Tutorial
              </button>
            </div>

            <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-200 text-blue-600 shadow-inner">
              {tutorialStep === 1 ? <Icon name="teacher" size={44} /> :
               tutorialStep === 2 ? <Icon name="home" size={44} /> :
               <Icon name="store" size={44} />}
            </div>

            <h4 className="text-2xl font-black text-slate-800 mb-2">
              {tutorialStep === 1 ? "1. Resuelve Desafíos Matemáticos" :
               tutorialStep === 2 ? "2. Avanza en el Mapa Arcano" :
               "3. Conquista la Tienda y Logros"}
            </h4>

            <p className="text-sm md:text-base font-medium text-slate-600 mb-6 leading-relaxed">
              {tutorialStep === 1 ? "Resuelve ejercicios de variación de área y razonamiento matemático. El Códice de Fórmulas y el Asistente AI te guiarán paso a paso." : 
               tutorialStep === 2 ? "Al responder acertadamente, avanzarás por el mapa de hitos. Cada parada incluye Cajas Misteriosas, Ruletas de la Fortuna y Minijuegos de OVNI o Carreras." : 
               "Acumula Monedas y Tickets para canjear Mascotas, Escudos, Temas y Álbumes de Colección. ¡Completa todos los Trofeos del Perfil!"}
            </p>

            {/* Step Indicators */}
            <div className="flex justify-center items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={`h-2.5 rounded-full transition-all ${tutorialStep === s ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-200'}`} 
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              {tutorialStep > 1 && (
                <Button 
                  onClick={() => { playClickSound(); setTutorialStep(prev => prev - 1); }} 
                  color="slate" 
                  className="w-1/3 py-3 font-black"
                >
                  Anterior
                </Button>
              )}
              <Button 
                onClick={() => { 
                  playClickSound(); 
                  if (tutorialStep === 3) setTutorialStep(0); 
                  else setTutorialStep(prev => prev + 1); 
                }} 
                color="blue"
                className="flex-1 py-3 text-base font-black uppercase tracking-wider"
              >
                {tutorialStep === 3 ? "¡Empezar Aventura! 🚀" : "Siguiente ➔"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      <AnimatePresence initial={false}>
      {viewMode !== 'exercise' ? (
        <PageReveal key="main-app" skipInitial={!hasEnteredExerciseRef.current} bgClass={currentThemeStyle.bgClass} className="max-w-[1600px] xl:max-w-[1850px] w-full px-4 lg:px-6 xl:px-10 mx-auto flex flex-col lg:flex-row landscape:flex-row gap-4 lg:gap-6 landscape:gap-3 h-[calc(100vh-2rem)] z-30 relative landscape-mini">
           
           {/* Left Navigation Sidebar */}
           <div className={`nav-sidebar hidden lg:flex landscape:flex flex-col w-64 landscape:max-lg:w-44 h-fit rounded-[2.5rem] p-6 landscape:max-lg:p-4 border-2 shadow-sm relative overflow-hidden ${currentThemeStyle.cardBg}`}>
              <div className="flex items-center mb-8 landscape:max-lg:mb-4">
                <img src="/img/logo_colegio.png" alt="Logo Colegio" className="h-10 w-auto object-contain ml-2 drop-shadow-md" />
              </div>
              <nav className="flex flex-col gap-2 landscape:max-lg:gap-1 z-10 landscape:max-lg:text-sm">
                 {!isStaff && (<>
                 <button onClick={() => { setSelectedTopic(null); setViewMode('map'); }} className={`flex items-center gap-4 ${viewMode === 'map' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'map' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="home" className="relative z-10" /> <span className="relative z-10">Aprender</span>
                 </button>
                 <button onClick={() => setViewMode('practice')} className={`flex items-center gap-4 ${viewMode === 'practice' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'practice' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="infinity" className="relative z-10" /> <span className="relative z-10">Infinito</span>
                 </button>
                 <button onClick={() => setViewMode('album')} className={`flex items-center gap-4 ${viewMode === 'album' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'album' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="folder" className="relative z-10" /> <span className="relative z-10">Álbumes</span>
                 </button>
                 <button onClick={() => setViewMode('shop')} className={`flex items-center gap-4 ${viewMode === 'shop' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'shop' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="store" className="relative z-10" /> <span className="relative z-10">Tienda</span>
                 </button>
                 </>)}
                 <button onClick={() => setViewMode('profile')} className={`flex items-center gap-4 ${viewMode === 'profile' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                    {viewMode === 'profile' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                    <Icon name="user" className="relative z-10" /> <span className="relative z-10">Perfil</span>
                 </button>
                 {isStaff && (
                   <button onClick={() => setViewMode('teacher_dash')} className={`flex items-center gap-4 ${viewMode === 'teacher_dash' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
                      {viewMode === 'teacher_dash' && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-blue-50/80 border-2 border-blue-200 rounded-2xl z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                      <Icon name="users" className="relative z-10" /> <span className="relative z-10">Usuario</span>
                   </button>
                 )}
              </nav>
           </div>

           {/* Main Content Area */}
           <div className={`flex-1 rounded-[2.5rem] border-2 md:border-[3px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col ${currentThemeStyle.bentoBg}`}>
              <AnimatePresence initial={false} mode="wait">
              {viewMode === 'map' && (<TabTransition type="swipe" key="map">
                <div key="map" className="flex-1 flex flex-col h-full relative z-10">
                  <div className={`p-4 border-b-2 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative ${currentThemeStyle.headerBg}`}>
                     <div>
                       <div className="flex items-center gap-2">
                         <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest text-white ${progress < 50 ? 'bg-blue-600' : 'bg-violet-600'}`}>
                           {progress < 50 ? 'III Bimestre' : 'IV Bimestre'}
                         </span>
                         <h3 className={`font-black uppercase tracking-widest text-sm ${currentThemeStyle.textPrimary}`}>Etapa {Math.floor(progress/20) + 1} • Nivel {progress + 1}</h3>
                       </div>
                       <p className="text-xs font-bold text-slate-500 mt-0.5">
                         {activeCourse === 'trigonometria' ? (
                           progress < 10 ? 'Propiedades de las RT' : progress < 20 ? 'Resolución de Triángulos' : progress < 30 ? 'Ángulos Verticales' : progress < 40 ? 'Geometría Analítica' : progress < 50 ? 'Ángulos en Posición Normal' : progress < 60 ? 'Reducción al 1er Cuadrante' : progress < 70 ? 'Circunferencia Trigonométrica' : progress < 80 ? 'Identidades Trigonométricas' : progress < 90 ? 'Ángulos Compuestos' : 'Ángulo Doble y Mitad'
                         ) : activeCourse === 'geometria_5to' ? (
                           progress < 10 ? 'Relaciones Métricas' : progress < 20 ? 'Áreas de Regiones' : progress < 30 ? 'Superficies Circulares' : progress < 40 ? 'Geometría del Espacio' : progress < 50 ? 'Sólidos y Poliedros' : progress < 60 ? 'Prisma y Cilindro' : progress < 70 ? 'Pirámide y Cono' : progress < 80 ? 'Esfera y Pappus-Guldin' : progress < 90 ? 'Recta y Circunferencia' : 'Parábola y Elipse'
                         ) : activeCourse === 'razonamiento_5to' ? (
                           progress < 9 ? 'Edades' : progress < 17 ? 'Cronometría Avanzada' : progress < 25 ? 'Lógica Inferencial' : progress < 33 ? 'Fracciones y Mezclas' : progress < 42 ? 'Matemática Financiera' : progress < 50 ? 'Planteo de Ecuaciones' : progress < 58 ? 'Análisis Combinatorio' : progress < 67 ? 'Probabilidades' : progress < 75 ? 'Sucesiones y Series' : progress < 83 ? 'Operadores y Logaritmos' : progress < 92 ? 'Máximos y Mínimos' : 'Suficiencia de Datos'
                         ) : (
                           progress < 10 ? 'Métodos Operativos' : progress < 20 ? 'Criptoaritmética' : progress < 30 ? 'Lógica Recreativa' : progress < 40 ? 'Cronometría Básica' : progress < 50 ? 'Conteo de Figuras' : progress < 60 ? 'Sucesiones y Analogías' : progress < 70 ? 'Series y Sumatorias' : progress < 80 ? 'Operadores Matemáticos' : progress < 90 ? 'Fracciones y Porcentajes' : 'Certezas y Conteo'
                         )}
                       </p>
                     </div>
                     <button 
                       onClick={() => { playClickSound(); setShowDictLab(true); }}
                       className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all border-2 border-indigo-200 cursor-pointer"
                     >
                       <span className="text-lg md:text-xl">📖</span>
                       <div className="flex flex-col items-start text-left">
                         <span className="leading-none mb-0.5 text-sm font-black">Códice de Fórmulas</span>
                         <span className="text-[10px] font-bold opacity-80 leading-none">III y IV Bimestre ✨</span>
                       </div>
                     </button>
                     <CourseSelector activeCourse={activeCourse} setActiveCourse={setActiveCourse} user={user} />
                  </div>
                  
                  <div className="flex-1 relative overflow-hidden">
                    <ProgressMap
                      progress={progress}
                      activeCourse={activeCourse}
                      onNodeClick={(step) => {
                        if (step < progress) {
                          if ((step + 1) % 3 !== 0 || (step % 20 === 0) || step === 50) {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          } else showToast("Ya reclamaste esta recompensa en el pasado.", "info");
                        } else if (step === progress) {
                          if ((step + 1) % 3 === 0 && (step % 20 !== 0) && (step !== 50)) { 
                             const cycle = Math.floor(step / 3);
                             if (cycle % 7 === 0) {
                               setShowShellGame(true);
                             } else if (cycle % 7 === 3) {
                               setShowPetRace(true);
                             } else {
                               openRandomChest('rare');
                               advanceEventProgress();
                             }
                          } else {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </TabTransition>)}

              {viewMode === 'infinite_map' && selectedTopic && (<TabTransition type="swipe" key="infinite_map">
                <div key="infinite_map" className="flex-1 flex flex-col h-full relative z-10">
                  <div className={`p-4 border-b-2 z-50 flex items-center justify-between shadow-sm relative ${currentThemeStyle.headerBg}`}>
                     <div>
                       <h3 className={`font-black uppercase tracking-widest text-sm ${currentThemeStyle.textPrimary}`}>Modo Infinito</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {{
                           // RM Básico III y IV Bimestre
                           'metodos': 'Métodos Operativos (III Bim.)',
                           'cripto': 'Criptoaritmética (III Bim.)',
                           'logica': 'Lógica Recreativa (III Bim.)',
                           'cronometria': 'Cronometría Básica (III Bim.)',
                           'conteo': 'Conteo de Figuras (III Bim.)',
                           'sucesiones': 'Sucesiones y Analogías (IV Bim.)',
                           'series': 'Series y Sumatorias (IV Bim.)',
                           'operadores': 'Operadores Matemáticos (IV Bim.)',
                           'fracciones_rm': 'Fracciones y Porcentajes (IV Bim.)',
                           'certezas': 'Certezas y Conteo (IV Bim.)',
                           // RM 5to III y IV Bimestre
                           'edades': 'Edades (III Bim.)',
                           'cronometria_avanzada': 'Cronometría Avanzada (III Bim.)',
                           'logica_inferencial': 'Lógica Inferencial (III Bim.)',
                           'mezclas_aleaciones': 'Fracciones y Mezclas (III Bim.)',
                           'matematica_financiera': 'Matemática Financiera (III Bim.)',
                           'planteo_ecuaciones': 'Planteo de Ecuaciones (III Bim.)',
                           'analisis_combinatorio': 'Análisis Combinatorio (IV Bim.)',
                           'probabilidades': 'Probabilidades (IV Bim.)',
                           'sucesiones_series_5to': 'Sucesiones y Series (IV Bim.)',
                           'logaritmos_rm': 'Operadores y Logaritmos (IV Bim.)',
                           'maximos_minimos': 'Máximos y Mínimos (IV Bim.)',
                           'suficiencia_datos': 'Suficiencia de Datos (IV Bim.)',
                           // Trigonometría III y IV Bimestre
                           'propiedades_rt': 'Propiedades de las RT (III Bim.)',
                           'resolucion_triangulos': 'Resolución de Triángulos (III Bim.)',
                           'angulos_verticales': 'Ángulos Verticales (III Bim.)',
                           'geometria_analitica': 'Geometría Analítica (III Bim.)',
                           'angulos_posicion_normal': 'Ángulos en Posición Normal (III Bim.)',
                           'reduccion_primer_cuadrante': 'Reducción al 1er Cuadrante (IV Bim.)',
                           'circunferencia_trigonometrica': 'Circunferencia Trigonométrica (IV Bim.)',
                           'identidades_trigonometricas': 'Identidades Trigonométricas (IV Bim.)',
                           'angulos_compuestos': 'Ángulos Compuestos (IV Bim.)',
                           'angulo_doble': 'Ángulo Doble y Mitad (IV Bim.)',
                           // Geometría 5to III y IV Bimestre
                           'relaciones_metricas': 'Relaciones Métricas (III Bim.)',
                           'areas_regiones': 'Áreas de Regiones Planas (III Bim.)',
                           'superficies_circulares': 'Superficies Circulares (III Bim.)',
                           'geometria_espacio': 'Geometría del Espacio (III Bim.)',
                           'solidos_poliedros': 'Sólidos y Poliedros (III Bim.)',
                           'prisma_cilindro': 'Prisma y Cilindro (IV Bim.)',
                           'piramide_cono': 'Pirámide y Cono (IV Bim.)',
                           'esfera_teoremas': 'Esfera y Pappus-Guldin (IV Bim.)',
                           'recta_circunferencia': 'Recta y Circunferencia (IV Bim.)',
                           'parabola_elipse': 'Parábola y Elipse (IV Bim.)'
                         }[selectedTopic] || 'Modo Infinito'}
                       </p>
                     </div>
                     <div className="flex items-center gap-2">
                       <button 
                         onClick={() => { playClickSound(); setShowDictLab(true); }}
                         className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all shadow-sm"
                       >
                         <Icon name="book" size={18} />
                         Códice
                       </button>
                       <button onClick={() => setViewMode('practice')} className="p-2 bg-slate-200/50 rounded-lg hover:bg-slate-300/50 transition-colors">
                         <Icon name="x" size={20} className="text-slate-600" />
                       </button>
                     </div>
                  </div>
                  
                  <div className="flex-1 relative overflow-hidden">
                     <ProgressMap 
                       progress={infiniteProgress[selectedTopic] || 0} 
                       isInfiniteMode={true}
                       activeCourse={activeCourse}
                       totalStepsOverride={200}
                       onNodeClick={(step) => {
                        const curProg = infiniteProgress[selectedTopic] || 0;
                        if (step < curProg) {
                          if ((step + 1) % 3 !== 0) {
                            const prob = generateMathProblem(false, selectedTopic, step, activeCourse);
                            setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
                            setInputAnswer("");
                            setAnswerState({ type: 'idle', text: null });
                            setViewMode('exercise');
                          } else showToast("Ya reclamaste esta recompensa en el pasado.", "info");
                        } else if (step === curProg) {
                          if ((step + 1) % 3 === 0 && (step % 10 !== 0)) { 
                             if ((Math.floor((step + 1) / 3)) % 7 === 0) {
                               setShowShellGame(true);
                             } else if ((Math.floor((step + 1) / 3)) % 7 === 3) {
                               setShowPetRace(true);
                             } else {
                               setShowShellGame(true);
                             }
                          } else {
                            const prob = generateMathProblem(false, selectedTopic, step, activeCourse);
                            setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
                            setInputAnswer("");
                            setAnswerState({ type: 'idle', text: null });
                            setViewMode('exercise');
                          }
                        }
                     }} />
                  </div>
                </div>
              </TabTransition>)}
              
              {viewMode === 'practice' && (<TabTransition type="swipe" key="practice">
                <div key="practice" className="flex-1 flex flex-col h-full relative z-10">
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50">
                     <div className="max-w-5xl mx-auto">
                       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 md:p-5 rounded-3xl border-2 border-slate-200">
                         <div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                             Entrenamiento Libre por Temas
                           </span>
                           <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1">Práctica Infinita</h2>
                         </div>
                         <div className="flex flex-wrap items-center gap-3">
                           <button 
                             onClick={() => { playClickSound(); setShowDictLab(true); }}
                             className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white hover:bg-indigo-500 font-black text-xs uppercase tracking-wider rounded-xl border-b-4 border-indigo-800 transition-all cursor-pointer"
                           >
                             <Icon name="book" size={16} />
                             Códice de Fórmulas
                           </button>
                           <CourseSelector activeCourse={activeCourse} setActiveCourse={setActiveCourse} user={user} />
                         </div>
                       </div>

                       {(() => {
                         const courseCurriculum = activeCourse === 'geometria_5to' ? {
                           bimestre3: [
                             { id: 'relaciones_metricas', name: 'Relaciones Métricas', sub: 'Triángulos rectángulos y circunferencia', icon: '📐', color: 'bg-rose-500', border: 'border-rose-700' },
                             { id: 'areas_regiones', name: 'Áreas de Regiones Planas', sub: 'Regiones triangulares y cuadrangulares', icon: '🟦', color: 'bg-fuchsia-500', border: 'border-fuchsia-700' },
                             { id: 'superficies_circulares', name: 'Superficies Circulares', sub: 'Círculo, sector y corona circular', icon: '⭕', color: 'bg-pink-500', border: 'border-pink-700' },
                             { id: 'geometria_espacio', name: 'Geometría del Espacio', sub: 'Rectas, planos y teorema de las 3 perpendiculares', icon: '🧊', color: 'bg-purple-500', border: 'border-purple-700' },
                             { id: 'solidos_poliedros', name: 'Sólidos y Poliedros', sub: 'Teorema de Euler y poliedros regulares', icon: '🎲', color: 'bg-indigo-500', border: 'border-indigo-700' }
                           ],
                           bimestre4: [
                             { id: 'prisma_cilindro', name: 'Prisma y Cilindro', sub: 'Área lateral, total y volumen de rectos', icon: '🏛️', color: 'bg-emerald-500', border: 'border-emerald-700' },
                             { id: 'piramide_cono', name: 'Pirámide y Cono', sub: 'Apotema piramidal, generatriz y volumen', icon: '🔺', color: 'bg-amber-500', border: 'border-amber-700' },
                             { id: 'esfera_teoremas', name: 'Esfera y Pappus-Guldin', sub: 'Superficie esférica y sólidos de revolución', icon: '🌐', color: 'bg-cyan-500', border: 'border-cyan-700' },
                             { id: 'recta_circunferencia', name: 'Recta y Circunferencia', sub: 'Pendiente y ecuación ordinaria en el plano', icon: '📈', color: 'bg-blue-500', border: 'border-blue-700' },
                             { id: 'parabola_elipse', name: 'Secciones Cónicas: Parábola y Elipse', sub: 'Foco, parámetro focal y lado recto', icon: '🪐', color: 'bg-violet-600', border: 'border-violet-800' }
                           ]
                         } : activeCourse === 'trigonometria' ? {
                           bimestre3: [
                             { id: 'propiedades_rt', name: 'Propiedades de las R.T.', sub: 'Razones recíprocas y complementarias', icon: '📐', color: 'bg-indigo-500', border: 'border-indigo-700' },
                             { id: 'resolucion_triangulos', name: 'Resolución de Triángulos', sub: 'Cálculo de lados y área trigonométrica', icon: '📏', color: 'bg-teal-500', border: 'border-teal-700' },
                             { id: 'angulos_verticales', name: 'Ángulos Verticales', sub: 'Ángulos de elevación y depresión', icon: '👀', color: 'bg-orange-500', border: 'border-orange-700' },
                             { id: 'geometria_analitica', name: 'Geometría Analítica', sub: 'Distancia entre puntos, punto medio y baricentro', icon: '📍', color: 'bg-cyan-500', border: 'border-cyan-700' },
                             { id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', sub: 'Signos en los cuadrantes y ángulos coterminales', icon: '🔄', color: 'bg-pink-500', border: 'border-pink-700' }
                           ],
                           bimestre4: [
                             { id: 'reduccion_primer_cuadrante', name: 'Reducción al 1er Cuadrante', sub: 'Ángulos mayores de 90° y negativos', icon: '🧭', color: 'bg-blue-600', border: 'border-blue-800' },
                             { id: 'circunferencia_trigonometrica', name: 'Circunferencia Trigonométrica', sub: 'Líneas seno, coseno y variación analítica', icon: '⭕', color: 'bg-emerald-500', border: 'border-emerald-700' },
                             { id: 'identidades_trigonometricas', name: 'Identidades Trigonométricas', sub: 'Identidades pitagóricas, por cociente y auxiliares', icon: '⚡', color: 'bg-amber-500', border: 'border-amber-700' },
                             { id: 'angulos_compuestos', name: 'Ángulos Compuestos', sub: 'Seno, coseno y tangente de la suma y resta', icon: '➕', color: 'bg-purple-600', border: 'border-purple-800' },
                             { id: 'angulo_doble', name: 'Ángulo Doble y Mitad', sub: 'Fórmulas del arco doble y degradación', icon: '✌️', color: 'bg-rose-500', border: 'border-rose-700' }
                           ]
                         } : activeCourse === 'razonamiento_5to' ? {
                           bimestre3: [
                             { id: 'edades', name: 'Problemas de Edades', sub: 'Cuadros de tiempos: pasado, presente y futuro', icon: '👨‍👦', color: 'bg-blue-500', border: 'border-blue-700' },
                             { id: 'cronometria_avanzada', name: 'Cronometría Avanzada', sub: 'Adelantos, atrasos y ángulo entre manecillas', icon: '⏳', color: 'bg-sky-500', border: 'border-sky-700' },
                             { id: 'logica_inferencial', name: 'Lógica Inferencial', sub: 'Verdades, mentiras y proposiciones lógicas', icon: '🧠', color: 'bg-violet-500', border: 'border-violet-700' },
                             { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', sub: 'Reducción a la unidad y precio medio', icon: '🧪', color: 'bg-amber-500', border: 'border-amber-700' },
                             { id: 'matematica_financiera', name: 'Matemática Financiera', sub: 'Variación porcentual e interés simple', icon: '💰', color: 'bg-rose-500', border: 'border-rose-700' },
                             { id: 'planteo_ecuaciones', name: 'Planteo de Ecuaciones', sub: 'Traducción algebraica de enunciados', icon: '📊', color: 'bg-emerald-500', border: 'border-emerald-700' }
                           ],
                           bimestre4: [
                             { id: 'analisis_combinatorio', name: 'Análisis Combinatorio', sub: 'Permutaciones lineales, circulares y combinaciones', icon: '🔢', color: 'bg-indigo-600', border: 'border-indigo-800' },
                             { id: 'probabilidades', name: 'Cálculo de Probabilidades', sub: 'Regla de Laplace y sucesos independientes', icon: '🎲', color: 'bg-teal-500', border: 'border-teal-700' },
                             { id: 'sucesiones_series_5to', name: 'Sucesiones y Series Notables', sub: 'Suma de cuadrados, cubos y serie infinita', icon: '📈', color: 'bg-orange-500', border: 'border-orange-700' },
                             { id: 'logaritmos_rm', name: 'Operadores y Logaritmos', sub: 'Leyes de definición y propiedades logarítmicas', icon: '🧮', color: 'bg-cyan-600', border: 'border-cyan-800' },
                             { id: 'maximos_minimos', name: 'Máximos y Mínimos', sub: 'Optimización algebraica y certeza extrema', icon: '⛰️', color: 'bg-fuchsia-600', border: 'border-fuchsia-800' },
                             { id: 'suficiencia_datos', name: 'Suficiencia de Datos', sub: 'Evaluación lógica de datos I y II', icon: '⚖️', color: 'bg-slate-700', border: 'border-slate-900' }
                           ]
                         } : {
                           bimestre3: [
                             { id: 'metodos', name: 'Métodos Operativos', sub: 'Método del Cangrejo y del Rombo', icon: '🧠', color: 'bg-blue-500', border: 'border-blue-700' },
                             { id: 'cripto', name: 'Criptoaritmética', sub: 'Reconstrucción de cifras ocultas', icon: '🔢', color: 'bg-emerald-500', border: 'border-emerald-700' },
                             { id: 'logica', name: 'Lógica Recreativa', sub: 'Relaciones de tiempo y parentesco familiar', icon: '🎲', color: 'bg-amber-500', border: 'border-amber-700' },
                             { id: 'cronometria', name: 'Cronometría Básica', sub: 'Campanadas, intervalos y tiempo transcurrido', icon: '⏱️', color: 'bg-purple-500', border: 'border-purple-700' },
                             { id: 'conteo', name: 'Conteo de Figuras', sub: 'Fórmula inductiva para segmentos y triángulos', icon: '📐', color: 'bg-rose-500', border: 'border-rose-700' }
                           ],
                           bimestre4: [
                             { id: 'sucesiones', name: 'Sucesiones y Analogías', sub: 'Patrones numéricos de 1er y 2do orden', icon: '🔗', color: 'bg-indigo-600', border: 'border-indigo-800' },
                             { id: 'series', name: 'Series y Sumatorias', sub: 'Suma de Gauss, pares e impares consecutivos', icon: '➕', color: 'bg-teal-500', border: 'border-teal-700' },
                             { id: 'operadores', name: 'Operadores Matemáticos', sub: 'Reglas de definición arbitraria', icon: '⚙️', color: 'bg-orange-500', border: 'border-orange-700' },
                             { id: 'fracciones_rm', name: 'Fracciones y Porcentajes', sub: 'Relación parte-todo y tanto por ciento', icon: '📊', color: 'bg-cyan-600', border: 'border-cyan-800' },
                             { id: 'certezas', name: 'Certezas y Conteo', sub: 'Estrategia del peor de los casos', icon: '🎯', color: 'bg-fuchsia-600', border: 'border-fuchsia-800' }
                           ]
                         };

                         const renderTopicGrid = (list: typeof courseCurriculum.bimestre3, badgeText: string, badgeBg: string) => (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {list.map((topic) => {
                               const topicProgress = infiniteProgress[topic.id] || 0;
                               return (
                                 <div 
                                   key={topic.id} 
                                   onClick={() => {
                                     setSelectedTopic(topic.id);
                                     playClickSound();
                                     setViewMode('infinite_map');
                                   }}
                                   className="bg-white p-5 rounded-3xl border-2 border-b-[6px] border-slate-200 hover:border-slate-400 transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between text-left min-w-0"
                                 >
                                   <div>
                                     <div className="flex items-center justify-between gap-2 mb-3">
                                       <div className={`w-13 h-13 ${topic.color} border-2 border-b-4 ${topic.border} rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform`}>
                                         {topic.icon}
                                       </div>
                                       <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${badgeBg}`}>
                                         {badgeText}
                                       </span>
                                     </div>
                                     <h3 className="font-black text-slate-900 text-base md:text-lg leading-tight break-words">{topic.name}</h3>
                                     <p className="text-xs font-bold text-slate-500 mt-1 leading-snug">{topic.sub}</p>
                                   </div>
                                   <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-between">
                                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                                       Nivel {topicProgress}
                                     </span>
                                     <span className="text-xs font-black text-blue-600 group-hover:translate-x-1 transition-transform">
                                       Practicar →
                                     </span>
                                   </div>
                                 </div>
                               );
                             })}
                           </div>
                         );

                         return (
                           <div className="space-y-8 pb-12">
                             {/* SECCIÓN 1: TERCER BIMESTRE */}
                             <div>
                               <div className="flex items-center gap-3 mb-4">
                                 <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 border-b-4 border-blue-800 text-white font-black text-xs uppercase tracking-widest">
                                   Tercer Bimestre
                                 </span>
                                 <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                                   {courseCurriculum.bimestre3.length} Temas Base
                                 </span>
                                 <div className="flex-1 h-0.5 bg-slate-200 rounded-full" />
                               </div>
                               {renderTopicGrid(courseCurriculum.bimestre3, 'III Bimestre', 'bg-blue-50 text-blue-700 border border-blue-200')}
                             </div>

                             {/* SECCIÓN 2: CUARTO BIMESTRE */}
                             <div>
                               <div className="flex items-center gap-3 mb-4">
                                 <span className="px-3.5 py-1.5 rounded-xl bg-violet-600 border-b-4 border-violet-800 text-white font-black text-xs uppercase tracking-widest">
                                   Cuarto Bimestre
                                 </span>
                                 <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                                   {courseCurriculum.bimestre4.length} Temas de Continuación
                                 </span>
                                 <div className="flex-1 h-0.5 bg-slate-200 rounded-full" />
                               </div>
                               {renderTopicGrid(courseCurriculum.bimestre4, 'IV Bimestre', 'bg-violet-50 text-violet-700 border border-violet-200')}
                             </div>
                           </div>
                         );
                       })()}
                     </div>
                  </div>
                </div>
              </TabTransition>)}

              {viewMode === 'codice' && (<TabTransition type="blocks" key="codice">
                <div key="codice" className="h-full relative bg-white/50 overflow-hidden">
                  <DictLabModal isInline={true} activeCourse={activeCourse} />
                </div>
              </TabTransition>)}

              {viewMode === 'album' && (<TabTransition type="diagonal" key="album">
                <div key="album" className="h-full relative bg-slate-900 overflow-hidden">
                  <AlbumModal 
                    isInline={true}
                    albums={initialAlbums}
                    albumsState={albumsState}
                    claimAlbumReward={claimAlbumReward}
                    unplacedPieces={unplacedPieces}
                    placePiece={placePiece}
                  />
                </div>
              </TabTransition>)}

              {viewMode === 'shop' && (<TabTransition type="swipe" key="shop">
                <div key="shop" className={`absolute inset-0 overflow-y-auto p-4 md:p-7 no-scrollbar ${currentThemeStyle.bgClass} ${currentThemeStyle.textPrimary}`}>
                  <div className="max-w-4xl mx-auto pb-24">
                    {/* Cabecera compacta + Billetera doble */}
                    <div className={`p-5 md:p-6 rounded-3xl border-2 shadow-sm flex flex-col gap-5 mb-6 ${currentThemeStyle.cardBg}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
                            <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                              <Icon name="store" size={24} />
                            </span>
                            Tienda Escolar
                          </h2>
                          <p className={`font-bold mt-1 text-xs md:text-sm ${currentThemeStyle.textSecondary}`}>
                            Explora cada categoría: mejora tu partida, abre cofres con tickets o personaliza tu tema.
                          </p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className={`px-4 py-2 rounded-2xl border-2 flex items-center gap-2 ${currentThemeStyle.bentoBg}`} title="Tus Monedas">
                            <Icon name="coins" size={22} className="text-amber-500" />
                            <div className="leading-tight">
                              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Monedas</span>
                              <span className="text-base font-black">{coins}</span>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl border-2 flex items-center gap-2 ${currentThemeStyle.bentoBg}`} title="Tus Tickets">
                            <Icon name="ticket" size={22} className="text-purple-500" />
                            <div className="leading-tight">
                              <span className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Tickets</span>
                              <span className="text-base font-black">{tickets}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Barra de Pestañas Interactivas */}
                      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-200/70 dark:bg-slate-800/70">
                        {[
                          { id: 'powers' as const, label: 'Poderes', sub: '6 mejoras', icon: 'zap', badge: shieldCount > 0 || isSupernova || activeDoubleDividends ? 'Activo' : null },
                          { id: 'chests' as const, label: 'Cofres', sub: '3 cofres', icon: 'gift', badge: tickets >= 100 ? '¡Abre!' : null },
                          { id: 'themes' as const, label: 'Estilos', sub: `${purchasedThemes.length}/${themes.length} temas`, icon: 'sparkles', badge: null },
                        ].map((tab) => {
                          const active = shopTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => { playClickSound(); setShopTab(tab.id); }}
                              className={`relative py-2.5 px-3 rounded-xl font-black text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                                active
                                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-900/40'
                              }`}
                            >
                              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600' : 'bg-slate-300/60 dark:bg-slate-700/60'}`}>
                                <Icon name={tab.icon} size={18} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs sm:text-sm font-black truncate">{tab.label}</span>
                                  {tab.badge && (
                                    <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300">
                                      {tab.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="block text-[10px] font-bold text-slate-400 truncate">{tab.sub}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* PESTAÑA 1: PODERES Y MEJORAS (6 objetos) */}
                    {shopTab === 'powers' && (
                      <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* 1. Seguro Básico */}
                          <div className="p-4 rounded-3xl border-2 border-emerald-200 bg-emerald-50/90 text-slate-800 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-0.5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 text-[10px] font-black uppercase tracking-wider">Protección</span>
                                <span className="text-emerald-800 font-black text-xs">Tienes: {shieldCount}</span>
                              </div>
                              <div className="flex items-start gap-3 my-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">🛡️</div>
                                <div>
                                  <h4 className="font-black text-base text-emerald-950 leading-tight">Seguro Básico</h4>
                                  <p className="text-xs font-bold text-emerald-800/80 mt-1 leading-snug">Cubre tus pérdidas si te equivocas en un ejercicio.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-emerald-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                if (user.coins >= SHIELD_PRICE) { setUser(prev => prev ? { ...prev, coins: prev.coins - SHIELD_PRICE } : null); setShieldCount(s => s + 1); playClickSound(); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                              Comprar por {SHIELD_PRICE} <Icon name="coins" size={16} />
                            </button>
                          </div>

                          {/* 2. Póliza Premium x3 */}
                          <div className="p-4 rounded-3xl border-2 border-teal-200 bg-teal-50/90 text-slate-800 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-0.5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-teal-200/80 text-teal-900 text-[10px] font-black uppercase tracking-wider">Pack Ahorro</span>
                                <span className="text-teal-800 font-black text-xs">+3 escudos</span>
                              </div>
                              <div className="flex items-start gap-3 my-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-teal-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">🔰</div>
                                <div>
                                  <h4 className="font-black text-base text-teal-950 leading-tight">Póliza Premium x3</h4>
                                  <p className="text-xs font-bold text-teal-800/80 mt-1 leading-snug">3 seguros contra errores de cálculo a precio reducido.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-3 py-2.5 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-teal-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                if (user.coins >= SHIELD_PACK_PRICE) { setUser(prev => prev ? { ...prev, coins: prev.coins - SHIELD_PACK_PRICE } : null); setShieldCount(s => s + 3); playClickSound(); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                              Comprar por {SHIELD_PACK_PRICE} <Icon name="coins" size={16} />
                            </button>
                          </div>

                          {/* 3. Rally Alcista */}
                          <div className="p-4 rounded-3xl border-2 border-fuchsia-200 bg-fuchsia-50/90 text-slate-800 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-0.5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-fuchsia-200/80 text-fuchsia-900 text-[10px] font-black uppercase tracking-wider">Supernova</span>
                                <span className="text-fuchsia-800 font-black text-xs">{isSupernova ? '¡Activo!' : 'Listo'}</span>
                              </div>
                              <div className="flex items-start gap-3 my-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-fuchsia-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">⚡</div>
                                <div>
                                  <h4 className="font-black text-base text-fuchsia-950 leading-tight">Rally Alcista</h4>
                                  <p className="text-xs font-bold text-fuchsia-800/80 mt-1 leading-snug">Tu próximo acierto activa la Supernova con tickets extra.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              disabled={isSupernova}
                              className="w-full mt-3 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 active:scale-95 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-fuchsia-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                if (user.coins >= SUPERNOVA_PRICE) { setUser(prev => prev ? { ...prev, coins: prev.coins - SUPERNOVA_PRICE } : null); setIsSupernova(true); playClickSound(); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                              {isSupernova ? 'Ya activo' : <>Comprar por {SUPERNOVA_PRICE} <Icon name="coins" size={16} /></>}
                            </button>
                          </div>

                          {/* 4. Dividendos x2 */}
                          <div className="p-4 rounded-3xl border-2 border-blue-200 bg-blue-50/90 text-slate-800 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-0.5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-900 text-[10px] font-black uppercase tracking-wider">Multiplicador</span>
                                <span className="text-blue-800 font-black text-xs">{activeDoubleDividends ? '¡Activo!' : 'Inactivo'}</span>
                              </div>
                              <div className="flex items-start gap-3 my-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">🎟️</div>
                                <div>
                                  <h4 className="font-black text-base text-blue-950 leading-tight">Dividendos x2</h4>
                                  <p className="text-xs font-bold text-blue-800/80 mt-1 leading-snug">Recibe el doble de tickets en tu próximo acierto.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-blue-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                if (user.coins >= DOUBLE_PRICE && !activeDoubleDividends) { setUser(prev => prev ? { ...prev, coins: prev.coins - DOUBLE_PRICE } : null); setActiveDoubleDividends(true); playClickSound(); } else if (activeDoubleDividends) { showToast("Ya tienes este poder activo.", "info"); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                              {activeDoubleDividends ? 'Ya activo' : <>Comprar por {DOUBLE_PRICE} <Icon name="coins" size={16} /></>}
                            </button>
                          </div>

                          {/* 5. Inyección de Capital */}
                          <div className="p-4 rounded-3xl border-2 border-amber-200 bg-amber-50/90 text-slate-800 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-0.5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-black uppercase tracking-wider">Capital</span>
                                <span className="text-amber-800 font-black text-xs">5 aciertos</span>
                              </div>
                              <div className="flex items-start gap-3 my-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">💰</div>
                                <div>
                                  <h4 className="font-black text-base text-amber-950 leading-tight">Inyección de Capital</h4>
                                  <p className="text-xs font-bold text-amber-800/80 mt-1 leading-snug">Doble de monedas durante los próximos 5 aciertos.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-3 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-amber-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                showToast("Disponible próximamente", "info");
                              }}
                            >
                              Comprar por 250 <Icon name="coins" size={16} />
                            </button>
                          </div>

                          {/* 6. Contrato Seguro */}
                          <div className="p-4 rounded-3xl border-2 border-rose-200 bg-rose-50/90 text-slate-800 shadow-sm flex flex-col justify-between transition-all hover:-translate-y-0.5">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[10px] font-black uppercase tracking-wider">Garantía</span>
                                <span className="text-rose-800 font-black text-xs">Especial</span>
                              </div>
                              <div className="flex items-start gap-3 my-2">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-3xl shrink-0 shadow-xs">🎁</div>
                                <div>
                                  <h4 className="font-black text-base text-rose-950 leading-tight">Contrato Seguro</h4>
                                  <p className="text-xs font-bold text-rose-800/80 mt-1 leading-snug">Caja Fuerte garantizada en tu próximo acierto.</p>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-3 py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-rose-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              onClick={() => {
                                showToast("Disponible próximamente", "info");
                              }}
                            >
                              Comprar por 180 <Icon name="coins" size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PESTAÑA 2: COFRES DE RECOMPENSAS (3 cofres) */}
                    {shopTab === 'chests' && (
                      <div className="animate-fade-in space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Cofre Básico */}
                          <div className={`p-6 rounded-3xl border-2 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all ${currentThemeStyle.bentoBg}`}>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-wider">
                              Común
                            </span>
                            <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-200/60 flex items-center justify-center my-4">
                              <Icon name="box" size={46} />
                            </div>
                            <h4 className="font-black text-lg">Cofre Básico</h4>
                            <p className={`text-xs font-bold mt-1 mb-5 ${currentThemeStyle.textSecondary}`}>
                              Premios estándar, monedas y probabilidad de piezas de álbum.
                            </p>
                            <button
                              className="w-full py-3 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border-b-4 border-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto"
                              onClick={() => {
                                if (user.tickets >= 100) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 100 } : null); openRandomChest('common'); playClickSound(); } else { showToast("No tienes suficientes tickets."); }
                              }}
                            >
                              Abrir por 100 <Icon name="ticket" size={16} />
                            </button>
                          </div>

                          {/* Cofre Raro */}
                          <div className={`p-6 rounded-3xl border-2 border-blue-400 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all relative overflow-hidden ${currentThemeStyle.bentoBg}`}>
                            <div className="absolute inset-0 bg-blue-500/5 z-0 pointer-events-none"></div>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider relative z-10">
                              Raro
                            </span>
                            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-900/40 border-2 border-blue-200 flex items-center justify-center my-4 text-blue-500 relative z-10">
                              <Icon name="diamond" size={46} />
                            </div>
                            <h4 className="font-black text-lg text-blue-500 relative z-10">Cofre Raro</h4>
                            <p className={`text-xs font-bold mt-1 mb-5 relative z-10 ${currentThemeStyle.textSecondary}`}>
                              Mejores recompensas garantizadas y piezas de colección.
                            </p>
                            <button
                              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border-b-4 border-blue-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto relative z-10"
                              onClick={() => {
                                if (user.tickets >= 300) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 300 } : null); openRandomChest('rare'); playClickSound(); } else { showToast("No tienes suficientes tickets."); }
                              }}
                            >
                              Abrir por 300 <Icon name="ticket" size={16} />
                            </button>
                          </div>

                          {/* Cofre Épico */}
                          <div className={`p-6 rounded-3xl border-2 border-amber-400 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all relative overflow-hidden ${currentThemeStyle.bentoBg}`}>
                            <div className="absolute inset-0 bg-amber-500/5 z-0 pointer-events-none"></div>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider relative z-10 animate-pulse">
                              Épico • HOT
                            </span>
                            <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-900/40 border-2 border-amber-200 flex items-center justify-center my-4 text-amber-500 relative z-10">
                              <Icon name="crown" size={46} />
                            </div>
                            <h4 className="font-black text-lg text-amber-500 relative z-10">Cofre Épico</h4>
                            <p className={`text-xs font-bold mt-1 mb-5 relative z-10 ${currentThemeStyle.textSecondary}`}>
                              Premios masivos sorpresa y alta probabilidad de piezas raras.
                            </p>
                            <button
                              className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border-b-4 border-amber-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto relative z-10"
                              onClick={() => {
                                if (user.tickets >= 1000) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 1000 } : null); openRandomChest('legendary'); playClickSound(); } else { showToast("No tienes suficientes tickets."); }
                              }}
                            >
                              Abrir por 1000 <Icon name="ticket" size={16} />
                            </button>
                          </div>
                        </div>

                        <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-3 ${currentThemeStyle.cardBg}`}>
                          <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                              <Icon name="folder" size={20} />
                            </span>
                            <p className={`text-xs font-bold ${currentThemeStyle.textSecondary}`}>
                              Las piezas que encuentras en los cofres sirven para armar las figuras de tus <strong className={currentThemeStyle.textPrimary}>Álbumes</strong>.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { playClickSound(); setViewMode('album'); }}
                            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                          >
                            Ver Álbumes →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* PESTAÑA 3: ESTILOS VISUALES (5 temas) */}
                    {shopTab === 'themes' && (
                      <div className="animate-fade-in space-y-4">
                        {previewTheme && (
                          <div className="p-3.5 rounded-2xl bg-amber-400 border-2 border-b-4 border-amber-600 text-slate-900 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 font-black text-xs sm:text-sm">
                              <Icon name="eye" size={18} />
                              <span>Estás viendo una vista previa en vivo del estilo seleccionado.</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => { playClickSound(); setPreviewTheme(null); }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                            >
                              Restaurar mi tema actual
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {themes.map(th => {
                            const style = THEME_STYLES[th.id];
                            const isEquipped = activeTheme === th.id;
                            const isPurchased = purchasedThemes.includes(th.id);
                            const isPreviewing = previewTheme?.id === th.id;
                            const swatches: [string, string, string] = style?.swatches || ['#F8FAFC', '#FFFFFF', '#3B82F6'];

                            return (
                              <div
                                key={th.id}
                                className={`rounded-3xl border-2 border-b-[6px] overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 ${style?.bezelClass || 'bg-white border-slate-200'}`}
                              >
                                {/* Mini UI Preview Header (100% solid flat colors) */}
                                <div
                                  style={{ backgroundColor: swatches[0] }}
                                  className="p-4 border-b-2 border-slate-200/60 dark:border-slate-700/60 relative"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <span
                                      style={{ backgroundColor: swatches[2] }}
                                      className="px-2.5 py-0.5 rounded-md text-white text-[10px] font-black uppercase tracking-widest"
                                    >
                                      {style?.tag || 'Estilo'}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                      {swatches.map((hex, i) => (
                                        <span
                                          key={i}
                                          style={{ backgroundColor: hex }}
                                          className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-800"
                                          title={`Color ${hex}`}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  {/* Mini Mockup Window */}
                                  <div
                                    style={{ backgroundColor: swatches[1] }}
                                    className="rounded-2xl p-3 border-2 border-slate-300/60 dark:border-slate-700 flex items-center gap-3"
                                  >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                                      <Icon name={style?.emoji || 'theme_default'} size={52} />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                      <div
                                        style={{ backgroundColor: swatches[2] }}
                                        className="h-2.5 w-16 rounded-full"
                                      />
                                      <div className="h-2 w-full rounded-full bg-slate-300/70 dark:bg-slate-600/70" />
                                      <div className="h-2 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                  </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                                  <div>
                                    <div className="flex items-center justify-between gap-2">
                                      <h5 className={`font-black text-lg leading-tight ${style?.textPrimary || 'text-slate-900'}`}>
                                        {th.name}
                                      </h5>
                                      {isEquipped && (
                                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                                          Activo
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-xs font-bold leading-relaxed mt-1.5 ${style?.textSecondary || 'text-slate-500'}`}>
                                      {th.desc}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 pt-2">
                                    {!isEquipped && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          playClickSound();
                                          setPreviewTheme(isPreviewing ? null : { id: th.id, price: th.price, isAlreadyPurchased: isPurchased });
                                        }}
                                        className={`px-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-b-4 transition-all cursor-pointer ${
                                          isPreviewing
                                            ? 'bg-indigo-600 text-white border-indigo-800'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                                        }`}
                                        title="Probar cómo se ve en la aplicación"
                                      >
                                        {isPreviewing ? 'Viendo' : 'Probar'}
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleThemeClick(th)}
                                      className={`flex-1 py-2.5 px-4 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                        isEquipped
                                          ? 'bg-emerald-600 text-white border-b-4 border-emerald-800 cursor-default'
                                          : isPurchased
                                          ? 'bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 text-white border-b-4 border-blue-800'
                                          : 'bg-amber-500 hover:bg-amber-400 active:translate-y-0.5 text-slate-950 border-b-4 border-amber-700'
                                      }`}
                                    >
                                      {isEquipped ? (
                                        <>Equipado <Icon name="check" size={15} /></>
                                      ) : isPurchased ? (
                                        'Equipar Tema'
                                      ) : (
                                        <>Comprar {th.price} <Icon name="coins" size={16} /></>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabTransition>)}

              {viewMode === 'mistakes' && (<TabTransition type="blocks" key="mistakes">
                <div key="mistakes" className="h-full relative bg-white/50 overflow-hidden flex flex-col">
                  <MistakesModal isInline={true} mistakesList={mistakesList} />
                </div>
              </TabTransition>)}

              {viewMode === 'profile' && (<TabTransition type="diagonal" key="profile">
                <div key="profile" className="h-full relative bg-white/50 overflow-hidden">
                  <ProfileModal
                    isInline={true}
                    stats={stats}
                    user={{ ...user, coins, tickets }}
                    trophies={TROPHIES}
                    coinsSpent={coinsSpent}
                    skipsUsed={skipsUsed}
                    onReplayTutorial={isStaff ? undefined : () => { playClickSound(); setTutorialStep(1); }}
                    onLogout={handleLogout}
                    onGoToUsers={isStaff ? () => { playClickSound(); setViewMode('teacher_dash'); } : undefined}
                    accountDni={accountDni}
                    onPasswordChanged={() => showToast('Contraseña cambiada.', 'info')}
                  />
                </div>
              </TabTransition>)}

              {viewMode === 'teacher_dash' && (<TabTransition type="swipe" key="teacher_dash">
                <div key="teacher_dash" className="h-full relative bg-white/50 overflow-y-auto p-4 md:p-8">
                  <Suspense fallback={<Loading />}><TeacherDashboard currentUserRole={user.role} currentUserUid={authUser?.uid} /></Suspense>
                </div>
              </TabTransition>)}


              {viewMode === 'teacher' && (<TabTransition type="swipe" key="teacher">
                <div key="teacher" className="h-full relative bg-white/50 overflow-hidden">
                  <TeacherModeModal isInline={true} problem={tutorProblem} askTutor={askTutor} />
                </div>
              </TabTransition>)}
              </AnimatePresence>
           </div>

           {/* Right Sidebar — student gamification only (challenges, power-ups, coupons); staff manage the school instead. */}
           {!isStaff && (
           <div className="hidden lg:flex landscape:flex flex-col w-80 landscape:max-lg:w-56 gap-5 landscape:max-lg:gap-3 overflow-y-auto no-scrollbar pb-8 relative z-30">
               {/* Stats HUD */}
               <div className={`flex justify-between items-center rounded-3xl p-5 landscape:max-lg:p-3 border-2 shadow-sm ${currentThemeStyle.headerBg}`}>
                  <div className="flex items-center gap-1.5 font-black text-amber-500 text-lg" title="Monedas"><Icon name="coins" size={20} className="inline-block" /> {coins}</div>
                  <div className="flex items-center gap-1.5 font-black text-emerald-500 text-lg" title="Tickets"><Icon name="ticket" size={20} className="inline-block" /> {tickets}</div>
               </div>

               {/* Desafíos del día */}
               <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} className={`rounded-[2rem] border-2 p-5 shadow-sm ${currentThemeStyle.cardBg}`}>
                  <div className="flex justify-between items-center mb-5 gap-2">
                     <h4 className={`font-black ${currentThemeStyle.textPrimary} flex items-center gap-2`}>
                       <Icon name="star" size={18} className="text-amber-500" /> Desafíos del día
                     </h4>
                     <button
                       type="button"
                       onClick={() => {
                         playClickSound();
                         setExpandedChallenges(!expandedChallenges);
                       }}
                       className="text-[10px] font-black text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-700/40 cursor-pointer uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95"
                     >
                       <span>{expandedChallenges ? 'VER MENOS' : 'VER TODOS'}</span>
                       <motion.span
                         animate={{ rotate: expandedChallenges ? 180 : 0 }}
                         transition={{ duration: 0.3, ease: 'easeInOut' }}
                         className="inline-block"
                       >
                         <Icon name="chevron_down" size={12} />
                       </motion.span>
                     </button>
                  </div>
                  <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} className="space-y-4">
                     <AnimatePresence initial={false} mode="popLayout">
                        {dailyChallenges.slice(0, expandedChallenges ? 5 : 3).map((challenge, idx) => {
                          const isCompleted = challenge.current >= challenge.target;
                          const isClaimed = claimedChallenges.includes(challenge.id);
                          
                          return (
                            <motion.div 
                              key={challenge.id} 
                              layout
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.25, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                              className={`flex items-center gap-3.5 p-1.5 rounded-2xl transition-colors ${isClaimed ? 'opacity-60' : ''}`}
                            >
                               <span className="text-3xl filter drop-shadow-sm shrink-0">{challenge.icon}</span>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-end mb-1 gap-2">
                                    <div className="min-w-0">
                                      <p className={`font-bold text-xs truncate ${currentThemeStyle.textPrimary}`}>{challenge.title}</p>
                                      <p className="font-bold text-[10px] text-slate-400 flex items-center gap-1">
                                        Premio: +{challenge.reward.amount} {challenge.reward.type === 'coins' ? <Icon name="coins" size={14} className="inline-block text-amber-500" /> : <Icon name="ticket" size={14} className="inline-block text-blue-500" />}
                                      </p>
                                    </div>
                                    {isClaimed ? (
                                      <span className="text-[10px] font-black text-emerald-500 uppercase shrink-0">Completado</span>
                                    ) : isCompleted ? (
                                      <button onClick={() => claimChallenge(challenge)} className="text-[10px] font-black text-white bg-blue-500 hover:bg-blue-600 active:scale-95 px-2.5 py-1 rounded-lg shadow-sm transition-all cursor-pointer shrink-0">CANJEAR</button>
                                    ) : (
                                      <p className="font-bold text-xs text-slate-400 shrink-0">{challenge.current}/{challenge.target}</p>
                                    )}
                                  </div>
                                  <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2.5 mt-1 overflow-hidden border border-slate-300/30">
                                     <motion.div
                                        initial={{ width: 0 }}
                                       animate={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                                       transition={{ duration: 0.8, ease: 'easeOut' }}
                                       className={`${challenge.color} h-full rounded-full`}
                                     />
                                  </div>
                               </div>
                            </motion.div>
                          );
                        })}
                     </AnimatePresence>
                  </motion.div>
               </motion.div>

               {/* Tienda preview */}
               <div className={`rounded-[2rem] border-2 p-5 shadow-sm ${currentThemeStyle.cardBg}`}>
                  <div className="flex justify-between items-center mb-4">
                     <h4 className={`font-black text-sm uppercase tracking-widest flex items-center gap-2 ${currentThemeStyle.textPrimary}`}>
                       <span><Icon name="zap" className="inline-block" size={18} /></span> Poderes Rápidos
                     </h4>
                     <span onClick={() => setViewMode('shop')} className="text-[10px] font-black text-blue-500 hover:text-blue-600 cursor-pointer uppercase tracking-widest transition-colors">VER MÁS</span>
                  </div>
                  <div className="space-y-3">
                     <div className="p-3 bg-slate-500/5 border border-slate-500/15 rounded-2xl flex items-center justify-between gap-2 hover:bg-slate-500/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                           <span className="text-2xl filter drop-shadow-sm"><Icon name="shield" size={18} className="inline-block" /></span>
                           <div>
                              <h5 className={`font-black text-[11px] leading-tight ${currentThemeStyle.textPrimary}`}>Escudo</h5>
                              <p className={`text-[9px] font-bold ${currentThemeStyle.textSecondary}`}>Activos: {shieldCount}</p>
                           </div>
                        </div>
                        <Button onClick={() => { if (user.coins >= SHIELD_PRICE) { setUser(prev => prev ? { ...prev, coins: prev.coins - SHIELD_PRICE } : null); setShieldCount(s => s + 1); playClickSound(); } else { showToast("No tienes suficientes monedas."); } }} color="green" className="px-3 py-1.5 text-[10px] shrink-0 shadow-sm uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Icon name="coins" size={18} /> {SHIELD_PRICE}</div></Button>
                     </div>
                     <div className="p-3 bg-slate-500/5 border border-slate-500/15 rounded-2xl flex items-center justify-between gap-2 hover:bg-slate-500/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                           <span className="text-2xl filter drop-shadow-sm"><Icon name="zap" className="inline-block" size={18} /></span>
                           <div>
                              <h5 className={`font-black text-[11px] leading-tight ${currentThemeStyle.textPrimary}`}>Doble</h5>
                              <p className={`text-[9px] font-bold ${currentThemeStyle.textSecondary}`}>{activeDoubleDividends ? 'Activo' : 'Inactivo'}</p>
                           </div>
                        </div>
                        <Button onClick={() => { if (user.coins >= DOUBLE_PRICE && !activeDoubleDividends) { setUser(prev => prev ? { ...prev, coins: prev.coins - DOUBLE_PRICE } : null); setActiveDoubleDividends(true); playClickSound(); } else if (activeDoubleDividends) { showToast("Ya tienes este poder activo.", "info"); } else { showToast("No tienes suficientes monedas."); } }} color="purple" className="px-3 py-1.5 text-[10px] shrink-0 shadow-sm uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Icon name="coins" size={18} /> {DOUBLE_PRICE}</div></Button>
                     </div>
                  </div>
               </div>

               {/* Cupones */}
               <div className={`rounded-[2rem] border-2 p-5 shadow-sm ${currentThemeStyle.cardBg}`}>
                  <h4 className={`font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-1.5 ${currentThemeStyle.textPrimary}`}>
                    <span><Icon name="ticket" size={18} className="inline-block" /></span> Cupones
                  </h4>
                  <p className={`text-[10px] ${currentThemeStyle.textSecondary} font-bold mb-3 leading-relaxed`}>
                    Ingresa cupones de tu profesor.
                  </p>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Código..." 
                      className={`w-full px-3 py-2 rounded-xl border-2 focus:outline-none font-bold text-xs ${currentThemeStyle.inputClass}`}
                    />
                    <Button onClick={claimPromoCode} color="blue" className="w-full px-4 py-2 text-[10px] uppercase tracking-wider shadow-sm">
                      Canjear
                    </Button>
                  </div>
                  {promoFeedback && (
                    <div className="text-[10px] font-black text-blue-600 mt-2 text-center animate-pop bg-blue-50 py-1.5 rounded-lg border border-blue-100">
                      {promoFeedback}
                    </div>
                  )}
               </div>

           </div>
           )}
        </PageReveal>
      ) : (
        <PageReveal key="exercise-app" bgClass={currentThemeStyle.bgClass} isFullScreen className="w-full relative z-30 max-w-[1400px] mx-auto landscape-mini p-4 md:p-6 h-[100dvh] flex flex-col overflow-hidden">
          <header className={`max-w-5xl mx-auto w-full flex flex-row justify-between items-center gap-1.5 md:gap-2 mb-4 z-30 relative shrink-0 transition-all duration-300`}>
        {/* User Info & Currencies */}
        <div className={`flex items-center gap-2 md:gap-3 rounded-full border-2 p-1.5 md:p-2 pr-3 md:pr-4 shadow-sm ${currentThemeStyle.headerBg}`}>
          <button 
            onClick={() => { playClickSound(); setShowProfile(true); }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-slate-200 hover:scale-105 transition-all shadow-md cursor-pointer indestructible-btn shrink-0 overflow-hidden"
          >
            <Avatar name={user.avatar} size={36} />
          </button>
          <div className="flex flex-col min-w-0 pr-1 max-w-[100px] sm:max-w-[180px]">
            <h2 className={`font-black text-xs md:text-sm truncate leading-none ${currentThemeStyle.textPrimary}`}>{user.name}</h2>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">Nivel {progress}</p>
          </div>
          
          <div className="flex items-center ml-2 bg-amber-400 rounded-full px-2 md:px-3 py-1 gap-1 border-b-[3px] border-amber-600 shadow-sm">
            <span className="text-xs"><Icon name="ticket" size={18} className="inline-block -mt-1" /></span> 
            <span className="font-black text-xs md:text-sm text-amber-950">{tickets}</span>
          </div>
        </div>

        {/* Right Nav Icons */}
        <div className={`flex items-center gap-1.5 md:gap-2 rounded-full border-2 p-1.5 md:p-2 shadow-sm ${currentThemeStyle.headerBg}`}>
           <button 
             onClick={() => { playClickSound(); setShowChallenges(true); }}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg md:text-xl border-2 border-blue-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"
             title="Desafíos del Día"
           >
             <Icon name="star" size={18} className="inline-block" />
           </button>
           
           <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1"></div>

           {/* The tutorial promises "el Asistente AI te guiará paso a paso",
               but nothing opened it: the modal existed with no way in. */}
           <button 
             onClick={() => { playClickSound(); setShowTeacherModal(true); }}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-lg md:text-xl border-2 border-orange-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"
             title="Tutor IA"
             aria-label="Tutor IA"
           >
             <Icon name="owl" size={18} className="inline-block" />
           </button>

           <button 
             onClick={() => { playClickSound(); setShowAlbum(true); }}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg md:text-xl border-2 border-amber-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"
             title="Álbumes"
           >
             <Icon name="folder" size={18} className="inline-block" />
           </button>

           <button 
             onClick={() => setViewMode(selectedTopic ? 'infinite_map' : 'map')}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 hover:scale-105 active:scale-95 transition-all shadow-sm ml-1 indestructible-btn"
             title="Volver al Mapa"
           >
             <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
             </svg>
           </button>
        </div>
      </header>
      {/* Main Grid Workspace */}
      <main className="max-w-5xl w-full mx-auto flex flex-col relative z-10 flex-1 min-h-0" style={{ animationDelay: '0.1s' }}>

        {/* Single Body Container */}
        <div className="bg-white rounded-[2rem] border-[4px] border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row w-full flex-1 overflow-y-auto lg:overflow-hidden relative z-10">
          
          {/* Active Problem Solver Canvas (Left) */}
          <div className="w-full lg:w-1/2 lg:flex-1 bg-white p-6 md:p-10 flex flex-col relative border-b lg:border-b-0 lg:border-r-[3px] border-slate-100/60 lg:overflow-y-auto no-scrollbar shrink-0">
            <div className="flex justify-center items-center mb-8 gap-2 shrink-0 relative w-full">
              <span className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#E8F0FE] text-blue-700 shadow-sm">
                DESAFÍO {(selectedTopic ? (infiniteProgress[selectedTopic] || 0) : progress) + 1} - {currentProblem.data.type.toUpperCase()}
              </span>
              <button 
                onClick={() => { playClickSound(); setShowDictLab(true); }}
                className="absolute right-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:scale-105 active:scale-95 rounded-full transition-all shadow-sm"
                title="Códice de Fórmulas"
              >
                <Icon name="book" size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col text-center max-w-md mx-auto w-full">
              <p className="font-bold text-[14px] md:text-[15px] leading-relaxed text-slate-800 mb-8 px-2 md:px-4">
                {currentProblem.data.intro}
              </p>
              {currentProblem.data.visualData && currentProblem.data.visualData.type !== 'truth_table' && <ProblemVisualizer data={currentProblem.data.visualData} />}
              
              <div className="bg-[#F8F9FA] rounded-[1.5rem] p-6 text-indigo-950 font-bold text-[14px] md:text-[15px] leading-relaxed relative border-2 border-indigo-50/50 shadow-sm mt-auto">
                ¿Cuál es la respuesta correcta a este enigma matemático?
              </div>
            </div>
          </div>

          {/* Answer Form (Right) */}
          <div className="w-full lg:w-1/2 lg:flex-1 bg-white p-6 md:p-10 flex flex-col relative lg:overflow-y-auto no-scrollbar shrink-0">
            
            <div className="flex justify-center items-center gap-2 mb-8 shrink-0">
              <span className="text-xl"><Icon name="target" size={18} className="inline-block" /></span>
              <h2 className="text-[17px] font-black text-slate-800 tracking-tight">{currentProblem.data.type || 'Razonamiento Matemático'}</h2>
            </div>
            
            <form onSubmit={checkAnswerSubmit} className="flex-1 flex flex-col items-center justify-center w-full max-w-[340px] mx-auto">
              
              <div className="flex-1 flex flex-col items-center justify-center mb-8 w-full">
                <span className="text-[70px] drop-shadow-md mb-6 animate-float" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}><Icon name="zap" size={18} className="inline-block" /></span>
                {/* Answer Feedbacks */}
                {answerState.type !== 'idle' && (
                  <div className={`mb-6 p-4 rounded-xl border-2 w-full animate-pop font-black text-sm text-center shadow-md ${answerState.type === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : answerState.type === 'hint' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
                    {answerState.text}
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                {currentProblem.solved ? (() => {
                  const prog = selectedTopic ? (infiniteProgress[selectedTopic] || 0) : (user?.progress || 0);
                  const isEventNext = (prog + 1) % 3 === 0 && (prog % (selectedTopic ? 10 : 20) !== 0);
                  
                  if (isEventNext) {
                    return (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Button 
                        type="button"
                        onClick={() => {
                          playClickSound();
                          const cycle = Math.floor(prog / 3);
                          setTimeout(() => {
                            if (cycle % 7 === 0) {
                                setShowShellGame(true);
                            } else if (cycle % 7 === 3) {
                                setShowPetRace(true);
                            } else {
                                openRandomChest('rare');
                                advanceEventProgress();
                            }
                          }, 300);
                        }} 
                        color="amber" 
                        className="w-full py-4 text-base font-black uppercase tracking-widest animate-pulse shadow-[0_4px_0_#d97706] active:shadow-none active:translate-y-1"
                      >
                        <Icon name="gift" size={18} className="inline-block" /> Reclamar Recompensa
                      </Button></motion.div>
                    );
                  }
                  
                  return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Button 
                      type="button"
                      onClick={loadNextProblem} 
                      color="green" 
                      className="w-full py-4 text-base font-black uppercase tracking-widest shadow-[0_4px_0_#047857] active:shadow-none active:translate-y-1 hover:-translate-y-0.5 transition-all"
                    >
                      SIGUIENTE DESAFÍO <Icon name="arrow_right" size={20} className="inline-block ml-1" />
                    </Button></motion.div>
                  );
                })() : currentProblem.failed ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
                    <Button
                      type="button"
                      onClick={loadNextProblem}
                      color="blue"
                      className="w-full py-4 text-base font-black uppercase tracking-widest shadow-[0_4px_0_#1d4ed8] active:shadow-none active:translate-y-1 hover:-translate-y-0.5 transition-all"
                    >
                      SIGUIENTE PREGUNTA <Icon name="arrow_right" size={20} className="inline-block ml-1" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => { playClickSound(); setShowMistakes(true); }}
                      className="w-full mt-3 text-xs font-black text-slate-500 hover:text-blue-600 underline underline-offset-2 transition-colors"
                    >
                      Ver la explicación en mis Errores
                    </button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <h4 className="text-slate-500 font-bold mb-4 text-[13px]">Ingresa tu respuesta:</h4>

                    {currentProblem.data.visualData?.type === 'truth_table' ? (
                      <TruthTableInput 
                        formula={currentProblem.data.visualData.formula}
                        value={inputAnswer}
                        onChange={(val) => {
                          setInputAnswer(val);
                          if (previewTheme) setPreviewTheme(null);
                        }}
                        disabled={currentProblem.solved}
                        isShaking={isShaking}
                      />
                    ) : (
                      <div className="w-full relative mb-6">
                      <input 
                        type="text" 
                        value={inputAnswer} 
                        onChange={(e) => {
                          setInputAnswer(e.target.value);
                          if (previewTheme) setPreviewTheme(null);
                          if (answerState.type === 'hint') setAnswerState({ type: 'idle', text: null });
                        }}
                        aria-label="Tu respuesta"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="Ej: 15" 
                        disabled={currentProblem.solved}
                        className={`w-full px-6 py-5 rounded-[1.25rem] border-[3px] focus:outline-none font-black text-center text-[32px] text-slate-800 placeholder:text-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all ${isShaking ? 'animate-shake border-rose-400 ring-4 ring-rose-100' : 'border-slate-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 hover:border-slate-200'}`}
                      />
                      {currentProblem.data.unit && (
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 pointer-events-none">{currentProblem.data.unit}</span>
                      )}
                    </div>
                    )}

                    <button 
                      type="submit"
                      disabled={!inputAnswer.trim()} 
                      className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 active:border-b-2 active:translate-y-0.5 rounded-2xl text-white font-black text-sm md:text-base tracking-widest uppercase shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer indestructible-btn"
                    >
                      ENVIAR RESPUESTA <Icon name="check" size={20} />
                    </button>
                  </motion.div>
                )}</AnimatePresence>
              </div>
            </form>
          </div>
        </div>
      </main>
      </PageReveal>
      )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      {viewMode !== 'exercise' && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="nav-sidebar lg:hidden landscape:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 p-2 z-[100] flex justify-around items-center pb-safe"
        >
          {!isStaff && (<>
          <button onClick={() => { setSelectedTopic(null); setViewMode('map'); }} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'map' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="home" />
            <span className="text-[9px] font-black uppercase tracking-wider">Aprender</span>
          </button>
          <button onClick={() => setViewMode('practice')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'practice' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="infinity" />
            <span className="text-[9px] font-black uppercase tracking-wider">Infinito</span>
          </button>
          <button onClick={() => setViewMode('album')} className={`p-2 rounded-xl flex flex-col items-center gap-1 relative ${viewMode === 'album' ? 'text-blue-500' : 'text-slate-400'}`}>
            {unplacedPieces.length > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
            <Icon name="folder" />
            <span className="text-[9px] font-black uppercase tracking-wider">Álbumes</span>
          </button>
          <button onClick={() => setViewMode('shop')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'shop' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="store" />
            <span className="text-[9px] font-black uppercase tracking-wider">Tienda</span>
          </button>
          </>)}
          <button onClick={() => setViewMode('profile')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'profile' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="user" />
            <span className="text-[9px] font-black uppercase tracking-wider">Perfil</span>
          </button>

          {isStaff && (
            <button onClick={() => setViewMode('teacher_dash')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'teacher_dash' ? 'text-blue-500' : 'text-slate-400'}`}>
              <Icon name="users" />
              <span className="text-[9px] font-black uppercase tracking-wider">Usuario</span>
            </button>
          )}

        </motion.div>
      )}

      {/* Renders all floating popup modal views */}

      {showChallenges && (
        <DailyChallengesModal
          dailyChallenges={dailyChallenges}
          claimedChallenges={claimedChallenges}
          claimChallenge={claimChallenge}
          onClose={() => { playClickSound(); setShowChallenges(false); }}
          currentThemeStyle={currentThemeStyle}
        />
      )}
      {showWelcomeBonus && (
        <WelcomeBonusModal 
          schoolName={schoolName}
          welcomePrize={welcomePrize} 
          handleWelcomePick={handleWelcomePick} 
          playClickSound={playClickSound}
          onClose={() => {
            setShowWelcomeBonus(false);
            setWelcomePrize(null);
          }}
        />
      )}

      {showMistakes && (
        <MistakesModal 
          mistakesList={mistakesList} 
          onClose={() => { playClickSound(); setShowMistakes(false); }} 
        />
      )}

      {showDictLab && (
        <DictLabModal 
          activeCourse={activeCourse}
          onClose={() => { playClickSound(); setShowDictLab(false); }} 
        />
      )}

      {showAlbum && (
        <AlbumModal 
          albums={initialAlbums} 
          albumsState={albumsState} 
          claimAlbumReward={claimAlbumReward} 
          onClose={() => { playClickSound(); setShowAlbum(false); }} 
          unplacedPieces={unplacedPieces}
          placePiece={placePiece}
        />
      )}

      {openChestAnimation.isOpen && (
        <ChestModal 
          openChestAnimation={openChestAnimation} 
          onClose={() => { 
            playClickSound(); 
            setOpenChestAnimation(prev => ({ ...prev, isOpen: false })); 
          }} 
        />
      )}

      {showTicketModal && (
        <TicketModal 
          tickets={tickets} 
          spinning={spinning} 
          wheelRotation={wheelRotation} 
          prizes={roulettePrizes} 
          onSpin={handleSpinWheel} 
          lastPrize={lastPrize} 
          onClose={() => { 
            playClickSound(); 
            setShowTicketModal(false); 
            setLastPrize(null); 
          }} 
        />
      )}

      {showProfile && (
        <ProfileModal 
          stats={stats} 
          user={{ ...user, coins, tickets }} 
          trophies={TROPHIES} 
          coinsSpent={coinsSpent} 
          skipsUsed={skipsUsed} 
          onClose={() => { playClickSound(); setShowProfile(false); }} 
          onReplayTutorial={() => { playClickSound(); setTutorialStep(1); setShowProfile(false); }}
          onLogout={handleLogout}
          accountDni={accountDni}
          onPasswordChanged={() => showToast('Contraseña cambiada.', 'info')}
        />
      )}

      {showProgressModal && (
        <ProgressModal 
          progress={progress} 
          onClose={() => { playClickSound(); setShowProgressModal(false); }} 
        />
      )}

      {showTeacherModal && (
        <TeacherModeModal
          problem={tutorProblem}
          askTutor={askTutor}
          onClose={() => { playClickSound(); setShowTeacherModal(false); }}
        />
      )}

      
      {showDistractionWarning && (
        <div className="fixed inset-0 bg-black/90 z-[500] flex items-center justify-center p-4 backdrop-blur-md animate-pop">
          <Card className="w-full max-w-md border-4 border-rose-500 bg-white p-6 md:p-8 text-center text-slate-800">
            <div className="text-6xl mb-4 animate-bounce"><Icon name="x" size={18} className="inline-block" /></div>
            <h3 className="text-2xl font-black text-rose-600 mb-2">¡Pérdida de Foco!</h3>
            <p className="text-slate-600 font-bold mb-6 text-sm">
              Has salido de la mesa de trabajo o abierto otra pestaña. Un buen inversionista mantiene su atención absoluta en el mercado para evitar pérdidas.
            </p>
            <Button onClick={() => setShowDistractionWarning(false)} color="red" className="w-full">
              Volver a Concentrarme
            </Button>
          </Card>
        </div>
      )}

      {showShellGame && (
        <Suspense fallback={null}>
          <ShellGameMinigame 
            onFinish={onFinishShellGame} 
            playClick={playClickSound} 
            playCatch={playCatchSound} 
            playTick={playRouletteTick} 
            playRainbow={playRainbowSound} 
            playError={playErrorAlertSound} 
          />
        </Suspense>
      )}

      {showPetRace && (
        <Suspense fallback={null}>
          <PetRaceMinigame 
            onFinish={onFinishPetRace} 
            playClick={playClickSound} 
            playCatch={playCatchSound} 
            playTick={playRouletteTick} 
            playRainbow={playRainbowSound} 
          />
        </Suspense>
      )}

      <AudioToggle />
      <GlobalRipple />
    </div>
    </>
  );
}
function GlobalRipple() {
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button');
      if (button && !button.closest('.nav-sidebar') && !button.closest('.no-ripple')) {
        const style = window.getComputedStyle(button);
        const bgColor = style.backgroundColor;
        const match = bgColor.match(/rgba?\((\d+,\s*\d+,\s*\d+)/);
        const rgb = match ? match[1] : '148, 163, 184';
        
        button.style.setProperty('--btn-pulse-color', `rgba(${rgb}, 0.8)`);
        button.style.setProperty('--btn-pulse-trans', `rgba(${rgb}, 0)`);

        button.classList.remove('animate-btn-pop');
        // trigger reflow
        void button.offsetWidth;
        button.classList.add('animate-btn-pop');
        
        setTimeout(() => {
          if (button) button.classList.remove('animate-btn-pop');
        }, 600);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes btn-pop-anim {
        0% {
          box-shadow: 0 0 0 0px var(--btn-pulse-color);
        }
        100% {
          box-shadow: 0 0 0 25px var(--btn-pulse-trans);
        }
      }
      .animate-btn-pop {
        animation: btn-pop-anim 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      }
    `}} />
  );
};

