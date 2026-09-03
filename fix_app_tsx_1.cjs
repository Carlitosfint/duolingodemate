const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const pLevel = activeCourse === 'trigonometria' \? \(user\.courseProgress\?\.trigonometria \|\| 0\) : user\.progress;/,
  `const pLevel = activeCourse === 'trigonometria' ? (user.courseProgress?.trigonometria || 0) : activeCourse === 'razonamiento_5to' ? (user.courseProgress?.razonamiento_5to || 0) : user.progress;`
);

code = code.replace(
  /if \(activeCourse === 'trigonometria'\) \{\s*expectedType = pLevel < 20 \? 'Propiedades de las RT' : pLevel < 40 \? 'Resolución de Triángulos' : pLevel < 60 \? 'Ángulos Verticales' : pLevel < 80 \? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal';\s*\} else \{\s*expectedType = pLevel < 20 \? 'Métodos Operativos' : pLevel < 40 \? 'Criptoaritmética' : pLevel < 60 \? 'Lógica Recreativa' : pLevel < 80 \? 'Cronometría Básica' : 'Conteo de Figuras';\s*\}/,
  `if (activeCourse === 'trigonometria') {
        expectedType = pLevel < 20 ? 'Propiedades de las RT' : pLevel < 40 ? 'Resolución de Triángulos' : pLevel < 60 ? 'Ángulos Verticales' : pLevel < 80 ? 'Intro Geometría Analítica' : 'Ángulos en Posición Normal';
      } else if (activeCourse === 'razonamiento_5to') {
        expectedType = pLevel < 20 ? 'Planteo Avanzado' : pLevel < 40 ? 'Edades y Cronometría' : pLevel < 60 ? 'Lógica Inferencial' : pLevel < 80 ? 'Fracciones y Mezclas' : 'Mate Financiera';
      } else {
        expectedType = pLevel < 20 ? 'Métodos Operativos' : pLevel < 40 ? 'Criptoaritmética' : pLevel < 60 ? 'Lógica Recreativa' : pLevel < 80 ? 'Cronometría Básica' : 'Conteo de Figuras';
      }`
);

// Map and Practice headers
code = code.replace(
  /const progress = activeCourse === 'trigonometria' \? \(user\?\.courseProgress\?\.trigonometria \|\| 0\) : \(user\?\.progress \|\| 0\);/g,
  `const progress = activeCourse === 'trigonometria' ? (user?.courseProgress?.trigonometria || 0) : activeCourse === 'razonamiento_5to' ? (user?.courseProgress?.razonamiento_5to || 0) : (user?.progress || 0);`
);

fs.writeFileSync('src/App.tsx', code);
