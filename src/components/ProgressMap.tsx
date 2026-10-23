import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Icon } from './CustomIcons';

interface ProgressMapProps {
  progress: number;
  onNodeClick?: (step: number) => void;
  isInfiniteMode?: boolean;
  infiniteTopicName?: string;
  totalStepsOverride?: number;
  activeCourse?: string;
}

const COURSE_GATES: Record<string, Record<number, string>> = {
  razonamiento: {
    20: 'Criptoaritmética',
    40: 'Cronometría',
    50: 'IV Bimestre: Sucesiones',
    60: 'Series y Sumas',
    80: 'Operadores y %',
    100: 'Gran Maestría'
  },
  razonamiento_5to: {
    20: 'Lógica Inferencial',
    40: 'Mate. Financiera',
    50: 'IV Bimestre: Combinatoria',
    60: 'Probabilidades',
    80: 'Máximos y Mínimos',
    100: 'Gran Maestría'
  },
  trigonometria: {
    20: 'Res. Triángulos',
    40: 'Geo. Analítica',
    50: 'IV Bimestre: Reducción',
    60: 'Circunf. Trig.',
    80: 'Áng. Compuestos',
    100: 'Gran Maestría'
  },
  geometria_5to: {
    20: 'Áreas Planas',
    40: 'Geo. del Espacio',
    50: 'IV Bimestre: Prismas',
    60: 'Pirámide y Cono',
    80: 'Esfera y Recta',
    100: 'Gran Maestría'
  }
};

