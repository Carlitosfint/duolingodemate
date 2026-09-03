const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = /useEffect\(\(\) => \{\s*if \(user && viewMode === 'exercise'\) \{\s*const pLevel = user\.progress;\s*const expectedType =[\s\S]*?\}, \[user\?\.progress, viewMode\]\);/;

const newEffect = `
  // Verify problem type matches user progress once user loads
  useEffect(() => {
    if (user && viewMode === 'exercise' && !selectedTopic) {
      const pLevel = user.progress;
      const expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      if (currentProblem?.data && currentProblem.data.type !== expectedType) {
         const prob = generateMathProblem(false, null, pLevel);
         setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
      }
    }
  }, [user?.progress, viewMode, selectedTopic]);
`;

code = code.replace(oldEffect, newEffect.trim());

fs.writeFileSync('src/App.tsx', code);
