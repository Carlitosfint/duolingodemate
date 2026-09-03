const fs = require('fs');
let code = fs.readFileSync('src/components/Visualizer.tsx', 'utf8');

const targetStr = `const CriptoVisualizer = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col items-center justify-center my-6">
       <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm inline-block text-4xl font-black font-mono tracking-[0.3em] text-slate-700">
          <div className="flex justify-end relative">
             <span className="absolute -left-8 top-0 text-blue-500">{data.operator}</span>
             {data.rows[0][0]}<span className="text-blue-500">{data.rows[0][1]}</span>
          </div>
          <div className="flex justify-end border-b-4 border-slate-300 pb-2 mb-2">
             <span className="text-blue-500">{data.rows[1][0]}</span>{data.rows[1][1]}
          </div>
          <div className="flex justify-end text-emerald-500">
             {data.result.join('')}
          </div>
       </div>
    </div>
  );
};`;

const replacementStr = `const CriptoVisualizer = ({ data }: { data: any }) => {
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
};`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/Visualizer.tsx', code);
