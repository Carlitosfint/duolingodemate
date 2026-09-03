import React from 'react';
import { Icon } from './CustomIcons';

export const ProblemVisualizer = ({ data }: { data: any }) => {
  if (!data) return null;

  if (data.type === 'cangrejo') {
    return (
      <div className="my-6 w-full max-w-full overflow-x-auto pb-4">
        <div className="flex items-center gap-2 md:gap-3 text-slate-700 font-bold w-max px-4 lg:mx-auto">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-600 shadow-inner shrink-0 text-xl md:text-2xl">
            ?
          </div>
          
          {data.steps.map((step: any, idx: number) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center justify-center mx-1">
                <div className="text-[10px] md:text-xs text-slate-500 font-black mb-1 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                  {step.op} {step.val}
                </div>
                <Icon name="arrow_right" size={20} className="text-slate-300" />
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <Icon name="box" size={16} />
              </div>
            </React.Fragment>
          ))}
          
          <div className="flex flex-col items-center justify-center mx-1">
            <Icon name="arrow_right" size={20} className="text-slate-300" />
          </div>
          
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-600 font-black shadow-inner shrink-0 text-xl md:text-2xl">
            {data.result}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">Aplica las operaciones inversas (de derecha a izquierda) para hallar el valor inicial.</p>
      </div>
    );
  }

  if (data.type === 'rombo') {
    return (
      <div className="flex flex-col items-center justify-center my-6 relative w-full max-w-[300px] mx-auto">
         {/* Rombo SVG */}
         <svg width="240" height="240" viewBox="0 0 240 240" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 drop-shadow-md">
            <polygon points="120,30 210,120 120,210 30,120" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6,4" />
            
            {/* Direction Arrows */}
            <path d="M 45,110 L 105,45" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <polygon points="105,45 100,55 95,50" fill="#ef4444" />
            
            <path d="M 135,45 L 195,110" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <polygon points="195,110 190,100 185,105" fill="#ef4444" />
            
            <path d="M 210,120 L 210,210" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <polygon points="210,210 200,205 205,195" fill="#ef4444" />
            
         </svg>

         <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-[260px] items-center justify-items-center">
            <div className="col-start-2 row-start-1 flex flex-col items-center">
               <span className="text-[10px] text-slate-500 font-bold mb-1 bg-white/80 px-1 rounded">{data.topLabel}</span>
               <div className="w-14 h-14 rounded-full bg-blue-100 border-4 border-blue-400 flex items-center justify-center text-blue-700 font-black text-xl shadow-sm z-10">
                 {data.top}
               </div>
            </div>
            
            <div className="col-start-1 row-start-2 flex flex-col items-center">
               <span className="text-[10px] text-slate-500 font-bold mb-1 bg-white/80 px-1 rounded text-center leading-tight">{data.leftLabel}</span>
               <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-400 flex items-center justify-center text-emerald-700 font-black text-xl shadow-sm z-10">
                 {data.left}
               </div>
            </div>
            
            <div className="col-start-3 row-start-2 flex flex-col items-center">
               <span className="text-[10px] text-slate-500 font-bold mb-1 bg-white/80 px-1 rounded text-center leading-tight">{data.rightLabel}</span>
               <div className="w-14 h-14 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-amber-700 font-black text-xl shadow-sm z-10">
                 {data.right}
               </div>
            </div>
            
            <div className="col-start-2 row-start-3 flex flex-col items-center">
               <div className="w-14 h-14 rounded-full bg-rose-100 border-4 border-rose-400 flex items-center justify-center text-rose-700 font-black text-xl shadow-sm z-10">
                 {data.bottom}
               </div>
               <span className="text-[10px] text-slate-500 font-bold mt-1 bg-white/80 px-1 rounded text-center leading-tight">{data.bottomLabel}</span>
            </div>
         </div>
      </div>
    );
  }

  if (data.type === 'cripto') return <CriptoVisualizer data={data} />;
  if (data.type === 'clock') return <ClockVisualizer data={data} />;
  if (data.type === 'segments') return <SegmentsVisualizer data={data} />;
  if (data.type === 'timeline') return <TimelineVisualizer data={data} />;
  if (data.type === 'family') return <FamilyVisualizer data={data} />;
  if (data.type === 'geometry') return <GeometryVisualizer data={data} />;
  if (data.type === 'logic') return <LogicVisualizer data={data} />;
  if (data.type === 'truth_table') return <TruthTableVisualizer data={data} />;


  return null;
}

