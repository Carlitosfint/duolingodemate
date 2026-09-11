import React from 'react';

export interface AvatarOption {
  id: string;
  name: string;
  title: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'fox', name: 'Zorro', title: 'Inversionista Astuto' },
  { id: 'lion', name: 'León', title: 'Líder Financiero' },
  { id: 'panda', name: 'Panda', title: 'Guardián del Ahorro' },
  { id: 'koala', name: 'Koala', title: 'Estratega Sabio' },
  { id: 'bear', name: 'Oso', title: 'Fuerza de Mercado' },
  { id: 'tiger', name: 'Tigre', title: 'Cazador de Ofertas' },
  { id: 'owl', name: 'Búho', title: 'Maestro del Códice' },
  { id: 'robot', name: 'Bot-9000', title: 'Inversor Algorítmico' },
  { id: 'astronaut', name: 'Astro', title: 'Explorador Galáctico' },
  { id: 'cat', name: 'Gato', title: 'Empresario Felino' },
  { id: 'dog', name: 'Perro', title: 'Emprendedor Fiel' },
  { id: 'dragon', name: 'Dragón', title: 'Protector del Tesoro' }
];

const AVATAR_EMOJIS: Record<string, string> = {
  fox: '🦊', lion: '🦁', panda: '🐼', tiger: '🐯', bear: '🐻', 
  koala: '🐨', owl: '🦉', cat: '🐱', dog: '🐶', dragon: '🐉',
  robot: '🤖', astronaut: '🚀'
};

const AVATAR_COLORS: Record<string, { from: string, to: string, border: string, shadow: string }> = {
  fox: { from: '#fed7aa', to: '#ea580c', border: '#fdba74', shadow: 'rgba(234, 88, 12, 0.4)' },
  lion: { from: '#fef08a', to: '#ca8a04', border: '#fde047', shadow: 'rgba(202, 138, 4, 0.4)' },
  panda: { from: '#e2e8f0', to: '#475569', border: '#cbd5e1', shadow: 'rgba(71, 85, 105, 0.4)' },
  tiger: { from: '#fde68a', to: '#b45309', border: '#fcd34d', shadow: 'rgba(180, 83, 9, 0.4)' },
  bear: { from: '#fecaca', to: '#b91c1c', border: '#fca5a5', shadow: 'rgba(185, 28, 28, 0.4)' },
  koala: { from: '#a7f3d0', to: '#059669', border: '#6ee7b7', shadow: 'rgba(5, 150, 105, 0.4)' },
  owl: { from: '#c7d2fe', to: '#4f46e5', border: '#a5b4fc', shadow: 'rgba(79, 70, 229, 0.4)' },
  cat: { from: '#fbcfe8', to: '#db2777', border: '#f472b6', shadow: 'rgba(219, 39, 119, 0.4)' },
  dog: { from: '#bae6fd', to: '#0284c7', border: '#7dd3fc', shadow: 'rgba(2, 132, 199, 0.4)' },
  dragon: { from: '#fecdd3', to: '#e11d48', border: '#fda4af', shadow: 'rgba(225, 29, 72, 0.4)' },
  robot: { from: '#e2e8f0', to: '#64748b', border: '#cbd5e1', shadow: 'rgba(100, 116, 139, 0.4)' },
  astronaut: { from: '#e9d5ff', to: '#9333ea', border: '#d8b4fe', shadow: 'rgba(147, 51, 234, 0.4)' },
};

interface AvatarProps {
  name: string;
  className?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, className = '', size = 48 }) => {
  const avatarId = name.toLowerCase().trim();
  const emoji = AVATAR_EMOJIS[avatarId] || '✨';
  const colors = AVATAR_COLORS[avatarId] || { from: '#f3e8ff', to: '#a855f7', border: '#e9d5ff', shadow: 'rgba(168, 85, 247, 0.4)' };

  // Calculate emoji size relative to the container size
  const fontSize = size * 0.55;

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${colors.from}, ${colors.to})`,
        boxShadow: `inset 0 4px 6px rgba(255,255,255,0.4), inset 0 -4px 6px rgba(0,0,0,0.1), 0 8px 16px ${colors.shadow}, 0 2px 4px rgba(0,0,0,0.1)`,
        border: `2px solid ${colors.border}`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glossy overlay reflection */}
      <div 
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)',
        }}
      />
      
      {/* Emoji wrapped with a subtle drop shadow to pop from the background */}
      <span 
        className="relative z-10 select-none"
        style={{ 
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))',
          transform: 'translateY(5%)' // slight optical adjustment
        }}
      >
        {emoji}
      </span>
    </div>
  );
};