// Large flat vector world/planet props (ZERO gradients, ZERO blurry drop-shadows)
const WorldProp: React.FC<{ type: string; scale?: number }> = ({ type, scale = 1 }) => {
  const size = Math.round(92 * scale);
  switch (type) {
    case 'planet_ring':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="24" cy="24" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
          <circle cx="98" cy="90" r="5" fill="#38BDF8" />
          <ellipse cx="60" cy="60" rx="52" ry="16" fill="none" stroke="#F59E0B" strokeWidth="8" transform="rotate(-22 60 60)" />
          <circle cx="60" cy="60" r="30" fill="#6366F1" stroke="#312E81" strokeWidth="4" />
          <path d="M34,52 C46,44 74,44 86,52" fill="none" stroke="#818CF8" strokeWidth="6" strokeLinecap="round" />
          <path d="M38,70 C50,64 70,64 82,70" fill="none" stroke="#4F46E5" strokeWidth="6" strokeLinecap="round" />
          <path d="M12,68 A52,16 0 0,0 108,52" fill="none" stroke="#FBBF24" strokeWidth="6" transform="rotate(-22 60 60)" />
        </svg>
      );
    case 'rocket':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Launchpad base */}
          <ellipse cx="60" cy="104" rx="38" ry="8" fill="#CBD5E1" stroke="#475569" strokeWidth="3.5" />
          {/* Exhaust flat flame */}
          <polygon points="48,84 60,104 72,84" fill="#F97316" />
          <polygon points="52,84 60,96 68,84" fill="#FDE047" />
          {/* Fins */}
          <polygon points="40,62 24,84 44,80" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="80,62 96,84 76,80" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Body */}
          <path d="M42,80 L42,44 C42,26 60,14 60,14 C60,14 78,26 78,44 L78,80 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
          <path d="M47,30 C52,20 60,14 60,14 C60,14 68,20 73,30 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="3.5" />
          {/* Window */}
          <circle cx="60" cy="50" r="10" fill="#38BDF8" stroke="#1E293B" strokeWidth="4" />
          <circle cx="57" cy="47" r="3" fill="#E0F2FE" />
        </svg>
      );
    case 'crystals':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <ellipse cx="60" cy="98" rx="42" ry="10" fill="#A7F3D0" stroke="#059669" strokeWidth="3.5" />
          {/* Left crystal */}
          <polygon points="34,94 22,52 34,34 46,50 46,94" fill="#06B6D4" stroke="#0E7490" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Right crystal */}
          <polygon points="74,94 74,54 88,40 98,58 86,94" fill="#8B5CF6" stroke="#5B21B6" strokeWidth="3.5" strokeLinejoin="round" />
          {/* Center tall crystal */}
          <polygon points="46,96 42,38 60,16 78,38 74,96" fill="#10B981" stroke="#065F46" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="46,96 42,38 60,16 60,96" fill="#34D399" />
          <circle cx="24" cy="28" r="4" fill="#FBBF24" />
          <circle cx="94" cy="24" r="5" fill="#FBBF24" />
        </svg>
      );
    case 'observatory':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <ellipse cx="60" cy="98" rx="44" ry="10" fill="#DBEAFE" stroke="#2563EB" strokeWidth="3.5" />
          {/* Dome */}
          <path d="M28,66 C28,40 92,40 92,66 Z" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="4" />
          <path d="M46,44 C46,44 60,40 60,66" fill="none" stroke="#1E3A8A" strokeWidth="4" />
          {/* Telescope tube */}
          <rect x="64" y="28" width="28" height="12" rx="4" fill="#FBBF24" stroke="#78350F" strokeWidth="3.5" transform="rotate(-25 78 34)" />
          {/* Base building */}
          <rect x="28" y="66" width="64" height="28" rx="4" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="4" />
          <rect x="50" y="74" width="20" height="20" rx="6" fill="#1E3A8A" />
          <circle cx="24" cy="26" r="5" fill="#FBBF24" />
        </svg>
      );
    case 'island_trees':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Floating island rock */}
          <polygon points="20,70 100,70 84,98 60,108 36,98" fill="#D97706" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="60" cy="70" rx="44" ry="12" fill="#22C55E" stroke="#15803D" strokeWidth="4" />
          {/* Left tree */}
          <rect x="36" y="48" width="8" height="20" fill="#92400E" stroke="#78350F" strokeWidth="3" />
          <circle cx="40" cy="40" r="16" fill="#10B981" stroke="#065F46" strokeWidth="3.5" />
          <circle cx="35" cy="35" r="6" fill="#34D399" />
          {/* Right pine tree */}
          <rect x="72" y="52" width="8" height="16" fill="#92400E" stroke="#78350F" strokeWidth="3" />
          <polygon points="76,18 56,54 96,54" fill="#16A34A" stroke="#14532D" strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="76,18 62,42 90,42" fill="#4ADE80" stroke="#14532D" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case 'pyramid_sun':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="88" cy="28" r="14" fill="#FBBF24" stroke="#B45309" strokeWidth="3.5" />
          <ellipse cx="60" cy="98" rx="46" ry="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="3.5" />
          <polygon points="18,94 60,28 102,94" fill="#F59E0B" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="18,94 60,28 60,94" fill="#FBBF24" stroke="#78350F" strokeWidth="4" strokeLinejoin="round" />
          <line x1="32" y1="72" x2="88" y2="72" stroke="#78350F" strokeWidth="3.5" />
          <line x1="45" y1="50" x2="75" y2="50" stroke="#78350F" strokeWidth="3.5" />
        </svg>
      );
    case 'satellite':
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <g transform="rotate(-18 60 60)">
            <rect x="10" y="46" width="30" height="28" rx="4" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="3.5" />
            <line x1="25" y1="46" x2="25" y2="74" stroke="#93C5FD" strokeWidth="2.5" />
            <rect x="80" y="46" width="30" height="28" rx="4" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="3.5" />
            <line x1="95" y1="46" x2="95" y2="74" stroke="#93C5FD" strokeWidth="2.5" />
            <line x1="40" y1="60" x2="80" y2="60" stroke="#475569" strokeWidth="6" />
            <rect x="46" y="40" width="28" height="40" rx="8" fill="#E2E8F0" stroke="#1E293B" strokeWidth="4" />
            <circle cx="60" cy="60" r="7" fill="#F59E0B" stroke="#78350F" strokeWidth="3" />
            <path d="M50,28 C56,22 64,22 70,28" fill="none" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            <path d="M44,20 C54,12 66,12 76,20" fill="none" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="36" fill="#EC4899" stroke="#831843" strokeWidth="4" />
          <circle cx="48" cy="48" r="8" fill="#F472B6" />
          <circle cx="74" cy="68" r="6" fill="#F472B6" />
          <circle cx="96" cy="28" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="3" />
        </svg>
      );
  }
};

