const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const saved = localStorage\.getItem\('fin_current_problem'\);\n\s*if \(saved\) return JSON\.parse\(saved\);/,
  `const saved = localStorage.getItem('fin_current_problem');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.data && !p.data.visualData) {
        // Regenerate if no visualData
        const prob = generateMathProblem(false, null, 0);
        return { data: prob, solved: false, timestamp: Date.now() };
      }
      return p;
    }`
);

fs.writeFileSync('src/App.tsx', code);
