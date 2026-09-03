import re

with open("src/components/Visualizer.tsx", "r") as f:
    content = f.read()

# I want to add triangle_leg inside GeometryVisualizer
# before if (data.shape === 'circle_chords')

new_visual = """  if (data.shape === 'triangle_leg') {
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
  
  if (data.shape === 'circle_chords') {"""

if "if (data.shape === 'circle_chords')" in content and "data.shape === 'triangle_leg'" not in content:
    content = content.replace("if (data.shape === 'circle_chords') {", new_visual)
    with open("src/components/Visualizer.tsx", "w") as f:
        f.write(content)
    print("Patched GeometryVisualizer successfully")
else:
    print("Could not patch GeometryVisualizer")