// NEW VISUALIZERS
const TruthTableVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center justify-center my-6">
       <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden text-center text-sm md:text-lg w-full max-w-sm">
         <table className="w-full border-collapse">
           <thead>
             <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-800 font-black">
               <th className="p-3 border-r-2 border-slate-200 text-purple-700 italic">p</th>
               <th className="p-3 border-r-2 border-slate-200 text-purple-700 italic">q</th>
               <th className="p-3 md:px-8 text-blue-700 font-serif tracking-widest text-xl">{data.formula}</th>
             </tr>
           </thead>
           <tbody className="text-slate-600 font-bold bg-white">
             <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
               <td className="p-3 border-r-2 border-slate-200 text-emerald-600">V</td>
               <td className="p-3 border-r-2 border-slate-200 text-emerald-600">V</td>
               <td className="p-3 text-slate-300 italic font-medium">?</td>
             </tr>
             <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
               <td className="p-3 border-r-2 border-slate-200 text-emerald-600">V</td>
               <td className="p-3 border-r-2 border-slate-200 text-red-500">F</td>
               <td className="p-3 text-slate-300 italic font-medium">?</td>
             </tr>
             <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50">
               <td className="p-3 border-r-2 border-slate-200 text-red-500">F</td>
               <td className="p-3 border-r-2 border-slate-200 text-emerald-600">V</td>
               <td className="p-3 text-slate-300 italic font-medium">?</td>
             </tr>
             <tr className="transition-colors hover:bg-slate-50">
               <td className="p-3 border-r-2 border-slate-200 text-red-500">F</td>
               <td className="p-3 border-r-2 border-slate-200 text-red-500">F</td>
               <td className="p-3 text-slate-300 italic font-medium">?</td>
             </tr>
           </tbody>
         </table>
       </div>
    </div>
  );
};

const LogicVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
       <div className="bg-white px-10 py-8 rounded-3xl border-2 border-slate-200 shadow-sm inline-flex items-center gap-6 text-6xl md:text-7xl font-black font-serif text-slate-800 tracking-widest">
         <div className="flex flex-col items-center">
            <span className="italic">p</span>
            <span className="text-xl md:text-2xl text-blue-500 mt-3 font-sans font-black bg-blue-50 px-3 py-1 rounded-xl border-2 border-blue-200">{data.p}</span>
         </div>
         <div className="text-amber-500 mx-2 flex flex-col items-center pb-6">
            <span>{data.op_symbol}</span>
         </div>
         <div className="flex flex-col items-center">
            <span className="italic">q</span>
            <span className="text-xl md:text-2xl text-emerald-500 mt-3 font-sans font-black bg-emerald-50 px-3 py-1 rounded-xl border-2 border-emerald-200">{data.q}</span>
         </div>
       </div>
    </div>
  );
};


// 1. Criptoaritmética
const CriptoVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center justify-center my-6">
       <div className="bg-white pl-12 pr-8 py-8 rounded-3xl border-2 border-slate-200 shadow-sm inline-block text-5xl font-black font-mono tracking-[0.3em] text-slate-700 relative">
          <div className="flex justify-end">
             {data.rows[0][0]}<span className="text-blue-500">{data.rows[0][1]}</span>
          </div>
          <div className="flex justify-end border-b-4 border-slate-300 pb-3 mb-3 relative">
             <span className="absolute -left-12 bottom-3 text-blue-500 tracking-normal text-4xl font-sans">{data.operator}</span>
             <span className="text-blue-500">{data.rows[1][0]}</span>{data.rows[1][1]}
          </div>
          <div className="flex justify-end text-emerald-500">
             {data.result.join('')}
          </div>
       </div>
    </div>
  );
};

