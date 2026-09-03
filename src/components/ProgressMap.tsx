import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Icon } from './CustomIcons';

interface ProgressMapProps {
  progress: number;
  onNodeClick?: (step: number) => void;
  isInfiniteMode?: boolean;
  infiniteTopicName?: string;
  totalStepsOverride?: number;
}

export const ProgressMap: React.FC<ProgressMapProps> = ({ progress, onNodeClick, isInfiniteMode, infiniteTopicName, totalStepsOverride }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalSteps = totalStepsOverride || 100; 
  const nodeSpacing = 110;
  const amplitude = 110;
  const offset = 180; // Need more space for horizontal sine wave
  
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= totalSteps; i++) {
      const y = ((totalSteps - i) * nodeSpacing) + offset;
      
      // More organic and varied meandering path
      const wave1 = Math.sin(i * 0.6) * (amplitude * 0.5);
      const wave2 = Math.sin(i * 1.1) * (amplitude * 0.35);
      const wave3 = Math.cos(i * 1.7) * (amplitude * 0.25);
      
      const x = offset + wave1 + wave2 + wave3;
      
      pts.push({ x, y, step: i });
    }
    return pts;
  }, [nodeSpacing, amplitude, offset]);

  useEffect(() => {
    // Initial scroll on mount without animation
    const timer = setTimeout(() => {
      if (scrollRef.current && points[progress]) {
        const container = scrollRef.current;
        const target = points[progress];
        container.scrollTo({ top: Math.max(0, target.y - container.clientHeight / 2), behavior: 'auto' });
      }
    }, 10);
    return () => clearTimeout(timer);
  }, []); // Only on mount

  useEffect(() => {
    // Smooth scroll when progress changes
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

  const containerStyle: React.CSSProperties = { width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden' };
      
  const svgWidth = offset * 2;
  const svgHeight = (totalSteps * nodeSpacing) + offset * 2;
  
  const generateCurvedPath = (pts: {x: number, y: number}[]) => {
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

  return (
    <div 
      ref={scrollRef} 
      className={`relative no-scrollbar ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`} 
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <div style={{ width: '100%', height: svgHeight, position: 'relative', margin: '0 auto', maxWidth: '360px' }}>
        
        {/* SVG Path */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
          {/* Base path */}
          <path d={pathData} fill="none" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Flowing animated background line */}
          <path d={pathData} fill="none" stroke="#60a5fa" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" className="animate-map-flow opacity-30" />
          
          {/* Completed path */}
          <path d={pastPathData} fill="none" stroke="#22c55e" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Completed flowing animated overlay line */}
          {progress > 0 && (
            <path d={pastPathData} fill="none" stroke="#86efac" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="animate-map-flow-fast" />
          )}

          {progress > 0 && (
            <motion.path 
              key={`segment-${progress}`}
              d={currentSegmentData} 
              fill="none" 
              stroke="#22c55e" 
              strokeWidth="18" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}
        </svg>

        {/* Nodes */}
        {points.map((pt, step) => {
          const isSpecial = (step + 1) % 3 === 0 && (step % 20 !== 0);
          const specialIdx = isSpecial ? Math.floor((step + 1) / 3) : 0;
          
          const isUfo = isSpecial && (specialIdx % 7 === 0);
          const isRace = isSpecial && (specialIdx % 7 === 3);
          const isChest = isSpecial && !isUfo && !isRace;
          
          const isPast = step < progress;
          const isCurrent = step === progress;
          const isFuture = step > progress;

          // Calculate horizontal offset for a curved path
          const yOffset = Math.sin(step * 0.5) * 50; 
          const marginStyle = { marginLeft: `${Math.max(-40, Math.min(40, yOffset))}px` };

          let bgClass = 'bg-white border-slate-200';
          let innerContent = null;
          let nodeSize = 'w-16 h-16';
          let wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px] ${isCurrent ? 'animate-bounce' : ''}`;
          
          if (isPast) {
            bgClass = 'bg-white border-green-500 ring-4 ring-green-100 text-green-500';
            innerContent = <Icon name="star" className="text-green-500" size={28} />;
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px]`;
          } else if (isCurrent) {
            bgClass = 'bg-orange-500 border-orange-600 ring-4 ring-orange-200 text-white';
            innerContent = <Icon name="fire" className="text-white" size={36} />;
            nodeSize = 'w-20 h-20';
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px] ${isCurrent ? 'animate-bounce' : ''}`;
          } else if (isFuture) {
            bgClass = 'bg-slate-200 border-slate-300 text-slate-400';
            innerContent = <Icon name="lock" className="text-slate-400" size={28} />;
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-full shrink-0 transition-all duration-300 relative z-20 ${bgClass} border-b-[6px] shadow-sm cursor-pointer hover:brightness-110 active:border-b-0 active:translate-y-[6px]`;
          }

          const isSectionGate = !isInfiniteMode && step > 0 && step % 20 === 0;
          const isInfiniteMilestone = isInfiniteMode && step > 0 && step % 10 === 0;

          if (isSectionGate || isInfiniteMilestone) {
            bgClass = isPast || isCurrent ? 'bg-blue-500 border-blue-600 text-white shadow-lg' : 'bg-slate-300 border-slate-400 text-slate-500 shadow-inner';
            nodeSize = 'w-28 h-28';
            wrapperClass = `flex flex-col items-center justify-center ${nodeSize} rounded-3xl shrink-0 transition-all duration-300 relative z-30 ${bgClass} border-b-[8px] cursor-pointer hover:scale-105 active:scale-95`;
            
            const topicName = isInfiniteMode ? `Nivel ${step}` : (step === 20 ? 'Criptoaritmética' : step === 40 ? 'Lógica Recreativa' : step === 60 ? 'Cronometría Básica' : step === 80 ? 'Conteo de Figuras' : 'Campeón');
            
            const isFinal = step === 100;
            const finalIcon = isFinal ? 'crown' : (isPast || isCurrent ? "unlock" : "lock");
            if (isFinal) {
              bgClass = isPast || isCurrent ? 'bg-amber-500 border-amber-600 text-white shadow-[0_0_25px_rgba(245,158,11,0.5)]' : 'bg-slate-800 border-slate-900 text-amber-500 shadow-inner';
            }
            
            innerContent = (
              <div className="flex flex-col items-center gap-1">
                <Icon name={finalIcon} size={36} className={isFinal && !isPast && !isCurrent ? 'opacity-80' : ''} />
                <span className={`text-[10px] font-black uppercase text-center leading-tight px-1 ${isFinal ? 'text-amber-100' : ''}`}>{topicName}</span>
              </div>
            );
          } else if (isChest) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-20 h-20';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            const chestIcon = isPast ? "unlock" : "box";
            
            innerContent = (
              <motion.div
                className={`filter drop-shadow-md select-none ${isPast ? 'text-amber-500' : 'text-amber-600'}`}
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
              >
                <Icon name={chestIcon} size={40} />
              </motion.div>
            );
          } else if (isRace) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-32 h-32';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-32 h-32 flex items-center justify-center overflow-visible">
                <div className="absolute w-24 h-24 rounded-full border-4 border-dashed border-emerald-500/30 bg-emerald-50"></div>
                <div className="text-emerald-600 absolute bg-white/90 p-1.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-20">
                  <Icon name="flag" size={16} />
                </div>
                
                <div className="absolute w-full h-full pointer-events-none text-emerald-600">
                  <span className="animate-orbit-1 absolute filter drop-shadow-sm"><Icon name="dog" size={28} /></span>
                  <span className="animate-orbit-2 absolute filter drop-shadow-sm text-purple-600"><Icon name="cat" size={28} /></span>
                  <span className="animate-orbit-3 absolute filter drop-shadow-sm text-orange-500"><Icon name="fox" size={28} /></span>
                  <span className="animate-orbit-4 absolute filter drop-shadow-sm text-blue-500"><Icon name="owl" size={28} /></span>
                </div>
              </div>
            );
          } else if (isUfo) {
            bgClass = 'bg-transparent border-none shadow-none ring-0';
            nodeSize = 'w-24 h-24';
            wrapperClass = 'flex flex-col items-center justify-center shrink-0 transition-all duration-300 relative z-20 cursor-pointer hover:scale-110 active:scale-95';
            
            innerContent = (
              <div className="relative w-24 h-24 flex items-center justify-center overflow-visible">
                <div className="absolute w-12 h-12 rounded-full border-4 border-dashed border-cyan-500/30 bg-cyan-50"></div>
                <div className="absolute w-full h-full pointer-events-none flex items-center justify-center text-cyan-500">
                  <span className="animate-orbit-ufo filter drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)] select-none">
                    <Icon name="ufo" size={48} />
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={step} 
              className={`absolute flex items-center justify-center ${isCurrent ? 'z-40' : 'z-20'}`} 
              style={{ left: `${pt.x}px`, top: `${pt.y}px`, transform: 'translate(-50%, -50%)', pointerEvents: isFuture && !isCurrent ? 'none' : 'auto' }}
            >
              <motion.div 
                layoutId={isCurrent ? "current-node-marker" : undefined}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-[-50px] bg-white text-slate-800 font-bold px-4 py-2 rounded-xl shadow-md border-2 border-slate-200 animate-pulse whitespace-nowrap z-50 uppercase tracking-widest text-xs flex flex-col items-center pointer-events-none"
                >
                  ABRIR
                  <div className="absolute -bottom-2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white"></div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

