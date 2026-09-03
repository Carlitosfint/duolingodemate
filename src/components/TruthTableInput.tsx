import React from 'react';


interface Props {
  formula: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  isShaking?: boolean;
}

export const TruthTableInput = ({ formula, value, onChange, disabled, isShaking }: Props) => {
  // Ensure value is always 4 chars
  const vals = (value + "    ").substring(0, 4).toUpperCase();
  
  const updateChar = (idx: number, char: string) => {
    if (disabled) return;
    const cleanChar = char.toUpperCase();
    if (cleanChar !== 'V' && cleanChar !== 'F' && cleanChar !== ' ') return;
    
    let arr = vals.split('');
    arr[idx] = cleanChar;
    const newVal = arr.join('');
    onChange(newVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && vals[idx] === ' ') {
      // Focus previous if empty and backspace pressed
      if (idx > 0) {
        document.getElementById(`tt-input-${idx - 1}`)?.focus();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.toUpperCase();
    // we only want the last typed char if it's longer
    const char = val.length > 0 ? val[val.length - 1] : ' ';
    if (char === 'V' || char === 'F' || char === ' ') {
      updateChar(idx, char);
      if (char !== ' ' && idx < 3) {
        document.getElementById(`tt-input-${idx + 1}`)?.focus();
      }
    }
  };

  return (
    <div className={`w-full max-w-sm mx-auto mb-6 flex flex-col items-center justify-center transition-all ${isShaking ? 'animate-shake' : ''}`}>
       <div className={`bg-white rounded-3xl border-[3px] shadow-sm overflow-hidden text-center text-sm md:text-lg w-full ${isShaking ? 'border-rose-400 ring-4 ring-rose-100' : 'border-slate-200'}`}>
         <table className="w-full border-collapse">
           <thead>
             <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-800 font-black">
               <th className="p-2 md:p-3 border-r-2 border-slate-200 text-purple-700 italic w-1/4">p</th>
               <th className="p-2 md:p-3 border-r-2 border-slate-200 text-purple-700 italic w-1/4">q</th>
               <th className="p-2 md:p-3 md:px-8 text-blue-700 font-serif tracking-widest text-lg md:text-xl w-2/4">{formula}</th>
             </tr>
           </thead>
           <tbody className="text-slate-600 font-bold bg-white">
             {[
               { p: 'V', q: 'V' },
               { p: 'V', q: 'F' },
               { p: 'F', q: 'V' },
               { p: 'F', q: 'F' },
             ].map((row, idx) => (
               <tr key={idx} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                 <td className={`p-2 md:p-3 border-r-2 border-slate-200 ${row.p === 'V' ? 'text-emerald-600' : 'text-red-500'}`}>{row.p}</td>
                 <td className={`p-2 md:p-3 border-r-2 border-slate-200 ${row.q === 'V' ? 'text-emerald-600' : 'text-red-500'}`}>{row.q}</td>
                 <td className="p-2 md:p-3 relative">
                   <input
                     id={`tt-input-${idx}`}
                     type="text"
                     disabled={disabled}
                     value={vals[idx] === ' ' ? '' : vals[idx]}
                     onChange={(e) => handleChange(e, idx)}
                     onKeyDown={(e) => handleKeyDown(e, idx)}
                     className="w-12 h-12 text-center text-xl font-black rounded-xl border-2 border-slate-200 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 uppercase transition-all bg-white text-slate-800 disabled:opacity-70 disabled:bg-slate-50 mx-auto block"
                     placeholder="?"
                     maxLength={2}
                   />
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
};
