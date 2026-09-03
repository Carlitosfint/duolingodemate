const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const pLevel = user\.progress;\s*const expectedType = pLevel < 20 \? 'Métodos Operativos' : pLevel < 40 \? 'Criptoaritmética' : pLevel < 60 \? 'Lógica Recreativa' : pLevel < 80 \? 'Cronometría Básica' : 'Conteo de Figuras';\s*if \(currentProblem\?\.data && currentProblem\.data\.type !== expectedType\) \{\s*const prob = generateMathProblem\(false, null, pLevel\);\s*setCurrentProblem\(\{ data: prob, solved: false, timestamp: Date\.now\(\) \}\);\s*\}/m;

const replacement = `const pLevel = activeCourse === 'trigonometria' ? (user.courseProgress?.trigonometria || 0) : user.progress;
      let expectedType = '';
      if (activeCourse === 'trigonometria') {
        expectedType = pLevel < 20 ? 'Propiedades de las RT' : pLevel < 40 ? 'Resolución de Triángulos' : pLevel < 60 ? 'Ángulos Verticales' : pLevel < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal';
      } else {
        expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      }
      
      if (currentProblem?.data && currentProblem.data.type !== expectedType) {
         const prob = generateMathProblem(false, null, pLevel, activeCourse);
         setCurrentProblem({ data: prob, solved: false, timestamp: Date.now() });
      }`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', code);
