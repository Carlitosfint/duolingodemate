import React from 'react';
import { Hash, Sparkles as Sparkles2, Check as Check2,
  Crown, Wallet, Box, TrendingUp, TrendingDown,
  Sparkles, Cat, Rabbit, Bird, Dog, Target, BookOpen, FolderOpen,
  Store, User, GraduationCap, Flame, ArrowRight, X, Play, Volume2, Shield,
  Lock, Unlock, Package, Flag, Ghost, Orbit, Building, Gift, Settings,
  ChevronLeft, Check, AlertCircle, ShieldAlert, BadgeCent,
  Trophy, Banknote, Landmark, ShieldCheck, Map as MapIcon, BookX, Diamond,
  Mail, Eye, EyeOff
} from 'lucide-react';

export const Icon = ({ name, className, size = 24 }: { name: string, className?: string, size?: number }) => {
  const iconProps = { className, size, strokeWidth: 2.5 };
  const coloredProps = { ...iconProps, fill: 'currentColor', fillOpacity: 0.2 };
  const sz = size || 24;
  const cls = className || '';
  
  switch(name) {
    // ---- HIGH QUALITY PREMIUM ICONS ----
    case 'coins': 
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(255, 204, 0, 0.4))' }}>
          <defs>
            <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff5b8" />
              <stop offset="30%" stopColor="#ffd700" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="coinEdge" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="65" rx="35" ry="15" fill="url(#coinEdge)" />
          <ellipse cx="50" cy="55" rx="35" ry="15" fill="url(#coinEdge)" />
          <ellipse cx="50" cy="45" rx="35" ry="15" fill="url(#coinGrad)" stroke="#fef08a" strokeWidth="2" />
          <text x="50" y="52" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="20" fill="#b45309" textAnchor="middle" transform="scale(1, 0.8) translate(0, 10)">$</text>
        </svg>
      );
    case 'ticket':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(168, 85, 247, 0.4))' }}>
          <defs>
            <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6b21a8" />
            </linearGradient>
            <linearGradient id="ticketBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <path d="M15,30 L85,30 A10,10 0 0,0 85,70 L15,70 A10,10 0 0,0 15,30 Z" fill="url(#ticketGrad)" stroke="url(#ticketBorder)" strokeWidth="3" />
          <circle cx="20" cy="50" r="5" fill="#f8fafc" />
          <circle cx="80" cy="50" r="5" fill="#f8fafc" />
          <line x1="35" y1="35" x2="35" y2="65" stroke="#f3e8ff" strokeWidth="3" strokeDasharray="6,4" />
          <text x="55" y="56" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="18" fill="#f3e8ff" textAnchor="middle" letterSpacing="2">VIP</text>
        </svg>
      );
    case 'zap':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 8px rgba(56, 189, 248, 0.5))' }}>
          <defs>
            <linearGradient id="zapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path d="M60,10 L25,55 L45,55 L40,90 L75,45 L55,45 Z" fill="url(#zapGrad)" stroke="#e0f2fe" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'star':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 8px rgba(251, 191, 36, 0.6))' }}>
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <path d="M50,10 L61,38 L90,38 L66,55 L75,85 L50,68 L25,85 L34,55 L10,38 L39,38 Z" fill="url(#starGrad)" stroke="#fffbeb" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'infinity':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))' }}>
          <defs>
            <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <path d="M30,35 C15,35 15,65 30,65 C45,65 55,35 70,35 C85,35 85,65 70,65 C55,65 45,35 30,35 Z" fill="none" stroke="url(#infGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'headphones':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.4))' }}>
          <defs>
            <linearGradient id="hpGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <path d="M20,60 L20,45 C20,25 35,15 50,15 C65,15 80,25 80,45 L80,60" fill="none" stroke="url(#hpGrad)" strokeWidth="10" strokeLinecap="round" />
          <rect x="10" y="55" width="20" height="30" rx="10" fill="url(#hpGrad)" />
          <rect x="70" y="55" width="20" height="30" rx="10" fill="url(#hpGrad)" />
        </svg>
      );

    case 'diamond':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(56, 189, 248, 0.6))' }}>
          <defs>
            <linearGradient id="diamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="diamHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d="M20,30 L80,30 L50,90 Z" fill="url(#diamGrad)" stroke="#0284c7" strokeWidth="2" strokeLinejoin="round" />
          <path d="M20,30 L50,10 L80,30 Z" fill="url(#diamGrad)" stroke="#0284c7" strokeWidth="2" strokeLinejoin="round" />
          <path d="M35,30 L50,10 L65,30 L50,90 Z" fill="url(#diamHighlight)" opacity="0.6" />
        </svg>
      );
    case 'crown':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(251, 191, 36, 0.5))' }}>
          <defs>
            <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
          </defs>
          <path d="M10,80 L90,80 L80,40 L65,60 L50,20 L35,60 L20,40 Z" fill="url(#crownGrad)" stroke="#a16207" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="20" cy="35" r="5" fill="#ef4444" />
          <circle cx="50" cy="15" r="5" fill="#3b82f6" />
          <circle cx="80" cy="35" r="5" fill="#ef4444" />
          <path d="M20,85 L80,85" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'fire':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.5))' }}>
          <defs>
            <radialGradient id="fireGrad" cx="50%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </radialGradient>
          </defs>
          <path d="M50,90 C25,90 20,65 20,55 C20,40 35,30 45,10 C45,10 40,30 55,40 C65,45 65,35 65,35 C75,45 80,55 80,65 C80,80 65,90 50,90 Z" fill="url(#fireGrad)" stroke="#991b1b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M50,85 C35,85 35,70 35,65 C35,55 45,45 50,35 C55,45 60,50 60,60 C60,70 55,85 50,85 Z" fill="#fef08a" opacity="0.8" />
        </svg>
      );
    case 'shield':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))' }}>
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          <path d="M50,10 L15,25 L15,50 C15,75 35,90 50,95 C65,90 85,75 85,50 L85,25 Z" fill="url(#shieldGrad)" stroke="#064e3b" strokeWidth="3" strokeLinejoin="round" />
          <path d="M35,55 L45,65 L65,40" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'ufo':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 6px 12px rgba(168, 85, 247, 0.4))' }}>
          <defs>
            <linearGradient id="ufoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e9d5ff" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
            <radialGradient id="ufoGlass" cx="50%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </radialGradient>
          </defs>
          <path d="M30,50 C30,30 70,30 70,50 Z" fill="url(#ufoGlass)" stroke="#0284c7" strokeWidth="2" />
          <ellipse cx="50" cy="60" rx="40" ry="15" fill="url(#ufoGrad)" stroke="#581c87" strokeWidth="3" />
          <circle cx="30" cy="60" r="3" fill="#fef08a" />
          <circle cx="50" cy="62" r="3" fill="#fef08a" />
          <circle cx="70" cy="60" r="3" fill="#fef08a" />
          <path d="M40,80 L60,80" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case 'box':
    case 'package':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 6px 8px rgba(180, 83, 9, 0.4))' }}>
          <defs>
            <linearGradient id="boxTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="boxLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="boxRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <path d="M50,15 L85,30 L50,45 L15,30 Z" fill="url(#boxTop)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
          <path d="M15,30 L50,45 L50,85 L15,70 Z" fill="url(#boxLeft)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
          <path d="M85,30 L50,45 L50,85 L85,70 Z" fill="url(#boxRight)" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 'home':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4))' }}>
          <defs>
            <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          <path d="M20,50 L20,85 L80,85 L80,50 Z" fill="url(#homeGrad)" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round" />
          <path d="M10,50 L50,15 L90,50" fill="none" stroke="url(#roofGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="40" y="60" width="20" height="25" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="2" />
        </svg>
      );
    case 'store':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(244, 63, 94, 0.4))' }}>
          <defs>
            <linearGradient id="storeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fecdd3" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="awningGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="25%" stopColor="#e11d48" />
              <stop offset="50%" stopColor="#fff" />
              <stop offset="75%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
          </defs>
          <path d="M15,40 L85,40 L80,90 L20,90 Z" fill="url(#storeGrad)" stroke="#9f1239" strokeWidth="3" strokeLinejoin="round" />
          <path d="M10,40 L20,20 L80,20 L90,40" fill="url(#awningGrad)" stroke="#9f1239" strokeWidth="3" strokeLinejoin="round" />
          <rect x="40" y="60" width="20" height="30" fill="#f8fafc" stroke="#9f1239" strokeWidth="2" />
        </svg>
      );
    case 'user':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(99, 102, 241, 0.4))' }}>
          <defs>
            <linearGradient id="userGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c7d2fe" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="35" r="20" fill="url(#userGrad)" stroke="#312e81" strokeWidth="3" />
          <path d="M20,90 C20,70 35,60 50,60 C65,60 80,70 80,90" fill="url(#userGrad)" stroke="#312e81" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case 'lock':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(100, 116, 139, 0.4))' }}>
          <defs>
            <linearGradient id="lockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
          <rect x="25" y="45" width="50" height="40" rx="8" fill="url(#lockGrad)" stroke="#1e293b" strokeWidth="3" />
          <path d="M35,45 L35,30 C35,15 65,15 65,30 L65,45" fill="none" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
          <circle cx="50" cy="65" r="4" fill="#f8fafc" />
        </svg>
      );
    case 'unlock':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls} style={{ filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))' }}>
          <defs>
            <linearGradient id="unlockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect x="25" y="45" width="50" height="40" rx="8" fill="url(#unlockGrad)" stroke="#064e3b" strokeWidth="3" />
          <path d="M35,45 L35,30 C35,15 65,15 65,30" fill="none" stroke="#a7f3d0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="50" cy="65" r="4" fill="#f8fafc" />
        </svg>
      );

    // ---- REGULAR ICONS ----
    case 'money_bag': return <Wallet {...coloredProps} />;
    case 'coupon': return <BadgeCent {...coloredProps} />;
            
    // Albums
    case 'cash': return <Banknote {...coloredProps} />;
    case 'safe': return <Lock {...coloredProps} />;
    case 'gold_bar': return <Box {...coloredProps} />;
    case 'trending_up': return <TrendingUp {...coloredProps} />;
    case 'trending_down': return <TrendingDown {...coloredProps} />;
    
    // Buffs & Pets
    case 'sparkles': return <Sparkles {...coloredProps} />;
    case 'bull': return <Target {...coloredProps} />; 
    case 'cat': return <Cat {...coloredProps} />;
    case 'owl': return <Bird {...coloredProps} />;
    case 'fox': return <Dog {...coloredProps} />; 
    case 'dog': return <Dog {...coloredProps} />;
    case 'rabbit': return <Rabbit {...coloredProps} />;
    case 'bird': return <Bird {...coloredProps} />;
    
    // Events & Market
    case 'bank': return <Landmark {...coloredProps} />;
    case 'flying_money': return <Banknote {...coloredProps} />;
        
    // Progress Map
                    case 'flag': return <Flag {...iconProps} />;
        case 'sprout': return <Sparkles {...iconProps} />;
    
    // Navigation
        case 'book': return <BookOpen {...iconProps} />;
    case 'mistakes':
    case 'book_x': return <BookX {...iconProps} />;
    case 'folder': return <FolderOpen {...iconProps} />;
            case 'teacher': return <GraduationCap {...iconProps} strokeWidth={2.5} />;
    case 'target': return <Target {...iconProps} />;
    
    case 'hash': return <Hash {...iconProps} />;
    case 'arrow_right': return <ArrowRight {...iconProps} />;
    case 'x': return <X {...iconProps} />;
    case 'check': return <Check2 {...iconProps} />;
    case 'mail': return <Mail {...iconProps} />;
    case 'eye': return <Eye {...iconProps} />;
    case 'eye-off': return <EyeOff {...iconProps} />;
    default: return <Sparkles2 {...iconProps} />;
  }
};
