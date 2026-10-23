import React from 'react';
import { Hash, Sparkles as Sparkles2, Check as Check2,
  Crown, Wallet, Box, TrendingUp, TrendingDown,
  Sparkles, Cat, Rabbit, Bird, Dog, Target, BookOpen, FolderOpen,
  Home, Infinity as InfinityIcon, Puzzle,
  Store, User, GraduationCap, Flame, ArrowRight, X, Play, Volume2, Shield,
  Lock, Unlock, Package, Flag, Ghost, Orbit, Building, Gift, Settings,
  ChevronLeft, Check, AlertCircle, ShieldAlert, BadgeCent,
  Trophy, Banknote, Landmark, ShieldCheck, Map as MapIcon, BookX, Diamond,
  Mail, Eye, EyeOff, Phone, CreditCard, Rocket,
  Users, Plus, ChevronDown, ArrowUp, ArrowDown, RefreshCw, KeyRound, UserMinus, UserCheck,
  Search, ChevronRight, Copy
} from 'lucide-react';

export const Icon = ({ name, className, size = 24 }: { name: string, className?: string, size?: number }) => {
  const iconProps = { className, size, strokeWidth: 2.5 };
  const coloredProps = { ...iconProps, fill: 'currentColor', fillOpacity: 0.2 };
  const sz = size || 24;
  const cls = className || '';
  
  switch(name) {
    // ---- FLAT GEOMETRIC VECTOR ICONS (NO GRADIENTS, NO BLURRY DROP-SHADOWS) ----
    case 'coins': 
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <ellipse cx="50" cy="68" rx="34" ry="14" fill="#B45309" />
          <ellipse cx="50" cy="58" rx="34" ry="14" fill="#D97706" />
          <ellipse cx="50" cy="46" rx="34" ry="15" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
          <ellipse cx="50" cy="46" rx="25" ry="10" fill="#FDE68A" />
          <text x="50" y="52" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="18" fill="#B45309" textAnchor="middle">$</text>
        </svg>
      );
    case 'ticket':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M14,34 L86,34 A10,10 0 0,0 86,72 L14,72 A10,10 0 0,0 14,34 Z" fill="#6D28D9" />
          <path d="M14,28 L86,28 A10,10 0 0,0 86,66 L14,66 A10,10 0 0,0 14,28 Z" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="4" strokeLinejoin="round" />
          <line x1="36" y1="33" x2="36" y2="61" stroke="#DDD6FE" strokeWidth="3.5" strokeDasharray="5,4" strokeLinecap="round" />
          <rect x="44" y="38" width="30" height="18" rx="4" fill="#EDE9FE" />
          <text x="59" y="51" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#5B21B6" textAnchor="middle">VIP</text>
        </svg>
      );
    case 'zap':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M58,12 L24,56 L46,56 L38,90 L76,44 L54,44 Z" fill="#0284C7" transform="translate(0, 4)" />
          <path d="M58,10 L24,54 L46,54 L38,88 L76,42 L54,42 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="4" strokeLinejoin="round" />
          <path d="M54,20 L33,49 L47,49 L43,70 L64,45 L50,45 Z" fill="#BAE6FD" />
        </svg>
      );
    case 'star':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M50,14 L61,39 L88,41 L67,58 L74,85 L50,70 L26,85 L33,58 L12,41 L39,39 Z" fill="#B45309" transform="translate(0, 5)" />
          <path d="M50,12 L61,37 L88,39 L67,56 L74,83 L50,68 L26,83 L33,56 L12,39 L39,37 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="4" strokeLinejoin="round" />
          <path d="M50,22 L57,39 L74,41 L61,52 L65,69 L50,59 Z" fill="#FDE68A" />
        </svg>
      );
    case 'headphones':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M22,58 L22,46 C22,26 35,16 50,16 C65,16 78,26 78,46 L78,58" fill="none" stroke="#4338CA" strokeWidth="10" strokeLinecap="round" />
          <rect x="12" y="52" width="18" height="30" rx="9" fill="#6366F1" stroke="#3730A3" strokeWidth="4" />
          <rect x="70" y="52" width="18" height="30" rx="9" fill="#6366F1" stroke="#3730A3" strokeWidth="4" />
          <rect x="16" y="58" width="6" height="16" rx="3" fill="#A5B4FC" />
          <rect x="74" y="58" width="6" height="16" rx="3" fill="#A5B4FC" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <polygon points="30,18 70,18 88,38 50,86 12,38" fill="#0284C7" stroke="#0369A1" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="30,18 70,18 62,38 38,38" fill="#BAE6FD" />
          <polygon points="12,38 38,38 30,18" fill="#7DD3FC" />
          <polygon points="62,38 88,38 70,18" fill="#38BDF8" />
          <polygon points="38,38 62,38 50,86" fill="#38BDF8" />
          <polygon points="12,38 38,38 50,86" fill="#0EA5E9" />
          <polygon points="30,18 70,18 88,38 50,86 12,38" fill="none" stroke="#0369A1" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'mastery_trophy':
    case 'crown':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          {/* Pedestal base */}
          <rect x="30" y="78" width="40" height="10" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="3.5" />
          <rect x="38" y="68" width="24" height="10" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="3.5" />
          {/* Handles */}
          <path d="M28,28 H16 V42 C16,52 24,56 32,56" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M72,28 H84 V42 C84,52 76,56 68,56" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Cup body */}
          <path d="M26,20 H74 V42 C74,58 64,68 50,68 C36,68 26,58 26,42 Z" fill="#FBBF24" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          {/* Flat highlight band */}
          <path d="M32,26 H44 V42 C44,53 40,60 35,62 C33,56 32,49 32,42 Z" fill="#FDE68A" />
          {/* Central emblem star */}
          <polygon points="50,30 54,39 63,40 56,46 58,55 50,50 42,55 44,46 37,40 46,39" fill="#FFFFFF" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case 'fire':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M50,90 C26,90 18,68 20,52 C22,36 36,24 46,10 C46,10 43,28 54,36 C60,28 62,22 62,22 C74,34 82,48 80,64 C78,80 66,90 50,90 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="4" strokeLinejoin="round" />
          <path d="M50,86 C34,86 30,70 32,58 C34,46 44,38 50,28 C54,38 64,46 66,58 C68,72 60,86 50,86 Z" fill="#FB923C" />
          <path d="M50,84 C40,84 38,74 40,66 C42,58 47,52 50,46 C53,52 58,58 60,66 C62,74 58,84 50,84 Z" fill="#FDE047" />
        </svg>
      );
    case 'shield':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M50,12 L16,26 L16,50 C16,74 34,88 50,94 C66,88 84,74 84,50 L84,26 Z" fill="#10B981" stroke="#065F46" strokeWidth="4" strokeLinejoin="round" />
          <path d="M50,16 L20,29 L20,50 C20,71 35,84 50,89 Z" fill="#34D399" />
          <path d="M35,54 L46,65 L66,40" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'ufo':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M30,50 C30,28 70,28 70,50 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="4" />
          <ellipse cx="50" cy="58" rx="40" ry="14" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="4" />
          <circle cx="28" cy="58" r="4" fill="#FDE047" />
          <circle cx="50" cy="60" r="4" fill="#FDE047" />
          <circle cx="72" cy="58" r="4" fill="#FDE047" />
        </svg>
      );
    case 'box':
    case 'package':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <polygon points="50,14 86,30 50,46 14,30" fill="#FBBF24" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="14,30 50,46 50,86 14,70" fill="#D97706" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="86,30 50,46 50,86 86,70" fill="#B45309" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="32,22 68,38 58,42 22,26" fill="#FDE68A" />
        </svg>
      );
    case 'lock':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M35,45 L35,30 C35,16 65,16 65,30 L65,45" fill="none" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
          <rect x="24" y="44" width="52" height="42" rx="10" fill="#94A3B8" stroke="#334155" strokeWidth="4" />
          <rect x="28" y="48" width="20" height="34" rx="6" fill="#CBD5E1" />
          <circle cx="50" cy="62" r="5" fill="#1E293B" />
          <rect x="48" y="64" width="4" height="10" rx="2" fill="#1E293B" />
        </svg>
      );
    case 'unlock':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <path d="M35,45 L35,28 C35,14 65,14 65,26" fill="none" stroke="#059669" strokeWidth="8" strokeLinecap="round" />
          <rect x="24" y="44" width="52" height="42" rx="10" fill="#10B981" stroke="#065F46" strokeWidth="4" />
          <rect x="28" y="48" width="20" height="34" rx="6" fill="#34D399" />
          <circle cx="50" cy="65" r="5" fill="#FFFFFF" />
        </svg>
      );

    // ---- BESPOKE FLAT THEME EMBLEMS FOR SHOP & PROFILE ----
    case 'theme_default':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <rect x="12" y="14" width="76" height="72" rx="18" fill="#EFF6FF" stroke="#2563EB" strokeWidth="4" />
          <rect x="22" y="24" width="56" height="16" rx="6" fill="#3B82F6" />
          <circle cx="30" cy="32" r="3.5" fill="#FFFFFF" />
          <circle cx="40" cy="32" r="3.5" fill="#93C5FD" />
          <rect x="22" y="48" width="25" height="26" rx="6" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="3" />
          <rect x="53" y="48" width="25" height="11" rx="4" fill="#10B981" />
          <rect x="53" y="63" width="25" height="11" rx="4" fill="#60A5FA" />
        </svg>
      );
    case 'theme_neon':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <rect x="12" y="14" width="76" height="72" rx="18" fill="#0F172A" stroke="#06B6D4" strokeWidth="4" />
          <line x1="16" y1="68" x2="84" y2="68" stroke="#EC4899" strokeWidth="3" />
          <line x1="32" y1="68" x2="22" y2="84" stroke="#06B6D4" strokeWidth="2.5" />
          <line x1="50" y1="68" x2="50" y2="84" stroke="#06B6D4" strokeWidth="2.5" />
          <line x1="68" y1="68" x2="78" y2="84" stroke="#06B6D4" strokeWidth="2.5" />
          <circle cx="50" cy="44" r="16" fill="#EC4899" />
          <rect x="32" y="42" width="36" height="4" fill="#0F172A" />
          <rect x="34" y="50" width="32" height="4" fill="#0F172A" />
          <polygon points="24,68 42,46 58,68" fill="#22D3EE" />
          <polygon points="46,68 64,42 80,68" fill="#A855F7" />
        </svg>
      );
    case 'theme_galaxy':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <rect x="12" y="14" width="76" height="72" rx="18" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="4" />
          <circle cx="28" cy="28" r="3" fill="#FDE047" />
          <circle cx="74" cy="26" r="2.5" fill="#38BDF8" />
          <circle cx="26" cy="70" r="2.5" fill="#C084FC" />
          <circle cx="50" cy="50" r="16" fill="#6366F1" stroke="#A5B4FC" strokeWidth="3" />
          <path d="M38,44 C44,40 56,40 62,44" fill="none" stroke="#C7D2FE" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="50" cy="50" rx="30" ry="9" fill="none" stroke="#38BDF8" strokeWidth="4" transform="rotate(-20 50 50)" />
        </svg>
      );
    case 'theme_volcano':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <rect x="12" y="14" width="76" height="72" rx="18" fill="#FFF7ED" stroke="#EA580C" strokeWidth="4" />
          <circle cx="70" cy="30" r="8" fill="#FBBF24" />
          <polygon points="20,76 42,36 58,36 80,76" fill="#9A3412" stroke="#7C2D12" strokeWidth="3" strokeLinejoin="round" />
          <path d="M42,36 L46,50 L50,44 L54,52 L58,36 Z" fill="#F97316" />
          <circle cx="46" cy="26" r="4" fill="#EF4444" />
          <circle cx="54" cy="22" r="3" fill="#F97316" />
        </svg>
      );
    case 'theme_forest':
      return (
        <svg width={sz} height={sz} viewBox="0 0 100 100" className={cls}>
          <rect x="12" y="14" width="76" height="72" rx="18" fill="#ECFDF5" stroke="#059669" strokeWidth="4" />
          <rect x="22" y="68" width="56" height="8" rx="3" fill="#047857" />
          <polygon points="22,38 50,22 78,38" fill="#10B981" stroke="#047857" strokeWidth="3" strokeLinejoin="round" />
          <rect x="26" y="38" width="48" height="6" rx="2" fill="#34D399" />
          <rect x="30" y="44" width="8" height="24" rx="2" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
          <rect x="46" y="44" width="8" height="24" rx="2" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
          <rect x="62" y="44" width="8" height="24" rx="2" fill="#A7F3D0" stroke="#059669" strokeWidth="2.5" />
          <circle cx="50" cy="32" r="4" fill="#FBBF24" />
        </svg>
      );

    // ---- NAVIGATION (clean, simple, uniform outline style — no AI gradients) ----
    case 'home': return <Home {...iconProps} />;
    case 'infinity': return <InfinityIcon {...iconProps} />;
    case 'folder': return <Puzzle {...iconProps} />;
    case 'store': return <Store {...iconProps} />;
    case 'user': return <User {...iconProps} />;

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
    case 'book': return <BookOpen {...iconProps} />;
    case 'mistakes':
    case 'book_x': return <BookX {...iconProps} />;
    case 'teacher': return <GraduationCap {...iconProps} strokeWidth={2.5} />;
    case 'target': return <Target {...iconProps} />;
    
    case 'hash': return <Hash {...iconProps} />;
    case 'arrow_right': return <ArrowRight {...iconProps} />;
    case 'x': return <X {...iconProps} />;
    case 'check': return <Check2 {...iconProps} />;
    case 'mail': return <Mail {...iconProps} />;
    case 'eye': return <Eye {...iconProps} />;
    case 'eye-off': return <EyeOff {...iconProps} />;
    case 'building': return <Building {...iconProps} />;
    case 'phone': return <Phone {...iconProps} />;
    case 'card': return <CreditCard {...iconProps} />;
    case 'rocket': return <Rocket {...iconProps} />;
    case 'users': return <Users {...iconProps} />;
    case 'gift': return <Gift {...iconProps} />;
    case 'plus': return <Plus {...iconProps} />;
    case 'chevron_down': return <ChevronDown {...iconProps} />;
    case 'arrow_up': return <ArrowUp {...iconProps} />;
    case 'arrow_down': return <ArrowDown {...iconProps} />;
    case 'arrow_left': return <ChevronLeft {...iconProps} />;
    case 'refresh_cw': return <RefreshCw {...iconProps} />;
    case 'alert': return <AlertCircle {...iconProps} />;
    case 'key': return <KeyRound {...iconProps} />;
    case 'user_minus': return <UserMinus {...iconProps} />;
    case 'user_check': return <UserCheck {...iconProps} />;
    case 'search': return <Search {...iconProps} />;
    case 'chevron_right': return <ChevronRight {...iconProps} />;
    case 'copy': return <Copy {...iconProps} />;
    case 'settings': return <Settings {...iconProps} />;
    default: return <Sparkles2 {...iconProps} />;
  }
};
