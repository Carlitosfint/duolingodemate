const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
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

code = code.replace(effectCode, "");

const viewModeRegex = /const \[viewMode, setViewMode\] = useState<.*>\('map'\);/;
code = code.replace(viewModeRegex, match => match + "\n" + effectCode);

fs.writeFileSync('src/App.tsx', code);
