import re

with open('src/components/Visualizer.tsx', 'r') as f:
    content = f.read()

target_import = '''  if (data.type === 'family') return <FamilyVisualizer data={data} />;
  if (data.type === 'geometry') return <GeometryVisualizer data={data} />;'''

replacement_import = '''  if (data.type === 'family') return <FamilyVisualizer data={data} />;
  if (data.type === 'geometry') return <GeometryVisualizer data={data} />;
  if (data.type === 'logic') return <LogicVisualizer data={data} />;'''

content = content.replace(target_import, replacement_import)

target_component = '''// NEW VISUALIZERS'''

replacement_component = '''// NEW VISUALIZERS
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
'''

content = content.replace(target_component, replacement_component)

with open('src/components/Visualizer.tsx', 'w') as f:
    f.write(content)

print("Patched visualizer")
