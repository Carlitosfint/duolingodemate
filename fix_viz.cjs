const fs = require('fs');
let code = fs.readFileSync('src/components/Visualizer.tsx', 'utf8');

code = code.replace(
  /export const ProblemVisualizer = \(\{ data \}: \{ data: any \}\) => \{[\s\S]*?return null;\n\}/,
  `export const ProblemVisualizer = ({ data }: { data: any }) => {
  if (!data) return null;

  if (data.type === 'cangrejo') {
    return (
      <div className="flex flex-col items-center justify-center my-6 overflow-x-auto w-full max-w-full pb-4">
        <div className="flex items-center gap-2 md:gap-3 text-slate-700 font-bold min-w-max">
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

  return null;
}`
);

fs.writeFileSync('src/components/Visualizer.tsx', code);
