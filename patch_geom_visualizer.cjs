const fs = require('fs');
let code = fs.readFileSync('src/components/Visualizer.tsx', 'utf8');

const additionalShapes = `
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
`;

code = code.replace(
  /\/\/ Fallback if shape not recognized/,
  additionalShapes + '\n  // Fallback if shape not recognized'
);

fs.writeFileSync('src/components/Visualizer.tsx', code);
