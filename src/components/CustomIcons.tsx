import React from 'react';
import { Hash, Sparkles as Sparkles2, Check as Check2, 
  Coins, Ticket, Diamond, Crown, Wallet, Box, TrendingUp, TrendingDown,
  Sparkles, Cat, Rabbit, Bird, Dog, Target, BookOpen, FolderOpen, 
  Store, User, GraduationCap, Flame, ArrowRight, X, Play, Volume2, Shield, 
  Lock, Unlock, Package, Flag, Ghost, Orbit, Building, Gift, Settings, Star, 
  ChevronLeft, Check, AlertCircle, Zap, ShieldAlert, BadgeCent,
  Trophy, Banknote, Landmark, ShieldCheck, Map as MapIcon, BookX
} from 'lucide-react';

export const Icon = ({ name, className, size = 24 }: { name: string, className?: string, size?: number }) => {
  const iconProps = { className, size, strokeWidth: 2.5 };
  const coloredProps = { ...iconProps, fill: 'currentColor', fillOpacity: 0.2 };
  
  switch(name) {
    // Currencies & Rewards (Colorful)
    case 'coins': return <Coins {...coloredProps} />;
    case 'ticket': return <Ticket {...coloredProps} />;
    case 'money_bag': return <Wallet {...coloredProps} />;
    case 'coupon': return <BadgeCent {...coloredProps} />;
    case 'diamond': return <Diamond {...coloredProps} />;
    case 'crown': return <Crown {...coloredProps} />;
    
    // Albums (Colorful)
    case 'cash': return <Banknote {...coloredProps} />;
    case 'safe': return <Lock {...coloredProps} />;
    case 'gold_bar': return <Box {...coloredProps} />;
    case 'trending_up': return <TrendingUp {...coloredProps} />;
    case 'trending_down': return <TrendingDown {...coloredProps} />;
    
    // Buffs & Pets (Colorful)
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
    case 'zap': return <Zap {...coloredProps} />;
    case 'shield': return <ShieldCheck {...coloredProps} />;
    
    // Progress Map
    case 'star': return <Star {...coloredProps} />;
    case 'fire': return <Flame {...coloredProps} />;
    case 'lock': return <Lock {...iconProps} />;
    case 'unlock': return <Unlock {...iconProps} />;
    case 'box': return <Package {...iconProps} />;
    case 'flag': return <Flag {...iconProps} />;
    case 'ufo': return <Orbit {...iconProps} />;
    case 'sprout': return <Sparkles {...iconProps} />;
    
    // Navigation (Clean lines)
    case 'home': return <MapIcon {...iconProps} />;
    case 'book': return <BookOpen {...iconProps} />;
    case 'mistakes':
    case 'book_x': return <BookX {...iconProps} />;
    case 'folder': return <FolderOpen {...iconProps} />;
    case 'store': return <Store {...iconProps} />;
    case 'user': return <User {...iconProps} />;
    case 'teacher': return <GraduationCap {...iconProps} strokeWidth={2.5} />;
    
    
    case 'hash': return <Hash {...iconProps} />;
    case 'arrow_right': return <ArrowRight {...iconProps} />;
    case 'x': return <X {...iconProps} />;
    case 'check': return <Check2 {...iconProps} />;
    default: return <Star {...iconProps} />;
  }
};
