import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, usePresence, useMotionValue, useMotionTemplate, animate } from 'motion/react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './lib/firebase';
import { ProblemData, CurrentProblem, AlbumState, Stats, ShopItem, MarketEvent, PetBuff } from './types';
import { roulettePrizes, themes, initialAlbums, PET_BUFFS, MARKET_EVENTS, SHOP_BANNERS, TROPHIES, PROMO_CODES_MAP } from './data';
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
import { useAnimatedNumber } from './utils/animated';
import { Button, Card, BentoTile, FloatingMathBackground } from './components/UI';
import { ConfettiOverlay } from './components/ConfettiOverlay';
import { Toast, ToastTone } from './components/Toast';
import { AudioToggle } from './components/AudioToggle';
import { ColegioLogin } from './components/ColegioLogin';
import { SchoolRegister } from './components/SchoolRegister';

import { ProgressMap } from './components/ProgressMap';
import { InitialSetup } from './components/InitialSetup';
import { ProblemVisualizer } from './components/Visualizer';
import { TruthTableInput } from './components/TruthTableInput';
import { DictLabModal } from './components/DictLabModal';
import { AlbumModal } from './components/AlbumModal';
import { MistakesModal } from './components/MistakesModal';
import { ProfileModal } from './components/ProfileModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherModeModal } from './components/TeacherModeModal';
import { WelcomeBonusModal } from './components/WelcomeBonusModal';
import { DailyChallengesModal } from './components/DailyChallengesModal';
import { ChestModal } from './components/ChestModal';
import { TicketModal } from './components/TicketModal';
import { ProgressModal } from './components/ProgressModal';
import { ShellGameMinigame } from './components/ShellGameMinigame';
import { PetRaceMinigame } from './components/PetRaceMinigame';
import { UserState } from './types';
import { THEME_STYLES } from './data';
import { Icon } from './components/CustomIcons';
import { Avatar, AVATAR_OPTIONS } from './components/Avatar';



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
  
  React.useEffect(() => {
    if (!isPresent) {
       playTransitionSound();
       // Debe cubrir toda la pantalla antes de desmontar: última barra
       // termina a los (4*0.05 + 0.4)s = 0.6s, con margen de sobra.
       const timer = setTimeout(() => { safeToRemove && safeToRemove(); }, 650);
       return () => clearTimeout(timer);
    } else {
       playRevealSound();
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
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: isPresent ? i * 0.05 : (4 - i) * 0.05 }}
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

export const PageReveal: React.FC<{ children: React.ReactNode, className?: string, isFullScreen?: boolean, bgClass?: string }> = ({ children, className, isFullScreen = false, bgClass = 'bg-slate-50' }) => {
  const [isPresent, safeToRemove] = usePresence();
  const [phase, setPhase] = React.useState(0);
  
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
       }, 1000);
       return () => clearTimeout(timer);
    }

    // Entering component animation sequence. This plays on every map<->exercise
    // switch, so it's tuned for ~4x faster than the original cut while keeping
    // the same lens choreography (open old, close, open new, expand, settle).

    // Phase 1: Lens opens showing old page. Starts immediately alongside the circles.
    playTransitionSound();
    circleRadii.forEach((r, i) => {
      animate(r, radii.base - i * radii.step, {
         duration: 0.2,
         delay: i * 0.03,
         ease: [0.34, 1.56, 0.64, 1]
       });
    });
    animate(holeRadius, 50, { duration: 0.2, ease: "easeInOut" }); // 50px = ~12vmin

    // Phase 2: Lens closes
    const t2 = setTimeout(() => {
      animate(holeRadius, 0, { duration: 0.15, ease: "easeInOut" });
    }, 450);

    // Phase 3: Lens opens showing NEW page
    const t3 = setTimeout(() => {
      playRevealSound();
      animate(holeRadius, 50, { duration: 0.15, ease: "easeInOut" });
      animate(pageRadius, 50, { duration: 0.15, ease: "easeInOut" });
    }, 520);

    // Phase 4: Expand to full screen
    const t4 = setTimeout(() => {
      setPhase(4);
      const maxR = Math.max(window.innerWidth, window.innerHeight) * 1.5;

      circleRadii.forEach((r) => {
        animate(r, maxR, { duration: 0.25, ease: [0.64, 0, 0.78, 0] });
      });
      animate(holeRadius, maxR, { duration: 0.25, ease: [0.64, 0, 0.78, 0] });
      animate(pageRadius, maxR, { duration: 0.25, ease: [0.64, 0, 0.78, 0] });
    }, 620);

    // Phase 5: Clean up, make interactive
    const t5 = setTimeout(() => {
      setPhase(5);
    }, 900);

    return () => { clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [isPresent, safeToRemove, holeRadius, pageRadius, radii, ...circleRadii]);

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

  const handleInitialSetupComplete = async (data: { name: string; avatar: string }) => {
    if (user) {
      // role/grade are never set here — both are fixed server-side at enrollment.
      const newUser = { ...user, ...data, setupCompleted: true };
      setUser(newUser);
      // The welcome bonus and tutorial ("resuelve desafíos", "cofres",
      // "monedas y álbumes") are about the student game loop — staff
      // skip straight to a completed setup.
      if (user.role !== 'teacher' && user.role !== 'admin' && user.role !== 'secretary') {
        setShowWelcomeBonus(true);
        setTutorialStep(1);
      }
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
  // Read inside the hydration effect, which only depends on authUser.
  const userRef = useRef(user);
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
            setProfileLoadError('No hay una cuenta registrada para este usuario. Contacta a tu colegio.');
          } else if (!userRef.current) {
            setProfileLoadError('No se pudo cargar tu perfil. Intenta de nuevo.');
          }
          return;
        }
        const dbUser = await res.json();
        if (cancelled) return;

        const mergeByKey = (a: Record<string, number> = {}, b: Record<string, number> = {}) => {
          const out: Record<string, number> = { ...a };
          for (const [k, v] of Object.entries(b)) out[k] = Math.max(Number(out[k]) || 0, Number(v) || 0);
          return out;
        };

        setUser(prev => ({
          // Identity and enrollment always come from the server — they're the
          // school's data, not the device's.
          name: prev?.name || dbUser.name || authUser.displayName || authUser.email?.split('@')[0] || 'Estudiante',
          email: dbUser.email || authUser.email || '',
          avatar: prev?.avatar || dbUser.avatar || 'fox',
          role: dbUser.role || 'student',
          grade: dbUser.grade || undefined,
          classroom: dbUser.classroom || '',
          setupCompleted: dbUser.setupCompleted || prev?.setupCompleted || false,
          coins: Math.max(dbUser.coins ?? 0, prev?.coins ?? 0),
          tickets: Math.max(dbUser.tickets ?? 0, prev?.tickets ?? 0),
          progress: Math.max(dbUser.progress ?? 0, prev?.progress ?? 0),
          courseProgress: mergeByKey(prev?.courseProgress, dbUser.courseProgress),
        }));
        setInfiniteProgress(prev => mergeByKey(prev, dbUser.infiniteProgress));
        setStats(prev => ((dbUser.stats?.solved ?? 0) > (prev?.solved ?? 0) ? dbUser.stats : prev));
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
  
  const [unplacedPieces, setUnplacedPieces] = useState<any[]>(() => {
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
  const [mistakesList, setMistakesList] = useState<{ problem: string; userAnswer: string; correctAnswer: string; explanation: string }[]>(() => {
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

// Verify problem type matches user progress once user loads
  useEffect(() => {
    if (user && viewMode === 'exercise' && !selectedTopic) {
      const pLevel = getCourseProgress(activeCourse, user);
      let expectedType = '';
      if (activeCourse === 'trigonometria') {
        expectedType = pLevel < 20 ? 'Propiedades de las RT' : pLevel < 40 ? 'Resolución de Triángulos' : pLevel < 60 ? 'Ángulos Verticales' : pLevel < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal';
      } else if (activeCourse === 'geometria_5to') {
        expectedType = pLevel < 20 ? 'Relaciones Métricas' : pLevel < 40 ? 'Áreas de Regiones' : pLevel < 60 ? 'Superficies Circulares' : pLevel < 80 ? 'Geometría del Espacio' : 'Sólidos y Poliedros';
      } else if (activeCourse === 'razonamiento_5to') {
        expectedType = pLevel < 17 ? 'Edades' : pLevel < 34 ? 'Cronometría' : pLevel < 51 ? 'Lógica Inferencial' : pLevel < 68 ? 'Fracciones y Mezclas' : pLevel < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones';
      } else {
        expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      }
      
      if (currentProblem?.data && currentProblem.data.type !== expectedType) {
         const prob = generateMathProblem(false, null, pLevel, activeCourse);
         setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
      }
    }
  }, [user?.progress, viewMode, selectedTopic]);
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
  const [answerState, setAnswerState] = useState<{ type: 'idle' | 'correct' | 'wrong'; text: React.ReactNode }>({ type: 'idle', text: null });
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('fin_streak') || '0', 10));
  const [isSupernova, setIsSupernova] = useState(() => localStorage.getItem('fin_supernova') === 'true');
  const [showConfetti, setShowConfetti] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<{id: string, price: number} | null>(null);
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
  const syncStateRef = useRef({ user, stats, albumsState, infiniteProgress, authUser });
  syncStateRef.current = { user, stats, albumsState, infiniteProgress, authUser };

  const syncToServer = useCallback(async () => {
    const snapshot = syncStateRef.current;
    if (!snapshot.user || !snapshot.authUser) return;
    try {
      const token = await snapshot.authUser.getIdToken();
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          coins: snapshot.user.coins,
          tickets: snapshot.user.tickets,
          progress: snapshot.user.progress,
          courseProgress: snapshot.user.courseProgress || {},
          infiniteProgress: snapshot.infiniteProgress,
          stats: snapshot.stats,
          albums: snapshot.albumsState,
          avatar: snapshot.user.avatar,
          name: snapshot.user.name,
          setupCompleted: snapshot.user.setupCompleted,
        }),
      });
    } catch {
      // Offline or the server is down: the local copy is still authoritative
      // and the merge on next sign-in keeps whichever side is further along.
    }
  }, []);

  useEffect(() => {
    if (!user || !authUser) return;
    const timer = setTimeout(syncToServer, 1500);
    return () => clearTimeout(timer);
  }, [user, stats, albumsState, infiniteProgress, authUser, syncToServer]);

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
  const callGemini = async (prompt: string): Promise<string> => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.text || "Lo siento, mi circuito de IA falló. Intenta de nuevo.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "La IA está descansando en este momento por mucha carga. Intenta más tarde. ✨";
    }
  };


  // Pick Welcome box
  const handleWelcomePick = (idx: number) => {
    if (!user) return;
    playEpicRevealSound();
    let bonus = { coins: 150, tickets: 15, name: "Bono Inicial Ángeles" };
    if (idx === 1) bonus = { coins: 0, tickets: 0, name: "Suscripción Inversor" };
    if (idx === 2) bonus = { coins: 250, tickets: 10, name: "Cofre de Bienvenida" };
    
    setWelcomePrize({ icon: idx === 1 ? "📉" : "🪙", name: bonus.name });
    setUser(prev => prev ? {
      ...prev,
      coins: prev.coins + bonus.coins,
      tickets: prev.tickets + bonus.tickets
    } : null);
  };

  // Promo code validation
  const claimPromoCode = () => {
    playClickSound();
    const codeClean = promoCode.trim();
    if (PROMO_CODES_MAP[codeClean] !== undefined) {
      const bonusCoins = PROMO_CODES_MAP[codeClean] * 10;
      setUser(prev => prev ? { ...prev, coins: prev.coins + bonusCoins } : null);
      setPromoFeedback(<span className="flex items-center gap-1"><Icon name="check" className="text-green-500" size={18} /> ¡Código Válido! Recibes +{bonusCoins} <Icon name="coins" size={18} /></span>);
      playRainbowSound();
      setPromoCode("");
    } else {
      setPromoFeedback(<span className="flex items-center gap-1"><Icon name="x" className="text-red-500" size={18} /> Código Inválido o ya canjeado.</span>);
      playErrorAlertSound();
    }
    setTimeout(() => setPromoFeedback(""), 4000);
  };

  // Theme buying with confirmation preview
  const handleThemeClick = (t: any) => {
    if (!user) return;
    const purchased = purchasedThemes.includes(t.id);
    playClickSound();
    setPreviewTheme({ 
      id: t.id, 
      price: purchased ? 0 : t.price, 
      isAlreadyPurchased: purchased 
    });
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
      const prob = generateMathProblem(isGolden, selectedTopic, getCourseProgress(activeCourse, user), activeCourse);
      setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
      setInputAnswer("");
      setAnswerState({ type: 'idle', text: null });
      playClickSound();
    } else {
      playErrorAlertSound();
    }
  };

  // Evaluate user submission
  const advanceEventProgress = () => {
    const nextStreak = streak + 1;
    let extraTickets = 0;
    let ticketsEarned = 0;
    
    if (nextStreak % 5 === 0) {
      extraTickets = nextStreak + ((equipedPet || PET_BUFFS[0]).buffType === 'combo_extra' ? (equipedPet || PET_BUFFS[0]).value : 0);
      ticketsEarned += extraTickets;
      setIsSupernova(true);
      playFrenzySound();
      setStats(prev => ({ ...prev, supernovas: prev.supernovas + 1 }));
    }
    
    const isInfiniteMode = viewMode === 'infinite_map';
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
    const isInfiniteMode = viewMode === 'infinite_map';
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
    } else if (!valStr || isNaN(parseFloat(valStr))) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400); // match animation duration
      playErrorAlertSound();
      return;
    }

    const userVal = parseFloat(valStr);
    const correctVal = parseFloat(currentProblem.data.expectedAnswer);

    // Accept small rounding tolerance for numeric answers; exact match for truth tables
    const isCorrect = isTruthTable
      ? valStr.toUpperCase() === String(currentProblem.data.expectedAnswer).toUpperCase()
      : Math.abs(userVal - correctVal) <= 0.05;

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

      // Check supernova status
      const nextStreak = streak + 1;
      let extraTickets = 0;
      if (nextStreak % 5 === 0) {
        extraTickets = nextStreak + ((equipedPet || PET_BUFFS[0]).buffType === 'combo_extra' ? (equipedPet || PET_BUFFS[0]).value : 0);
        ticketsEarned += extraTickets;
        setIsSupernova(true);
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

      // Store nextProgress to use later if needed
      const nextProgress = isInfiniteMode ? getCourseProgress(activeCourse, user) : Math.min(100, getCourseProgress(activeCourse, user) + 1);

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
        setIsSupernova(false);
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
            explanation: currentProblem.data.explanation
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
    const prob = generateMathProblem(isGolden, selectedTopic, getCourseProgress(activeCourse, user), activeCourse);
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

    const wonPiecesList: any[] = [];
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

    const randVal = Math.random() * 100;
    let accumulated = 0;
    let prize: any = roulettePrizes[0];

    for (let p of roulettePrizes) {
      accumulated += p.prob;
      if (randVal <= accumulated) {
        prize = p;
        break;
      }
    }

    const prizeIndex = roulettePrizes.findIndex(p => p.id === prize.id);
    const targetSliceAngle = (prize.prob / 100) * 360;
    const targetAngle = 360 - (prizeIndex * (360 / roulettePrizes.length)) - (targetSliceAngle / 2);
    const spins = 5 * 360;
    const finalRot = wheelRotation + spins + targetAngle;

    setWheelRotation(finalRot);

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
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
    }
    [
      'fin_user', 'fin_infinite_progress', 'fin_albums_state', 'fin_unplaced_pieces',
      'fin_current_problem', 'fin_equiped_pet', 'fin_purchased_pets', 'fin_purchased_themes',
      'fin_stats', 'fin_mistakes', 'fin_streak', 'fin_supernova', 'fin_shields',
      'fin_double', 'fin_coins_spent', 'fin_skips_used', 'fin_tutorial_step', 'fin_theme',
    ].forEach(key => localStorage.removeItem(key));
    window.location.reload();
  };

  const claimChallenge = (challenge: any) => {
    if (claimedChallenges.includes(challenge.id)) return;
    setClaimedChallenges([...claimedChallenges, challenge.id]);
    if (challenge.reward.type === 'coins') {
      setUser(prev => prev ? { ...prev, coins: prev.coins + challenge.reward.amount } : null);
    } else {
      setUser(prev => prev ? { ...prev, tickets: prev.tickets + challenge.reward.amount } : null);
    }
    playClickSound();
  };

  const dailyChallenges = [
    { id: 1, icon: '⚡', title: 'Gana 50 Monedas', target: 50, current: Math.min(coins, 50), reward: { type: 'tickets', amount: 5 }, color: 'bg-yellow-400' },
    { id: 2, icon: '🎯', title: 'Alcanza Nivel 10', target: 10, current: Math.min(progress, 10), reward: { type: 'coins', amount: 200 }, color: 'bg-green-400' },
    { id: 3, icon: '💎', title: 'Acumula 10 Tickets', target: 10, current: Math.min(tickets, 10), reward: { type: 'coins', amount: 500 }, color: 'bg-purple-400' },
    { id: 4, icon: '🏆', title: 'Completa 20 Retos', target: 20, current: Math.min(progress, 20), reward: { type: 'tickets', amount: 10 }, color: 'bg-rose-400' },
    { id: 5, icon: '🔥', title: 'Racha de 5', target: 5, current: Math.min(streak, 5), reward: { type: 'coins', amount: 300 }, color: 'bg-amber-400' },
  ];

  if (!authChecked || showLoginScreen === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (showLoginScreen) {
    return showRegisterScreen
      ? <SchoolRegister onBackToLogin={() => setShowRegisterScreen(false)} />
      : <ColegioLogin onLoginSuccess={() => setShowLoginScreen(false)} onRegisterSchool={() => setShowRegisterScreen(true)} />;
  }

  if (profileLoadError) {
    return (
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
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {user && !user.setupCompleted && (
          <InitialSetup initialName={user.name} onComplete={handleInitialSetupComplete} />
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

      <AnimatePresence>
      {viewMode !== 'exercise' ? (
        <PageReveal key="main-app" bgClass={currentThemeStyle.bgClass} className="max-w-[1600px] xl:max-w-[1850px] w-full px-4 lg:px-6 xl:px-10 mx-auto flex flex-col lg:flex-row landscape:flex-row gap-4 lg:gap-6 landscape:gap-3 h-[calc(100vh-2rem)] z-30 relative landscape-mini">
           
           {/* Left Navigation Sidebar */}
           <div className={`nav-sidebar hidden lg:flex landscape:flex flex-col w-64 landscape:max-lg:w-44 h-fit rounded-[2.5rem] p-6 landscape:max-lg:p-4 border-2 shadow-sm relative overflow-hidden ${currentThemeStyle.cardBg}`}>
              <div className="flex items-center mb-8 landscape:max-lg:mb-4">
                <img src="/img/logo_colegio.png" alt="Logo Colegio" className="h-10 w-auto object-contain ml-2 drop-shadow-md" />
              </div>
              <nav className="flex flex-col gap-2 landscape:max-lg:gap-1 z-10 landscape:max-lg:text-sm">
                 {!isStaff && (<>
                 <button onClick={() => setViewMode('map')} className={`flex items-center gap-4 ${viewMode === 'map' ? 'text-blue-600' : `${currentThemeStyle.textPrimary} hover:bg-slate-100`} font-bold p-3 rounded-2xl transition-all relative`}>
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
              <AnimatePresence mode="wait">
              {viewMode === 'map' && (<TabTransition type="swipe" key="map">
                <div key="map" className="flex-1 flex flex-col h-full relative z-10">
                  <div className={`p-4 border-b-2 z-50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative ${currentThemeStyle.headerBg}`}>
                     <div>
                       <h3 className={`font-black uppercase tracking-widest text-sm ${currentThemeStyle.textPrimary}`}>Etapa {Math.floor(progress/20) + 1}</h3>
                       <p className="text-xs font-bold text-slate-500">
                         {activeCourse === 'trigonometria' ? (
                           progress < 20 ? 'Propiedades de las RT' : progress < 40 ? 'Resolución de Triángulos' : progress < 60 ? 'Ángulos Verticales' : progress < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal'
                         ) : activeCourse === 'geometria_5to' ? (
                           progress < 20 ? 'Relaciones Métricas' : progress < 40 ? 'Áreas de Regiones' : progress < 60 ? 'Superficies Circulares' : progress < 80 ? 'Geometría del Espacio' : 'Sólidos y Poliedros'
                         ) : activeCourse === 'razonamiento_5to' ? (
                           progress < 17 ? 'Edades' : progress < 34 ? 'Cronometría' : progress < 51 ? 'Lógica Inferencial' : progress < 68 ? 'Fracciones y Mezclas' : progress < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones'
                         ) : (
                           progress < 20 ? 'Métodos Operativos' : progress < 40 ? 'Criptoaritmética' : progress < 60 ? 'Lógica Recreativa' : progress < 80 ? 'Cronometría Básica' : 'Conteo de Figuras'
                         )}
                       </p>
                     </div>
                     <button 
                       onClick={() => { playClickSound(); setShowDictLab(true); }}
                       className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all shadow-sm"
                     >
                       <span className="text-lg md:text-xl">📖</span>
                       <div className="flex flex-col items-start text-left">
                         <span className="leading-none mb-0.5 text-sm">Códice de Fórmulas</span>
                         <span className="text-[10px] font-medium opacity-80 leading-none">Repasa teoría y trucos 🧠✨</span>
                       </div>
                     </button>
                     <CourseSelector activeCourse={activeCourse} setActiveCourse={setActiveCourse} user={user} />
                  </div>
                  
                  <div className="flex-1 relative overflow-hidden">
                                          <ProgressMap progress={progress} onNodeClick={(step) => {
                        if (step < progress) {
                          if ((step + 1) % 3 !== 0 || (step % 20 === 0)) {
                            setSelectedTopic(null);
                            setViewMode('exercise');
                          } else showToast("Ya reclamaste esta recompensa en el pasado.", "info");
                        } else if (step === progress) {
                          if ((step + 1) % 3 === 0 && (step % 20 !== 0)) { 
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
                     }} />
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
                           'metodos': 'Métodos Operativos',
                           'cripto': 'Criptoaritmética',
                           'logica': 'Lógica Recreativa',
                           'cronometria': 'Cronometría Básica',
                           'conteo': 'Conteo de Figuras',
                           'edades': 'Edades',
                           'cronometria_avanzada': 'Cronometría Avanzada',
                           'logica_inferencial': 'Lógica Inferencial',
                           'mezclas_aleaciones': 'Fracciones y Mezclas',
                           'matematica_financiera': 'Mate Financiera',
                           'planteo_ecuaciones': 'Planteo de Ecuaciones',
                           'propiedades_rt': 'Propiedades de las RT',
                           'resolucion_triangulos': 'Resolución de Triángulos',
                           'angulos_verticales': 'Ángulos Verticales',
                           'geometria_analitica': 'Geometría Analítica',
                           'angulos_posicion_normal': 'Ángulos en Posición Normal'
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
                  <div className="flex-1 overflow-y-auto p-4 md:p-8 relative bg-slate-50/50">
                     <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                       <h2 className="text-xl md:text-2xl font-black text-slate-800">Práctica Infinita</h2>
                       <button 
                         onClick={() => { playClickSound(); setShowDictLab(true); }}
                         className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold rounded-xl transition-all shadow-sm"
                       >
                         <Icon name="book" size={18} />
                         Códice
                       </button>
                       <CourseSelector activeCourse={activeCourse} setActiveCourse={setActiveCourse} user={user} />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                       {(activeCourse === 'geometria_5to' ? [
                         { id: 'relaciones_metricas', name: 'Relaciones Métricas', icon: '📐', color: 'bg-rose-500' },
                         { id: 'areas_regiones', name: 'Áreas de Regiones', icon: '🟦', color: 'bg-fuchsia-500' },
                         { id: 'superficies_circulares', name: 'Superficies Circulares', icon: '⭕', color: 'bg-pink-500' },
                         { id: 'geometria_espacio', name: 'Geometría del Espacio', icon: '🧊', color: 'bg-purple-500' },
                         { id: 'solidos_poliedros', name: 'Sólidos y Poliedros', icon: '🕋', color: 'bg-indigo-500' }
                       ] : activeCourse === 'trigonometria' ? [
                         { id: 'propiedades_rt', name: 'Propiedades de las RT', icon: '📐', color: 'bg-indigo-500' },
                         { id: 'resolucion_triangulos', name: 'Resolución de Triángulos', icon: '📐', color: 'bg-teal-500' },
                         { id: 'angulos_verticales', name: 'Ángulos Verticales', icon: '👀', color: 'bg-orange-500' },
                         { id: 'geometria_analitica', name: 'Intro Geometría Analítica', icon: '📍', color: 'bg-cyan-500' },
                         { id: 'angulos_posicion_normal', name: 'Ángulos en Posición Normal', icon: '🔄', color: 'bg-pink-500' }
                       ] : activeCourse === 'razonamiento_5to' ? [
                         { id: 'edades', name: 'Edades', icon: '👨‍👦', color: 'bg-blue-500' },
                         { id: 'cronometria_avanzada', name: 'Cronometría', icon: '⏳', color: 'bg-sky-500' },
                         { id: 'logica_inferencial', name: 'Lógica Inferencial', icon: '🧠', color: 'bg-violet-500' },
                         { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', icon: '🧪', color: 'bg-amber-500' },
                         { id: 'matematica_financiera', name: 'Mate Financiera', icon: '💰', color: 'bg-rose-500' },
                         { id: 'planteo_ecuaciones', name: 'Planteo de Ecuaciones', icon: '📊', color: 'bg-emerald-500' }
                       ] : [
                         { id: 'metodos', name: 'Métodos Operativos', icon: '🧠', color: 'bg-blue-500' },
                         { id: 'cripto', name: 'Criptoaritmética', icon: '🔢', color: 'bg-emerald-500' },
                         { id: 'logica', name: 'Lógica Recreativa', icon: '🎲', color: 'bg-amber-500' },
                         { id: 'cronometria', name: 'Cronometría Básica', icon: '⏱️', color: 'bg-purple-500' },
                         { id: 'conteo', name: 'Conteo de Figuras', icon: '📐', color: 'bg-rose-500' }
                       ]).map(topic => (
                         <div 
                           key={topic.id} 
                           onClick={() => {
                             setSelectedTopic(topic.id);
                             playClickSound();
                             setViewMode('infinite_map');
                           }}
                           className="bg-white p-4 md:p-5 rounded-3xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group hover:-translate-y-1 flex flex-col items-center text-center min-w-0"
                         >
                            <div className={`w-14 h-14 ${topic.color} rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
                              {topic.icon}
                            </div>
                            <h3 className="font-black text-slate-800 text-base md:text-lg mb-2 leading-tight break-words hyphens-auto w-full">{topic.name}</h3>
                            <p className="text-xs font-bold text-slate-500">Modo Infinito</p>
                         </div>
                       ))}
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
                <div key="shop" className={`absolute inset-0 overflow-y-auto p-4 md:p-8 no-scrollbar ${currentThemeStyle.bgClass} ${currentThemeStyle.textPrimary}`}>
                  <div className="max-w-4xl mx-auto pb-32">
                    {/* Header */}
                    <div className={`p-6 rounded-3xl border-2 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 ${currentThemeStyle.cardBg}`}>
                       <div>
                         <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
                           <Icon name="store" size={32} className="text-blue-500" /> Tienda
                         </h2>
                         <p className={`font-bold mt-1 text-xs md:text-sm ${currentThemeStyle.textSecondary}`}>Invierte tus monedas en ventajas estratégicas y personalización.</p>
                       </div>
                       <div className={`px-5 py-2.5 rounded-2xl border-2 flex items-center gap-2.5 w-fit shrink-0 ${currentThemeStyle.bentoBg}`}>
                         <Icon name="coins" size={24} className="text-amber-500" />
                         <span className="text-xl font-black">{coins}</span>
                       </div>
                    </div>

                    
                    {/* Section 1: Poderes y Mejoras */}
                    <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${currentThemeStyle.textPrimary}`}>
                      <Icon name="zap" className="text-amber-500" size={22} /> Poderes y Mejoras
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      
                      {/* Seguro Básico */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-100 bg-emerald-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl text-blue-500">🛡️</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-emerald-800">Seguro Básico</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-emerald-700/80">Cubre tus pérdidas si te equivocas.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-emerald-700 font-black text-[10px] sm:text-xs shrink-0">Tienes: {shieldCount}</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 if (user.coins >= 60) { setUser(prev => prev ? { ...prev, coins: prev.coins - 60 } : null); setShieldCount(s => s + 1); playClickSound(); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                               60 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Póliza Premium x3 */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-emerald-100 bg-emerald-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">🔰</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-emerald-800">Póliza Premium x3</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-emerald-700/80">3 Seguros contra errores de cálculo.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-emerald-700 font-black text-[10px] sm:text-xs shrink-0">Ahorro especial</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 if (user.coins >= 150) { setUser(prev => prev ? { ...prev, coins: prev.coins - 150 } : null); setShieldCount(s => s + 3); playClickSound(); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                               150 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Rally Alcista */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-fuchsia-100 bg-fuchsia-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">⚡</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-fuchsia-800">Rally Alcista</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-fuchsia-700/80">Activa la Supernova al instante.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                             <span className="text-fuchsia-700 font-black text-[10px] sm:text-xs shrink-0">{isSupernova ? 'Ya activo' : ''}</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto disabled:opacity-50" 
                              disabled={isSupernova}
                              onClick={() => {
                                 if (user.coins >= 150) { setUser(prev => prev ? { ...prev, coins: prev.coins - 150 } : null); setIsSupernova(true); playClickSound(); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                               150 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Dividendos x3 */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-blue-100 bg-blue-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl text-rose-500">🎟️</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-blue-800">Dividendos x3</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-blue-700/80">Triple de tickets (3 aciertos).</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-blue-700 font-black text-[10px] sm:text-xs shrink-0">{activeDoubleDividends ? 'Activo' : 'Inactivo'}</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 if (user.coins >= 200 && !activeDoubleDividends) { setUser(prev => prev ? { ...prev, coins: prev.coins - 200 } : null); setActiveDoubleDividends(true); playClickSound(); } else if (activeDoubleDividends) { showToast("Ya tienes este poder activo.", "info"); } else { showToast("No tienes suficientes monedas."); }
                              }}
                            >
                               200 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Inyección de Capital */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-amber-100 bg-amber-50/50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">💰</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-amber-800">Inyección de Capital</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-amber-700/80">Doble de monedas (5 aciertos).</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-amber-700 font-black text-[10px] sm:text-xs shrink-0">Boost activo</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 showToast("Disponible próximamente", "info");
                              }}
                            >
                               250 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                      {/* Contrato Seguro */}
                      <div className="p-4 sm:p-5 rounded-3xl border-2 border-rose-100 bg-rose-50 shadow-sm flex flex-col justify-between transition-all group overflow-hidden">
                         <div className="flex items-start gap-3 sm:gap-3.5 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform filter drop-shadow-sm">
                              <span className="text-4xl">🎁</span>
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="font-black text-sm sm:text-base leading-tight truncate text-rose-800">Contrato Seguro</h4>
                               <p className="text-[11px] sm:text-xs font-bold leading-snug mt-1 text-rose-700/80">Caja Fuerte garantizada en tu próximo acierto.</p>
                            </div>
                         </div>
                         <div className="flex items-center justify-between gap-2 pt-3 mt-auto flex-wrap">
                            <span className="text-rose-700 font-black text-[10px] sm:text-xs shrink-0">Garantía</span>
                            <button 
                              className="px-6 py-2 bg-slate-400 hover:bg-slate-500 active:scale-95 text-white font-black text-sm rounded-xl shadow-sm border-b-4 border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ml-auto" 
                              onClick={() => {
                                 showToast("Disponible próximamente", "info");
                              }}
                            >
                               180 <Icon name="coins" size={16} className="text-amber-400 drop-shadow-sm" />
                            </button>
                         </div>
                      </div>

                    </div>

                    {/* Section 2: Cofres */}
                    <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${currentThemeStyle.textPrimary}`}>
                      <Icon name="gift" className="text-amber-500" size={22} /> Cofres de Recompensas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                       {/* Cofre Básico */}
                       <div className={`p-5 rounded-3xl border-2 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all ${currentThemeStyle.bentoBg}`}>
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center my-2 text-slate-600 dark:text-slate-300">
                            <Icon name="box" size={38} />
                          </div>
                          <h4 className="font-black text-base mt-1">Cofre Básico</h4>
                          <p className={`text-xs font-bold mt-1 mb-4 ${currentThemeStyle.textSecondary}`}>Premios estándar y tickets.</p>
                          <button 
                            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border-b-4 border-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto" 
                            onClick={() => {
                              if (user.tickets >= 100) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 100 } : null); openRandomChest('common'); playClickSound(); } else { showToast("No tienes suficientes tickets."); }
                            }}
                          >
                            <Icon name="coins" size={16} /> 500
                          </button>
                       </div>

                       {/* Cofre Raro */}
                       <div className={`p-5 rounded-3xl border-2 border-blue-300 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all relative overflow-hidden ${currentThemeStyle.bentoBg}`}>
                          <div className="absolute inset-0 bg-blue-500/5 z-0 pointer-events-none"></div>
                          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center my-2 text-blue-500 relative z-10">
                            <Icon name="diamond" size={38} />
                          </div>
                          <h4 className="font-black text-base text-blue-500 relative z-10 mt-1">Cofre Raro</h4>
                          <p className={`text-xs font-bold mt-1 mb-4 relative z-10 ${currentThemeStyle.textSecondary}`}>Mejores recompensas garantizadas.</p>
                          <button 
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border-b-4 border-blue-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto relative z-10" 
                            onClick={() => {
                              if (user.tickets >= 300) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 300 } : null); openRandomChest('rare'); playClickSound(); } else { showToast("No tienes suficientes tickets."); }
                            }}
                          >
                            <Icon name="ticket" size={16} /> 300
                          </button>
                       </div>

                       {/* Cofre Épico */}
                       <div className={`p-5 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-all relative overflow-hidden ${currentThemeStyle.bentoBg}`}>
                          <div className="absolute inset-0 bg-amber-500/5 z-0 pointer-events-none"></div>
                          <span className="absolute top-3 right-3 text-[9px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full z-10 animate-pulse tracking-wider">HOT</span>
                          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center my-2 text-amber-500 relative z-10">
                            <Icon name="crown" size={38} />
                          </div>
                          <h4 className="font-black text-base text-amber-500 relative z-10 mt-1">Cofre Épico</h4>
                          <p className={`text-xs font-bold mt-1 mb-4 relative z-10 ${currentThemeStyle.textSecondary}`}>Premios masivos sorpresa.</p>
                          <button 
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-sm border-b-4 border-amber-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-auto relative z-10" 
                            onClick={() => {
                              if (user.tickets >= 1000) { setUser(prev => prev ? { ...prev, tickets: prev.tickets - 1000 } : null); openRandomChest('legendary'); playClickSound(); } else { showToast("No tienes suficientes tickets."); }
                            }}
                          >
                            <Icon name="ticket" size={16} /> 1000
                          </button>
                       </div>
                    </div>

                    {/* Section 3: Estilos Visuales */}
                    <h3 className={`text-xl font-black mb-4 flex items-center gap-2 ${currentThemeStyle.textPrimary}`}>
                      <Icon name="sparkles" className="text-blue-500" size={22} /> Estilos Visuales
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {themes.map(th => {
                         const style = THEME_STYLES[th.id];
                         const isEquipped = activeTheme === th.id;
                         const isPurchased = purchasedThemes.includes(th.id);
                         const isIconKey = style?.emoji && (style.emoji.length > 2 || /^[a-z_]+$/i.test(style.emoji));

                         return (
                           <div key={th.id} className={`p-5 border-2 rounded-3xl flex flex-col justify-between shadow-sm transition-all gap-4 ${style?.bezelClass || 'bg-slate-50 border-slate-200'}`}>
                              <div className="flex items-center gap-3.5 min-w-0">
                                 <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-black/30 flex items-center justify-center shrink-0 border border-slate-200/50 shadow-inner">
                                   {isIconKey ? (
                                     <Icon name={style.emoji} size={26} className={style?.accentText || "text-blue-500"} />
                                   ) : (
                                     <span className="text-2xl">{style?.emoji || '✨'}</span>
                                   )}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <h5 className={`font-black text-base truncate ${style?.textPrimary || 'text-slate-800'}`}>{th.name}</h5>
                                    <p className={`text-xs font-bold leading-snug ${style?.textSecondary || 'text-slate-500'}`}>{th.desc}</p>
                                 </div>
                              </div>
                              <div className="pt-3 border-t border-slate-200/40 dark:border-slate-700/40 flex justify-end mt-auto">
                                 <button 
                                   onClick={() => handleThemeClick(th)}
                                   className={`w-full sm:w-auto px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                                     isEquipped 
                                       ? 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-default opacity-80' 
                                       : isPurchased 
                                       ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white border-b-4 border-blue-800' 
                                       : 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-white border-b-4 border-amber-700'
                                   }`}
                                 >
                                   {isEquipped ? 'Equipado' : isPurchased ? 'Equipar' : <><Icon name="coins" size={16} /> {th.price}</>}
                                 </button>
                              </div>
                           </div>
                         )
                       })}
                    </div>
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
                  />
                </div>
              </TabTransition>)}

              {viewMode === 'teacher_dash' && (<TabTransition type="swipe" key="teacher_dash">
                <div key="teacher_dash" className="h-full relative bg-white/50 overflow-y-auto p-4 md:p-8">
                  <TeacherDashboard currentUserRole={user.role} currentUserUid={authUser?.uid} />
                </div>
              </TabTransition>)}


              {viewMode === 'teacher' && (<TabTransition type="swipe" key="teacher">
                <div key="teacher" className="h-full relative bg-white/50 overflow-hidden">
                  <TeacherModeModal 
                    isInline={true}
                    currentProblemIntro={currentProblem.data.intro}
                    currentProblemAnswer={currentProblem.data.expectedAnswer}
                    currentProblemExplanation={currentProblem.data.explanation}
                    callGemini={callGemini}
                  />
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
                        <Button onClick={() => { if (user.coins >= 300) { setUser(prev => prev ? { ...prev, coins: prev.coins - 300 } : null); setShieldCount(s => s + 1); playClickSound(); } }} color="emerald" className="px-3 py-1.5 text-[10px] shrink-0 shadow-sm uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Icon name="coins" size={18} /> 300</div></Button>
                     </div>
                     <div className="p-3 bg-slate-500/5 border border-slate-500/15 rounded-2xl flex items-center justify-between gap-2 hover:bg-slate-500/10 transition-all duration-200">
                        <div className="flex items-center gap-3">
                           <span className="text-2xl filter drop-shadow-sm"><Icon name="zap" className="inline-block" size={18} /></span>
                           <div>
                              <h5 className={`font-black text-[11px] leading-tight ${currentThemeStyle.textPrimary}`}>Doble</h5>
                              <p className={`text-[9px] font-bold ${currentThemeStyle.textSecondary}`}>{activeDoubleDividends ? 'Activo' : 'Inactivo'}</p>
                           </div>
                        </div>
                        <Button onClick={() => { if (user.coins >= 500 && !activeDoubleDividends) { setUser(prev => prev ? { ...prev, coins: prev.coins - 500 } : null); setActiveDoubleDividends(true); playClickSound(); } }} color="purple" className="px-3 py-1.5 text-[10px] shrink-0 shadow-sm uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><Icon name="coins" size={18} /> 500</div></Button>
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
                DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic!] || 0) : progress) + 1} - {currentProblem.data.type.toUpperCase()}
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
                  <div className={`mb-6 p-4 rounded-xl border-2 w-full animate-pop font-black text-sm text-center shadow-md ${answerState.type === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
                    {answerState.text}
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                {currentProblem.solved ? (() => {
                  const prog = viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic] || 0) : (user?.progress || 0);
                  const isEventNext = (prog + 1) % 3 === 0 && (prog % (viewMode === 'infinite_map' ? 10 : 20) !== 0);
                  
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
                        }}
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
          transition={{ duration: 0.5, delay: 3.0, ease: "easeOut" }}
          className="nav-sidebar lg:hidden landscape:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 p-2 z-[100] flex justify-around items-center pb-safe"
        >
          {!isStaff && (<>
          <button onClick={() => setViewMode('map')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'map' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="home" />
            <span className="text-[9px] font-black uppercase tracking-wider">Aprender</span>
          </button>
          <button onClick={() => setViewMode('practice')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${viewMode === 'practice' ? 'text-blue-500' : 'text-slate-400'}`}>
            <Icon name="target" />
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
          currentProblemIntro={currentProblem.data.intro} 
          currentProblemAnswer={currentProblem.data.expectedAnswer} 
          currentProblemExplanation={currentProblem.data.explanation} 
          callGemini={callGemini} 
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
            <Button onClick={() => setShowDistractionWarning(false)} color="rose" className="w-full">
              Volver a Concentrarme
            </Button>
          </Card>
        </div>
      )}

      {showShellGame && (
        <ShellGameMinigame 
          onFinish={onFinishShellGame} 
          playClick={playClickSound} 
          playCatch={playCatchSound} 
          playTick={playRouletteTick} 
          playRainbow={playRainbowSound} 
          playError={playErrorAlertSound} 
        />
      )}

      {showPetRace && (
        <PetRaceMinigame 
          onFinish={onFinishPetRace} 
          playClick={playClickSound} 
          playCatch={playCatchSound} 
          playTick={playRouletteTick} 
          playRainbow={playRainbowSound} 
        />
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

