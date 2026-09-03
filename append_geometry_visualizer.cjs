const fs = require('fs');
let code = fs.readFileSync('src/components/Visualizer.tsx', 'utf8');

// Add the import/check for geometry in the main ProblemVisualizer component
code = code.replace(
  /if \(data.type === 'family'\) return <FamilyVisualizer data=\{data\} \/>;/g,
  `if (data.type === 'family') return <FamilyVisualizer data={data} />;
  if (data.type === 'geometry') return <GeometryVisualizer data={data} />;\n`
);

// Append GeometryVisualizer
const geometryVisualizer = `
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

  // Fallback if shape not recognized
  return <div className="text-center text-xs text-slate-400 my-4">[Gráfico Geométrico]</div>;
};
`;

code = code + geometryVisualizer;
fs.writeFileSync('src/components/Visualizer.tsx', code);