const PROP_TYPES = [
  'island_trees',
  'planet_ring',
  'crystals',
  'rocket',
  'observatory',
  'pyramid_sun',
  'satellite',
  'planet_pink'
];

const BIOME_ZONES = [
  { minStep: 0, maxStep: 19, name: 'Valle de las Operaciones', bimestre: 'III Bimestre • Región 1', bg: '#ECFDF5', border: '#A7F3D0', pillBg: '#10B981', pillBorder: '#047857', dotColor: '#6EE7B7' },
  { minStep: 20, maxStep: 39, name: 'Archipiélago de los Enigmas', bimestre: 'III Bimestre • Región 2', bg: '#EFF6FF', border: '#BFDBFE', pillBg: '#3B82F6', pillBorder: '#1D4ED8', dotColor: '#93C5FD' },
  { minStep: 40, maxStep: 49, name: 'Cumbre del Tercer Bimestre', bimestre: 'III Bimestre • Región 3', bg: '#FEF3C7', border: '#FDE68A', pillBg: '#F59E0B', pillBorder: '#B45309', dotColor: '#FCD34D' },
  { minStep: 50, maxStep: 69, name: 'Planeta Cuántico', bimestre: 'IV Bimestre • Región 4', bg: '#F3E8FF', border: '#E9D5FF', pillBg: '#8B5CF6', pillBorder: '#5B21B6', dotColor: '#C4B5FD' },
  { minStep: 70, maxStep: 89, name: 'Nebulosa de Cristal', bimestre: 'IV Bimestre • Región 5', bg: '#ECFEFF', border: '#A5F3FC', pillBg: '#06B6D4', pillBorder: '#0E7490', dotColor: '#67E8F9' },
  { minStep: 90, maxStep: 100, name: 'Ciudadela de la Gran Maestría', bimestre: 'IV Bimestre • Tramo Final', bg: '#FFF1F2', border: '#FECDD3', pillBg: '#F43F5E', pillBorder: '#BE123C', dotColor: '#FDA4AF' }
];