// 2. Cronometría (Reloj)
const ClockVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center justify-center my-6 w-full overflow-hidden">
      <div className="flex gap-4 md:gap-8 justify-center w-full relative h-24 md:h-32">
        {/* Timeline base */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full mx-8"></div>
        
        {/* Campanadas */}
        {Array.from({ length: Math.min(6, data.camp1) }).map((_, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center justify-center" style={{ width: `${100 / Math.min(6, data.camp1)}%` }}>
            <div className="w-8 h-8 md:w-12 md:h-12 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center text-amber-600 shadow-sm mb-2 relative">
              <Icon name="zap" size={16} />
              <div className="absolute -inset-2 rounded-full border border-amber-300 animate-ping opacity-20" style={{ animationDelay: `${i * 0.2}s` }}></div>
            </div>
            {i < Math.min(6, data.camp1) - 1 && (
               <div className="absolute top-1/2 left-1/2 w-full h-full text-center">
                 <span className="text-[9px] md:text-xs text-blue-500 font-bold bg-blue-50 px-1 md:px-2 py-0.5 rounded-full border border-blue-200">
                   ? s
                 </span>
               </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center bg-slate-50 px-3 py-1 rounded-full">Recuerda: Los intervalos son {data.camp1 - 1}.</p>
    </div>
  );
};

// 3. Conteo de Figuras (Segmentos)
const SegmentsVisualizer = ({ data }: { data: any }) => {
  const points = Math.min(10, data.points); // limit display
  return (
    <div className="flex flex-col items-center justify-center my-8 w-full px-4">
       <div className="w-full max-w-sm h-12 relative flex items-center">
          <div className="absolute left-0 right-0 h-1.5 bg-blue-300 rounded-full"></div>
          {Array.from({ length: points }).map((_, i) => (
            <div key={i} className="absolute w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm transform -translate-y-1/2" style={{ left: `${(i / (points - 1)) * 100}%`, top: '50%' }}>
               <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">P{i+1}</span>
            </div>
          ))}
       </div>
    </div>
  );
};

// 4. Lógica (Días)
const TimelineVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center justify-center my-6 w-full">
       <div className="flex gap-2 justify-center w-full">
         <div className="flex flex-col items-center w-1/4">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Ayer</span>
            <div className="w-full h-8 bg-slate-100 border border-slate-200 rounded text-center flex items-center justify-center font-black text-slate-500">-1</div>
         </div>
         <div className="flex flex-col items-center w-1/4">
            <span className="text-[10px] uppercase font-bold text-blue-500 mb-1">Hoy</span>
            <div className="w-full h-10 bg-blue-100 border-2 border-blue-400 rounded-lg text-center flex items-center justify-center font-black text-blue-700 shadow-sm relative">0</div>
         </div>
         <div className="flex flex-col items-center w-1/4">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Mañana</span>
            <div className="w-full h-8 bg-slate-100 border border-slate-200 rounded text-center flex items-center justify-center font-black text-slate-500">+1</div>
         </div>
         <div className="flex flex-col items-center w-1/4">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Pas. M.</span>
            <div className="w-full h-8 bg-slate-100 border border-slate-200 rounded text-center flex items-center justify-center font-black text-slate-500">+2</div>
         </div>
       </div>
    </div>
  );
};

// 5. Lógica (Familia)
const FamilyVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-6 w-full max-w-sm mx-auto">
       {data.roles.map((role: string, idx: number) => (
         <div key={idx} className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-rose-600 font-bold text-xs shadow-sm flex items-center gap-1.5">
           <Icon name="user" size={12} /> {role}
         </div>
       ))}
    </div>
  );
};


