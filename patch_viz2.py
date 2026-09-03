import re

with open('src/components/Visualizer.tsx', 'r') as f:
    content = f.read()

target = r'''  if \(data\.type === 'logic'\) return <LogicVisualizer data=\{data\} />;'''

replacement = r'''  if (data.type === 'logic') return <LogicVisualizer data={data} />;
  if (data.type === 'truth_table') return <TruthTableVisualizer data={data} />;'''

content_new = re.sub(target, replacement, content)

target_2 = r'''// NEW VISUALIZERS'''

replacement_2 = r'''// NEW VISUALIZERS
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
'''

content_new_2 = content_new.replace(target_2, replacement_2)
if content_new_2 == content_new:
    print("Failed to replace second target")

with open('src/components/Visualizer.tsx', 'w') as f:
    f.write(content_new_2)
print("Replaced in visualizer")
