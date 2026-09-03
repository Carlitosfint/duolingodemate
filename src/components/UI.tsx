import { Icon } from './CustomIcons';
import React from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/audio';

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'slate' | 'purple' | 'orange';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  className = "", 
  color = "blue", 
  disabled = false, 
  type = "button", 
  title 
}) => {
  const baseClass = "px-6 py-3 rounded-[1.5rem] font-black transition-all flex justify-center items-center gap-2 relative z-10 select-none transform indestructible-btn border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px]";
  const cursorClass = disabled 
    ? "cursor-not-allowed opacity-50" 
    : "cursor-pointer shadow-sm";
  
  const colorClasses = {
    blue: "bg-blue-500 border-blue-600 text-white hover:bg-blue-400", 
    green: "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-400",
    red: "bg-rose-500 border-rose-600 text-white hover:bg-rose-400",
    yellow: "bg-yellow-400 border-yellow-500 text-yellow-900 hover:bg-yellow-300",
    slate: "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-100",
    purple: "bg-purple-500 border-purple-600 text-white hover:bg-purple-400",
    orange: "bg-orange-500 border-orange-600 text-white hover:bg-orange-400",
  };

  return (
    <button 
      type={type} 
      title={title} 
      onClick={(e) => { 
        if (!disabled) { 
          playClickSound(); 
          if (onClick) onClick(e); 
        } 
      }} 
      disabled={disabled} 
      className={`${baseClass} ${colorClasses[color]} ${className} ${cursorClass}`}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white/90 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] p-6 md:p-10 border-[4px] md:border-[6px] border-white/80 relative overflow-hidden flex flex-col items-center text-center ${className}`}>
    {children}
  </div>
);

interface BentoTileProps {
  children: React.ReactNode;
  gridClasses?: string;
  className?: string;
  emojis?: string[];
  bgEmoji?: string;
  bgEmojiRotation?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  particleType?: string;
  title?: string;
}

export const BentoTile: React.FC<BentoTileProps> = ({ 
  children, 
  gridClasses = "", 
  className = "", 
  emojis = [], 
  bgEmoji, 
  bgEmojiRotation = "-rotate-12", 
  onClick, 
  particleType = "default", 
  title 
}) => {
  const particles = React.useMemo(() => {
    if (!emojis || emojis.length === 0) return [];
    const numParticles = (particleType === 'ticket' || particleType === 'stars') ? 10 : (particleType === 'default' ? 8 : 6);
    return Array.from({ length: numParticles }).map((_, i) => {
      let left = '0%', top = '0%', bottom = 'auto', pClass = '', durationBase = '';
      if (particleType === 'ticket') { 
        left = `${Math.random() * 80}%`; top = `-20%`; pClass = 'particle-custom particle-ticket'; durationBase = `${2 + Math.random() * 3}s`; 
      } else if (particleType === 'fire') { 
        left = `${10 + Math.random() * 80}%`; bottom = `-10%`; top = 'auto'; pClass = 'particle-custom particle-fire'; durationBase = `${1.5 + Math.random() * 2}s`; 
      } else if (particleType === 'stars') { 
        left = `${5 + Math.random() * 85}%`; top = `${5 + Math.random() * 85}%`; pClass = 'particle-custom particle-stars'; durationBase = `${1.5 + Math.random() * 2.5}s`; 
      } else if (particleType === 'check') { 
        left = `${10 + Math.random() * 80}%`; bottom = `-10%`; top = 'auto'; pClass = 'particle-custom particle-check'; durationBase = `${2 + Math.random() * 2}s`; 
      } else if (particleType === 'cross') { 
        left = `${10 + Math.random() * 80}%`; top = `-10%`; pClass = 'particle-custom particle-cross'; durationBase = `${2 + Math.random() * 2.5}s`; 
      } else if (particleType === 'time') { 
        left = `${20 + Math.random() * 60}%`; top = `10%`; pClass = 'particle-custom particle-time'; durationBase = `${1.5 + Math.random() * 1.5}s`; 
      } else if (particleType === 'speed') { 
        left = `-20%`; top = `${10 + Math.random() * 80}%`; pClass = 'particle-custom particle-speed'; durationBase = `${1 + Math.random() * 1.5}s`; 
      } else { 
        left = `${5 + Math.random() * 85}%`; top = `${5 + Math.random() * 85}%`; pClass = `particle-base`; durationBase = `${8 + Math.random() * 6}s`; 
      }
      return { 
        id: `p-${i}`, 
        emoji: emojis[i % emojis.length], 
        left, 
        top, 
        bottom, 
        delay: `-${Math.random() * 5}s`, 
        durationBase, 
        size: `${1 + Math.random() * 1.2}rem`, 
        pClass 
      };
    });
  }, [emojis, particleType]);

  const innerContent = (
    <React.Fragment>
      <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${particleType === 'default' ? 'bg-gradient-to-br from-transparent to-black/5' : ''}`}>
        {particles.map(p => (
          <div 
            key={p.id} 
            className={`${p.pClass} drop-shadow-sm`} 
            style={{ 
              left: p.left, 
              top: p.top !== 'auto' ? p.top : undefined, 
              bottom: p.bottom !== 'auto' ? p.bottom : undefined, 
              animationDelay: p.delay, 
              animationDuration: p.durationBase,
              fontSize: p.size 
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>
      {bgEmoji && (
        <div className={`absolute right-0 bottom-0 translate-x-[25%] translate-y-[25%] text-[5.5rem] sm:text-[7.5rem] md:text-[8rem] lg:text-[10rem] leading-none pointer-events-none drop-shadow-xl select-none z-10 opacity-100 transition-transform duration-500 group-hover:scale-110 ${bgEmojiRotation}`}>
          {bgEmoji}
        </div>
      )}
      <div className="relative z-20 w-full p-2 sm:p-3 md:p-5 flex flex-col justify-center text-center">{children}</div>
    </React.Fragment>
  );

  if (onClick) {
    return (
      <motion.button 
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.96, y: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={onClick} 
        title={title} 
        className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] active:border-b-2 active:translate-y-[2px] md:active:border-b-[3px] md:active:translate-y-[3px] shadow-sm group cursor-pointer text-left w-full block ${gridClasses} ${className}`}
      >
        {innerContent}
      </motion.button>
    );
  }

  return (
    <motion.div 
      title={title} 
      className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] shadow-sm group ${gridClasses} ${className}`}
    >
      {innerContent}
    </motion.div>
  );
};

export const FloatingMathBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.15] font-math text-slate-400" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', opacity: 0.15, pointerEvents: 'none' }}>
    <div className="absolute animate-float" style={{position: 'absolute', top: '10%', left: '5%', fontSize: '3rem', animationDelay: '0s'}}>%</div>
    <div className="absolute animate-float" style={{position: 'absolute', top: '30%', right: '10%', fontSize: '2.25rem', animationDelay: '1s'}}>I=Crt</div>
    <div className="absolute animate-float" style={{position: 'absolute', bottom: '20%', left: '15%', fontSize: '3rem', animationDelay: '2s'}}>Δ%</div>
    <div className="absolute animate-float" style={{position: 'absolute', bottom: '40%', right: '20%', fontSize: '3.75rem', animationDelay: '0.5s'}}>(1+r)ⁿ</div>
    <div className="absolute animate-float" style={{position: 'absolute', top: '60%', left: '40%', fontSize: '2.25rem', animationDelay: '1.5s'}}>$</div>
    <div className="absolute animate-float" style={{position: 'absolute', top: '80%', left: '70%', fontSize: '3rem', animationDelay: '0.8s'}}><Icon name="trending_up" className="inline-block" size={18} /></div>
  </div>
);
