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
  { id: 'owl', name: 'Búho', title: 'Maestro del Códice' },
  { id: 'robot', name: 'Bot-9000', title: 'Inversor Algorítmico' },
  { id: 'astronaut', name: 'Astro', title: 'Explorador Galáctico' },
  { id: 'cat', name: 'Gato', title: 'Empresario Felino' },
  { id: 'dog', name: 'Perro', title: 'Emprendedor Fiel' },
  { id: 'dragon', name: 'Dragón', title: 'Protector del Tesoro' }
];

interface AvatarProps {
  name: string;
  className?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, className = '', size = 48 }) => {
  const avatarId = name.toLowerCase().trim();
  const style = { width: size, height: size };

  // Single-stroke minimalist style with color inside
  switch (avatarId) {
    case 'fox':
    case '🦊':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#ffedd5" />
          <path d="M25 45 L20 20 L40 35 L50 35 L60 35 L80 20 L75 45 L85 60 C85 80, 70 85, 50 85 C30 85, 15 80, 15 60 Z" fill="#ffffff" stroke="#ea580c" strokeWidth="6" strokeLinejoin="round" />
          <path d="M25 45 L50 65 L75 45" fill="none" stroke="#ea580c" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="35" cy="52" r="4" fill="#ea580c" />
          <circle cx="65" cy="52" r="4" fill="#ea580c" />
          <circle cx="50" cy="72" r="5" fill="#ea580c" />
        </svg>
      );

    case 'lion':
    case '🦁':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#fef3c7" />
          <path d="M25 25 L40 15 L50 15 L60 15 L75 25 L85 45 L80 75 L65 85 L35 85 L20 75 L15 45 Z" fill="#ffffff" stroke="#d97706" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="50" cy="55" r="20" fill="#fef3c7" stroke="#d97706" strokeWidth="6" />
          <circle cx="40" cy="50" r="4" fill="#d97706" />
          <circle cx="60" cy="50" r="4" fill="#d97706" />
          <path d="M45 60 L50 65 L55 60" fill="none" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'panda':
    case '🐼':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#d1fae5" />
          <circle cx="28" cy="30" r="12" fill="#059669" stroke="#059669" strokeWidth="4" />
          <circle cx="72" cy="30" r="12" fill="#059669" stroke="#059669" strokeWidth="4" />
          <path d="M20 55 C20 30, 80 30, 80 55 C80 80, 65 85, 50 85 C35 85, 20 80, 20 55 Z" fill="#ffffff" stroke="#059669" strokeWidth="6" strokeLinejoin="round" />
          <ellipse cx="36" cy="52" rx="7" ry="10" fill="#059669" transform="rotate(-15 36 52)" />
          <ellipse cx="64" cy="52" rx="7" ry="10" fill="#059669" transform="rotate(15 64 52)" />
          <circle cx="36" cy="49" r="2" fill="#ffffff" />
          <circle cx="64" cy="49" r="2" fill="#ffffff" />
          <ellipse cx="50" cy="68" rx="6" ry="4" fill="#059669" />
          <path d="M44 75 C50 78, 56 75, 56 75" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'koala':
    case '🐨':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#cffafe" />
          <circle cx="20" cy="45" r="15" fill="#ffffff" stroke="#0891b2" strokeWidth="6" />
          <circle cx="80" cy="45" r="15" fill="#ffffff" stroke="#0891b2" strokeWidth="6" />
          <path d="M25 55 C25 30, 75 30, 75 55 C75 80, 65 85, 50 85 C35 85, 25 80, 25 55 Z" fill="#ffffff" stroke="#0891b2" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="36" cy="50" r="4" fill="#0891b2" />
          <circle cx="64" cy="50" r="4" fill="#0891b2" />
          <ellipse cx="50" cy="65" rx="8" ry="12" fill="#0891b2" />
        </svg>
      );

    case 'owl':
    case '🦉':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#e0e7ff" />
          <path d="M20 50 C20 20, 80 20, 80 50 L80 60 C80 85, 70 90, 50 90 C30 90, 20 85, 20 60 Z" fill="#ffffff" stroke="#4f46e5" strokeWidth="6" strokeLinejoin="round" />
          <path d="M20 35 L40 25 M80 35 L60 25" fill="none" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" />
          <circle cx="35" cy="50" r="12" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="6" />
          <circle cx="65" cy="50" r="12" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="6" />
          <circle cx="35" cy="50" r="4" fill="#4f46e5" />
          <circle cx="65" cy="50" r="4" fill="#4f46e5" />
          <polygon points="45,65 55,65 50,75" fill="#4f46e5" />
        </svg>
      );

    case 'robot':
    case '🤖':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#dbeafe" />
          <path d="M20 30 L80 30 L80 80 L20 80 Z" fill="#ffffff" stroke="#2563eb" strokeWidth="6" strokeLinejoin="round" />
          <line x1="50" y1="30" x2="50" y2="15" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
          <circle cx="50" cy="15" r="4" fill="#2563eb" />
          <path d="M10 45 L20 45 M90 45 L80 45" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" />
          <rect x="30" y="45" width="40" height="20" fill="#dbeafe" stroke="#2563eb" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="40" cy="55" r="4" fill="#2563eb" />
          <circle cx="60" cy="55" r="4" fill="#2563eb" />
        </svg>
      );

    case 'astronaut':
    case '🚀':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#f3e8ff" />
          <path d="M25 90 C25 60, 75 60, 75 90 Z" fill="#ffffff" stroke="#9333ea" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="30" fill="#ffffff" stroke="#9333ea" strokeWidth="6" />
          <rect x="30" y="35" width="40" height="25" rx="10" fill="#f3e8ff" stroke="#9333ea" strokeWidth="6" />
          <circle cx="40" cy="47" r="3" fill="#9333ea" />
          <circle cx="60" cy="47" r="3" fill="#9333ea" />
        </svg>
      );

    case 'cat':
    case '🐱':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#fce7f3" />
          <path d="M20 20 L35 35 L65 35 L80 20 L80 50 C80 80, 65 85, 50 85 C35 85, 20 80, 20 50 Z" fill="#ffffff" stroke="#db2777" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="36" cy="52" r="5" fill="#db2777" />
          <circle cx="64" cy="52" r="5" fill="#db2777" />
          <polygon points="46,65 54,65 50,72" fill="#db2777" />
          <path d="M10 55 L30 60 M10 65 L30 63" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />
          <path d="M90 55 L70 60 M90 65 L70 63" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'dog':
    case '🐶':
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#e0f2fe" />
          <path d="M25 35 C15 35, 10 70, 25 70" fill="#ffffff" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M75 35 C85 35, 90 70, 75 70" fill="#ffffff" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 45 C25 25, 75 25, 75 45 C75 80, 65 85, 50 85 C35 85, 25 80, 25 45 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="6" strokeLinejoin="round" />
          <circle cx="36" cy="48" r="5" fill="#0284c7" />
          <circle cx="64" cy="48" r="5" fill="#0284c7" />
          <ellipse cx="50" cy="65" rx="10" ry="7" fill="#0284c7" />
          <path d="M45 72 C50 80, 55 72, 55 72 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );

    case 'dragon':
    case '🐉':
    default:
      return (
        <svg viewBox="0 0 100 100" style={style} className={`rounded-full shrink-0 ${className}`}>
          <circle cx="50" cy="50" r="50" fill="#ffe4e6" />
          <path d="M30 15 L35 30 L65 30 L70 15 L80 40 C80 80, 70 85, 50 85 C30 85, 20 80, 20 40 Z" fill="#ffffff" stroke="#e11d48" strokeWidth="6" strokeLinejoin="round" />
          <path d="M20 50 L10 40 M80 50 L90 40" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" />
          <circle cx="36" cy="45" r="4" fill="#e11d48" />
          <circle cx="64" cy="45" r="4" fill="#e11d48" />
          <path d="M45 65 L50 70 L55 65" fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};