// 6. Geometría 5to
const GeometryVisualizer = ({ data }: { data: any }) => {
  if (data.shape === 'triangle_altitude') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
          {/* Base / Hipotenusa */}
          <line x1="10" y1="100" x2="190" y2="100" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          {/* Altura */}
          <line x1="70" y1="20" x2="70" y2="100" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
          {/* Catetos */}
          <line x1="10" y1="100" x2="70" y2="20" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <line x1="190" y1="100" x2="70" y2="20" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          
          {/* Right angle symbol at top */}
          <polyline points="63,28 72,35 80,28" fill="none" stroke="#334155" strokeWidth="1.5" />
          {/* Right angle symbol at bottom */}
          <polyline points="70,90 80,90 80,100" fill="none" stroke="#334155" strokeWidth="1.5" />
          
          <text x="40" y="115" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">m={data.m}</text>
          <text x="130" y="115" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">n={data.n}</text>
          <text x="75" y="65" fontSize="14" fill="#ef4444" fontWeight="bold">h</text>
        </svg>
      </div>
    );
  }
  
    if (data.shape === 'triangle_leg') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
          {/* Base / Hipotenusa */}
          <line x1="10" y1="100" x2="190" y2="100" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="110" x2="190" y2="110" stroke="#64748b" strokeWidth="1" />
          <line x1="10" y1="107" x2="10" y2="113" stroke="#64748b" strokeWidth="1" />
          <line x1="190" y1="107" x2="190" y2="113" stroke="#64748b" strokeWidth="1" />
          <text x="100" y="125" fontSize="12" fill="#64748b" textAnchor="middle" fontWeight="bold">c = {data.c}</text>
          
          {/* Altura */}
          <line x1="70" y1="20" x2="70" y2="100" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
          
          {/* Proyeccion */}
          <line x1="10" y1="95" x2="70" y2="95" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          <text x="40" y="88" fontSize="12" fill="#10b981" textAnchor="middle" fontWeight="bold">m = {data.m}</text>
          
          {/* Catetos */}
          <line x1="10" y1="100" x2="70" y2="20" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <text x="30" y="55" fontSize="14" fill="#3b82f6" fontWeight="bold">a</text>

          <line x1="190" y1="100" x2="70" y2="20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          
          {/* Right angle symbol at top */}
          <polyline points="63,28 72,35 80,28" fill="none" stroke="#334155" strokeWidth="1.5" />
          {/* Right angle symbol at bottom */}
          <polyline points="70,90 80,90 80,100" fill="none" stroke="#334155" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }
  
  if (data.shape === 'circle_chords') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible">
          <circle cx="75" cy="75" r="70" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="3" />
          
          <line x1="25" y1="25" x2="125" y2="125" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="15" y1="100" x2="135" y2="50" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          
          {/* Intersection at x=75, y=75 approx */}
          <circle cx="75" cy="75" r="4" fill="#334155" />
          
          <text x="45" y="40" fontSize="12" fill="#ef4444" fontWeight="bold" textAnchor="middle">{data.a}</text>
          <text x="105" y="110" fontSize="12" fill="#ef4444" fontWeight="bold" textAnchor="middle">{data.b}</text>
          
          <text x="35" y="85" fontSize="12" fill="#10b981" fontWeight="bold" textAnchor="middle">{data.c}</text>
          <text x="115" y="65" fontSize="14" fill="#10b981" fontWeight="bold" textAnchor="middle">x</text>
        </svg>
      </div>
    );
  }
  
  if (data.shape === 'circular_sector') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible">
          <path d="M 75 75 L 145 75 A 70 70 0 0 0 40 14 Z" fill="#fdf4ff" stroke="#d946ef" strokeWidth="3" />
          <text x="110" y="90" fontSize="12" fill="#d946ef" fontWeight="bold">{data.r}</text>
          <text x="85" y="55" fontSize="12" fill="#334155" fontWeight="bold">{data.angle}</text>
        </svg>
      </div>
    );
  }
  
  if (data.shape === 'circular_crown') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible">
          <circle cx="75" cy="75" r="70" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="75" cy="75" r="40" fill="white" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="75" cy="75" r="3" fill="#334155" />
          
          <line x1="75" y1="75" x2="145" y2="75" stroke="#334155" strokeWidth="1.5" strokeDasharray="3" />
          <line x1="75" y1="75" x2="46" y2="50" stroke="#334155" strokeWidth="1.5" strokeDasharray="3" />
          
          <text x="115" y="70" fontSize="12" fill="#334155" fontWeight="bold">R={data.R}</text>
          <text x="50" y="55" fontSize="12" fill="#334155" fontWeight="bold">r={data.r}</text>
        </svg>
      </div>
    );
  }

  
  if (data.shape === 'space_3perp') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="180" height="150" viewBox="0 0 180 150" className="overflow-visible">
          {/* Plano */}
          <polygon points="20,130 140,130 170,90 50,90" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
          
          {/* Triángulo base PAB (A is center, B is right) */}
          {/* A = (80, 110), B = (130, 110), P = (80, 20) */}
          <line x1="80" y1="110" x2="130" y2="110" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
          <line x1="80" y1="20" x2="80" y2="110" stroke="#ef4444" strokeWidth="3" />
          <line x1="80" y1="20" x2="130" y2="110" stroke="#10b981" strokeWidth="3" />
          
          <polyline points="80,100 90,100 90,110" fill="none" stroke="#334155" strokeWidth="1.5" />
          
          <circle cx="80" cy="110" r="3" fill="#334155" />
          <circle cx="130" cy="110" r="3" fill="#334155" />
          <circle cx="80" cy="20" r="3" fill="#334155" />
          
          <text x="70" y="125" fontSize="12" fill="#334155" fontWeight="bold">A</text>
          <text x="140" y="120" fontSize="12" fill="#334155" fontWeight="bold">B</text>
          <text x="70" y="15" fontSize="12" fill="#334155" fontWeight="bold">P</text>
          
          <text x="65" y="65" fontSize="12" fill="#ef4444" fontWeight="bold">{data.h}</text>
          <text x="105" y="125" fontSize="12" fill="#3b82f6" fontWeight="bold">{data.proj}</text>
        </svg>
      </div>
    );
  }

  if (data.shape === 'cube') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="120" height="130" viewBox="0 0 120 130" className="overflow-visible">
          {/* Back face */}
          <rect x="40" y="20" width="70" height="70" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
          {/* Connecting lines */}
          <line x1="10" y1="50" x2="40" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="80" y1="50" x2="110" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="80" y1="120" x2="110" y2="90" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="10" y1="120" x2="40" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
          {/* Front face */}
          <rect x="10" y="50" width="70" height="70" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2.5" />
          
          <text x="45" y="135" fontSize="12" fill="#3b82f6" fontWeight="bold">a={data.a}</text>
        </svg>
      </div>
    );
  }

  if (data.shape === 'cylinder') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="120" height="150" viewBox="0 0 120 150" className="overflow-visible">
          {/* Top ellipse */}
          <ellipse cx="60" cy="30" rx="40" ry="15" fill="#fef2f2" stroke="#ef4444" strokeWidth="2.5" />
          {/* Bottom ellipse */}
          <ellipse cx="60" cy="120" rx="40" ry="15" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          {/* Dashed back part of bottom ellipse */}
          <path d="M 20 120 A 40 15 0 0 1 100 120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4" />
          
          <line x1="20" y1="30" x2="20" y2="120" stroke="#ef4444" strokeWidth="2.5" />
          <line x1="100" y1="30" x2="100" y2="120" stroke="#ef4444" strokeWidth="2.5" />
          
          <line x1="60" y1="30" x2="100" y2="30" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" />
          
          <text x="80" y="25" fontSize="12" fill="#ef4444" fontWeight="bold">r={data.r}</text>
          <text x="5" y="80" fontSize="12" fill="#ef4444" fontWeight="bold">h={data.h}</text>
        </svg>
      </div>
    );
  }

  if (data.shape === 'triangle_angle') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="160" height="130" viewBox="0 0 160 130" className="overflow-visible">
          <polygon points="10,110 150,110 50,30" fill="#fdf4ff" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" />
          <path d="M 40 110 A 30 30 0 0 0 35 90" fill="none" stroke="#d946ef" strokeWidth="2" />
          <text x="45" y="100" fontSize="12" fill="#d946ef" fontWeight="bold">{data.angle}</text>
          <text x="80" y="125" fontSize="12" fill="#334155" fontWeight="bold">{data.b}</text>
          <text x="15" y="65" fontSize="12" fill="#334155" fontWeight="bold">{data.a}</text>
        </svg>
      </div>
    );
  }

  if (data.shape === 'triangle_medians') {
    return (
      <div className="flex flex-col items-center justify-center my-6 w-full">
        <svg width="180" height="130" viewBox="0 0 180 130" className="overflow-visible">
          <polygon points="10,110 170,110 90,20" fill="#f0fdf4" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
          {/* M = (130, 65) */}
          <line x1="10" y1="110" x2="130" y2="65" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
          {/* N is midpoint of BM. B=(10,110), M=(130,65). N = (70, 87.5) */}
          <line x1="90" y1="20" x2="70" y2="87.5" stroke="#10b981" strokeWidth="2" strokeDasharray="4" />
          
          <circle cx="130" cy="65" r="3" fill="#334155" />
          <circle cx="70" cy="87.5" r="3" fill="#334155" />
          
          <text x="140" y="65" fontSize="12" fill="#334155" fontWeight="bold">M</text>
          <text x="75" y="100" fontSize="12" fill="#334155" fontWeight="bold">N</text>
          
          <text x="5" y="120" fontSize="12" fill="#334155" fontWeight="bold">A</text>
          <text x="175" y="120" fontSize="12" fill="#334155" fontWeight="bold">C</text>
          <text x="85" y="10" fontSize="12" fill="#334155" fontWeight="bold">B</text>
          
          <text x="120" y="130" fontSize="10" fill="#10b981" fontWeight="bold">Área={data.area}</text>
        </svg>
      </div>
    );
  }

  // Fallback if shape not recognized
  return <div className="text-center text-xs text-slate-400 my-4">[Gráfico Geométrico]</div>;
};