export const ProgressMap: React.FC<ProgressMapProps> = ({
  progress,
  onNodeClick,
  isInfiniteMode,
  infiniteTopicName,
  totalStepsOverride,
  activeCourse = 'razonamiento'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = totalStepsOverride || 100;
  const nodeSpacing = 112;
  const amplitude = 105;
  const centerX = 270; // 540px wide world stage
  const topBottomPad = 180;

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const points = useMemo(() => {
    const pts: { x: number; y: number; step: number; offsetX: number }[] = [];
    for (let i = 0; i <= totalSteps; i++) {
      const y = ((totalSteps - i) * nodeSpacing) + topBottomPad;
      const wave1 = Math.sin(i * 0.6) * (amplitude * 0.55);
      const wave2 = Math.sin(i * 1.1) * (amplitude * 0.3);
      const wave3 = Math.cos(i * 1.7) * (amplitude * 0.15);
      const offsetX = wave1 + wave2 + wave3;
      const x = centerX + offsetX;
      pts.push({ x, y, step: i, offsetX });
    }
    return pts;
  }, [totalSteps, nodeSpacing, amplitude, centerX, topBottomPad]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current && points[progress]) {
        const container = scrollRef.current;
        const target = points[progress];
        container.scrollTo({ top: Math.max(0, target.y - container.clientHeight / 2), behavior: 'auto' });
      }
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollRef.current && points[progress]) {
        const container = scrollRef.current;
        const target = points[progress];
        container.scrollTo({ top: Math.max(0, target.y - container.clientHeight / 2), behavior: 'smooth' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [progress, points]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };
  const handleMouseLeave = () => { setIsDragging(false); };
  const handleMouseUp = () => { setIsDragging(false); };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartY(e.touches[0].pageY - scrollRef.current.offsetTop);
    setScrollTop(scrollRef.current.scrollTop);
  };
  const handleTouchEnd = () => { setIsDragging(false); };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const y = e.touches[0].pageY - scrollRef.current.offsetTop;
    const walk = (y - startY) * 1.5;
    scrollRef.current.scrollTop = scrollTop - walk;
  };

  const stageWidth = centerX * 2; // 540px
  const svgHeight = (totalSteps * nodeSpacing) + topBottomPad * 2;

  const generateCurvedPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const cp1y = current.y - nodeSpacing / 2;
      const cp2y = next.y + nodeSpacing / 2;
      d += ` C ${current.x},${cp1y} ${next.x},${cp2y} ${next.x},${next.y}`;
    }
    return d;
  };

  const pathData = generateCurvedPath(points);
  const pastPathData = generateCurvedPath(points.slice(0, Math.max(1, progress + 1)));
  const currentSegmentData = progress > 0 && progress <= totalSteps ? generateCurvedPath(points.slice(progress - 1, progress + 1)) : '';

  const courseGateMap = COURSE_GATES[activeCourse] || COURSE_GATES.razonamiento;

  return (
    <div
      ref={scrollRef}
      className={`relative no-scrollbar w-full h-full overflow-y-auto overflow-x-hidden bg-slate-50 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Full-width colorful biome background bands */}
      <div style={{ width: '100%', height: svgHeight, position: 'relative', overflow: 'hidden' }}>
        {BIOME_ZONES.map((zone, idx) => {
          const clampedMax = Math.min(totalSteps, zone.maxStep);
          if (zone.minStep > totalSteps) return null;
          const topY = ((totalSteps - clampedMax) * nodeSpacing);
          const bottomY = zone.minStep === 0 ? svgHeight : ((totalSteps - zone.minStep) * nodeSpacing) + topBottomPad;
          const bandHeight = Math.max(200, bottomY - topY);

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: topY,
                left: 0,
                right: 0,
                height: bandHeight,
                backgroundColor: zone.bg,
                borderBottom: `4px dashed ${zone.border}`,
                zIndex: 1
              }}
            >
              {/* Flat decorative terrain patches & stars inside each biome */}
              <div
                style={{ backgroundColor: zone.dotColor }}
                className="w-24 h-8 rounded-full opacity-35 absolute left-[6%] top-[18%]"
              />
              <div
                style={{ backgroundColor: zone.dotColor }}
                className="w-32 h-10 rounded-full opacity-30 absolute right-[8%] top-[42%]"
              />
              <div
                style={{ backgroundColor: zone.dotColor }}
                className="w-20 h-7 rounded-full opacity-35 absolute left-[12%] bottom-[22%]"
              />
              <div
                style={{ backgroundColor: zone.dotColor }}
                className="w-28 h-9 rounded-full opacity-30 absolute right-[10%] bottom-[12%]"
              />
            </div>
          );
        })}

        {/* Centered 540px Planet Stage */}
        <div
          style={{
            width: `${stageWidth}px`,
            height: svgHeight,
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        >
          {/* SVG Meandering Road */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
            {/* Road casing (flat 3D border) */}
            <path d={pathData} fill="none" stroke="#94A3B8" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
            {/* Road inner track */}
            <path d={pathData} fill="none" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            {/* Road center dashes */}
            <path d={pathData} fill="none" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="10 14" strokeLinecap="round" strokeLinejoin="round" />

            {/* Completed road casing */}
            <path d={pastPathData} fill="none" stroke="#15803D" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
            {/* Completed road inner */}
            <path d={pastPathData} fill="none" stroke="#22C55E" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            {progress > 0 && (
              <path d={pastPathData} fill="none" stroke="#86EFAC" strokeWidth="6" strokeDasharray="10 14" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {progress > 0 && (
              <motion.path
                key={`segment-${progress}`}
                d={currentSegmentData}
                fill="none"
                stroke="#22C55E"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </svg>

          {/* Large Duolingo-style Flat World Props along the bends of the path */}
          {points.map((pt, step) => {
            if (step % 2 !== 1 || step === totalSteps) return null;
            // Place prop on the opposite side of the path bend so it never overlaps nodes
            const placeLeft = pt.offsetX >= 0;
            const propX = placeLeft ? Math.max(58, pt.x - 148) : Math.min(stageWidth - 58, pt.x + 148);
            const propType = PROP_TYPES[(step * 3) % PROP_TYPES.length];

            return (
              <div
                key={`prop-${step}`}
                style={{
                  position: 'absolute',
                  left: `${propX}px`,
                  top: `${pt.y}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  zIndex: 8
                }}
              >
                <WorldProp type={propType} scale={step % 4 === 1 ? 1.05 : 0.9} />
              </div>
            );
          })}

          {/* Biome Unit Headers along the map */}
          {!isInfiniteMode &&
            BIOME_ZONES.map((zone, idx) => {
              if (zone.minStep > totalSteps) return null;
              const anchorPt = points[zone.minStep];
              if (!anchorPt) return null;
              return (
                <div
                  key={`banner-${idx}`}
                  style={{
                    position: 'absolute',
                    left: `${centerX}px`,
                    top: `${anchorPt.y + 72}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 25,
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: zone.pillBg,
                      borderColor: zone.pillBorder
                    }}
                    className="px-4 py-1.5 rounded-2xl border-2 border-b-4 text-white flex flex-col items-center whitespace-nowrap"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-90">{zone.bimestre}</span>
                    <span className="text-xs font-black tracking-tight">{zone.name}</span>
                  </div>
                </div>
              );
            })}

          {/* Interactive Map Nodes */}
          {points.map((pt, step) => {
            const isSpecial = (step + 1) % 3 === 0 && (step % 20 !== 0) && (step !== 50);
            const specialIdx = isSpecial ? Math.floor((step + 1) / 3) : 0;

            const isUfo = isSpecial && (specialIdx % 7 === 0);
            const isRace = isSpecial && (specialIdx % 7 === 3);
            const isChest = isSpecial && !isUfo && !isRace;

            const isPast = step < progress;
            const isCurrent = step === progress;
            const isFuture = step > progress;

            let bgClass = 'bg-white border-slate-300';
            let innerContent: React.ReactNode = null;
            let nodeSize = 'w-16 h-16';
            let wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-transform duration-200 relative z-20 ${bgClass} border-2 border-b-[6px] cursor-pointer hover:scale-105 active:translate-y-[3px]`;

            if (isPast) {
              bgClass = 'bg-emerald-500 border-emerald-700 ring-4 ring-emerald-200 text-white';
              innerContent = <Icon name="star" className="text-white" size={28} />;
              wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-transform duration-200 relative z-20 ${bgClass} border-2 border-b-[6px] cursor-pointer hover:scale-105 active:translate-y-[3px]`;
            } else if (isCurrent) {
              bgClass = 'bg-orange-500 border-orange-700 ring-4 ring-orange-200 text-white';
              innerContent = <Icon name="fire" className="text-white" size={34} />;
              nodeSize = 'w-20 h-20';
              wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-transform duration-200 relative z-30 ${bgClass} border-2 border-b-[6px] cursor-pointer hover:scale-105`;
            } else if (isFuture) {
              bgClass = 'bg-white border-slate-300 text-slate-400';
              innerContent = (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black text-slate-400">{step + 1}</span>
                </div>
              );
              wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-transform duration-200 relative z-20 ${bgClass} border-2 border-b-[6px] cursor-pointer`;
            }

            const isSectionGate = !isInfiniteMode && step > 0 && (step % 20 === 0 || step === 50);
            const isInfiniteMilestone = isInfiniteMode && step > 0 && step % 10 === 0;

            if (isSectionGate || isInfiniteMilestone) {
              const isFinal = step === totalSteps;
              const isBimestre4Gate = !isInfiniteMode && step === 50;

              if (isFinal) {
                bgClass = isPast || isCurrent
                  ? 'bg-amber-400 border-amber-700 text-slate-900 ring-4 ring-amber-200'
                  : 'bg-slate-800 border-slate-950 text-amber-400';
              } else if (isBimestre4Gate) {
                bgClass = isPast || isCurrent
                  ? 'bg-violet-600 border-violet-800 text-white ring-4 ring-violet-200'
                  : 'bg-violet-100 border-violet-300 text-violet-700';
              } else {
                bgClass = isPast || isCurrent
                  ? 'bg-blue-600 border-blue-800 text-white ring-4 ring-blue-200'
                  : 'bg-white border-slate-300 text-slate-600';
              }

              nodeSize = isFinal ? 'w-32 h-28' : 'w-28 h-24';
              wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-3xl shrink-0 transition-transform duration-200 relative z-30 ${bgClass} border-2 border-b-[7px] cursor-pointer hover:scale-105`;

              const gateTitle = isInfiniteMode
                ? (isFinal ? 'Meta Infinita' : `Nivel ${step}`)
                : (courseGateMap[step] || `Hito ${step}`);

              const gateIcon = isFinal
                ? 'mastery_trophy'
                : (isPast || isCurrent ? 'unlock' : 'lock');

              innerContent = (
                <div className="flex flex-col items-center gap-1 px-2">
                  <Icon name={gateIcon} size={isFinal ? 38 : 30} />
                  <span className="text-[10px] font-black uppercase text-center leading-tight">
                    {gateTitle}
                  </span>
                </div>
              );
            } else if (isChest) {
              nodeSize = 'w-16 h-16';
              const chestBg = isPast
                ? 'bg-amber-100 border-amber-400'
                : 'bg-amber-400 border-amber-600';
              wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-2xl shrink-0 transition-transform duration-200 relative z-20 ${chestBg} border-2 border-b-[6px] cursor-pointer hover:scale-110`;
              innerContent = <Icon name={isPast ? 'unlock' : 'box'} size={34} />;
            } else if (isRace) {
              nodeSize = 'w-20 h-20';
              wrapperClass = 'flex flex-col items-center justify-center w-20 h-20 rounded-2xl shrink-0 transition-transform duration-200 relative z-20 bg-emerald-500 border-2 border-b-[6px] border-emerald-700 text-white cursor-pointer hover:scale-110';
              innerContent = (
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <div className="flex items-center gap-1">
                    <Icon name="dog" size={18} />
                    <Icon name="flag" size={16} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider">Carrera</span>
                </div>
              );
            } else if (isUfo) {
              nodeSize = 'w-20 h-20';
              wrapperClass = 'flex flex-col items-center justify-center w-20 h-20 rounded-2xl shrink-0 transition-transform duration-200 relative z-20 bg-purple-600 border-2 border-b-[6px] border-purple-800 text-white cursor-pointer hover:scale-110';
              innerContent = (
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <Icon name="ufo" size={32} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Abducción</span>
                </div>
              );
            }

            return (
              <div
                key={step}
                className={`absolute flex items-center justify-center ${isCurrent ? 'z-40' : 'z-20'}`}
                style={{
                  left: `${pt.x}px`,
                  top: `${pt.y}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: isFuture && !isCurrent ? 'none' : 'auto'
                }}
              >
                <motion.div
                  layoutId={isCurrent ? 'current-node-marker' : undefined}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging && onNodeClick) {
                      onNodeClick(step);
                    }
                  }}
                  className={wrapperClass}
                >
                  {innerContent}
                </motion.div>

                {isCurrent && (
                  <motion.div
                    layoutId="current-abrir-popup"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                    className="absolute top-[-52px] bg-white text-slate-900 font-black px-4 py-1.5 rounded-xl border-2 border-b-4 border-slate-300 whitespace-nowrap z-50 uppercase tracking-widest text-xs flex flex-col items-center pointer-events-none"
                  >
                    {infiniteTopicName ? 'JUGAR' : 'EMPEZAR'}
                    <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-300" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
