const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem>(() => {
    const pLevel = user?.progress || 0;
    const expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
    
    const saved = localStorage.getItem('fin_current_problem');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.data && (!p.data.visualData || p.data.type !== expectedType)) {
        // Regenerate if no visualData or type mismatch
        const prob = generateMathProblem(false, null, pLevel);
        return { data: prob, solved: false, timestamp: Date.now() };
      }
      return p;
    }
    const prob = generateMathProblem(false, null, pLevel);
    return { data: prob, solved: false, timestamp: Date.now() };
  });
`;

code = code.replace(
  /const \[currentProblem, setCurrentProblem\] = useState<CurrentProblem>\(\(\) => \{[\s\S]*?return \{ data: prob, solved: false, timestamp: Date\.now\(\) \};\n  \}\);/,
  replacement.trim()
);

fs.writeFileSync('src/App.tsx', code);
