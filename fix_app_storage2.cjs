const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  const [currentProblem, setCurrentProblem] = useState<CurrentProblem>(() => {
    const saved = localStorage.getItem('fin_current_problem');
    if (saved) {
      const p = JSON.parse(saved);
      if (p.data && !p.data.visualData) {
        // Regenerate if no visualData
        const prob = generateMathProblem(false, null, 0);
        return { data: prob, solved: false, timestamp: Date.now() };
      }
      return p;
    }
    const prob = generateMathProblem(false, null, 0);
    return { data: prob, solved: false, timestamp: Date.now() };
  });

  // Verify problem type matches user progress once user loads
  useEffect(() => {
    if (user && viewMode === 'exercise') {
      const pLevel = user.progress;
      const expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      if (currentProblem?.data && currentProblem.data.type !== expectedType) {
         const prob = generateMathProblem(false, null, pLevel);
         setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
      }
    }
  }, [user?.progress, viewMode]);
`;

code = code.replace(
  /const \[currentProblem, setCurrentProblem\] = useState<CurrentProblem>\(\(\) => \{[\s\S]*?return \{ data: prob, solved: false, timestamp: Date\.now\(\) \};\n  \}\);/,
  replacement.trim()
);

fs.writeFileSync('src/App.tsx', code);
