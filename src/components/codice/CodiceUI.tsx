import React from 'react';

export const FormulaBox: React.FC<{ formula: React.ReactNode, title?: string, color: string }> = ({ formula, title, color }) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    sky: 'bg-sky-50 border-sky-200 text-sky-700',
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };
  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-4 md:p-5 rounded-2xl border-2 text-center my-3 shadow-sm ${theme}`}>
      {title && <div className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-80 mb-2">{title}</div>}
      <div className="text-xl md:text-2xl font-black tracking-widest whitespace-nowrap overflow-x-auto custom-scrollbar pb-1">{formula}</div>
    </div>
  );
};

export const SectionTitle: React.FC<{ icon: string, title: string, subtitle: string, color: string }> = ({ icon, title, subtitle, color }) => {
  const colorMap: any = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    sky: 'bg-sky-50 border-sky-200 text-sky-900',
    violet: 'bg-violet-50 border-violet-200 text-violet-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    rose: 'bg-rose-50 border-rose-200 text-rose-900',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    fuchsia: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    teal: 'bg-teal-50 border-teal-200 text-teal-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
  };
  const theme = colorMap[color] || colorMap.indigo;
  const subTheme = theme.replace('900', '800');

  return (
    <div className={`p-6 md:p-8 rounded-[2rem] border-2 shadow-sm mb-6 ${theme}`}>
      <h4 className="font-black text-2xl md:text-3xl mb-3 flex items-center gap-3">
        <span>{icon}</span> {title}
      </h4>
      <p className={`text-sm md:text-base font-semibold leading-relaxed ${subTheme.split(' ')[2]}`}>
        {subtitle}
      </p>
    </div>
  );
};

export const GridCard: React.FC<{ title: string, icon: string, color: string, children: React.ReactNode, fullWidth?: boolean }> = ({ title, icon, color, children, fullWidth }) => {
  const colorMap: any = {
    indigo: 'border-indigo-100 text-indigo-700',
    blue: 'border-blue-100 text-blue-700',
    sky: 'border-sky-100 text-sky-700',
    violet: 'border-violet-100 text-violet-700',
    amber: 'border-amber-100 text-amber-700',
    rose: 'border-rose-100 text-rose-700',
    emerald: 'border-emerald-100 text-emerald-700',
    cyan: 'border-cyan-100 text-cyan-700',
    fuchsia: 'border-fuchsia-100 text-fuchsia-700',
    pink: 'border-pink-100 text-pink-700',
    purple: 'border-purple-100 text-purple-700',
    teal: 'border-teal-100 text-teal-700',
    orange: 'border-orange-100 text-orange-700',
  };
  const theme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`bg-white p-5 md:p-6 rounded-3xl border-2 shadow-sm hover:shadow-md transition-shadow ${theme} ${fullWidth ? 'md:col-span-2' : ''}`}>
      <div className="flex justify-between items-center mb-3">
        <strong className="text-lg md:text-xl font-black">{title}</strong>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
