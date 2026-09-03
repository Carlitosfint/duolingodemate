const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix expectedType assignment
code = code.replace(
  /expectedType = pLevel < 20 \? 'Edades y Cronometría' : pLevel < 40 \? 'Lógica Inferencial' : pLevel < 60 \? 'Fracciones y Mezclas' : pLevel < 80 \? 'Mate Financiera' : 'Planteo de Ecuaciones';/g,
  `expectedType = pLevel < 17 ? 'Edades' : pLevel < 34 ? 'Cronometría' : pLevel < 51 ? 'Lógica Inferencial' : pLevel < 68 ? 'Fracciones y Mezclas' : pLevel < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones';`
);

// Fix map visual text
code = code.replace(
  /progress < 20 \? 'Edades y Cronometría' : progress < 40 \? 'Lógica Inferencial' : progress < 60 \? 'Fracciones y Mezclas' : progress < 80 \? 'Mate Financiera' : 'Planteo de Ecuaciones'/g,
  `progress < 17 ? 'Edades' : progress < 34 ? 'Cronometría' : progress < 51 ? 'Lógica Inferencial' : progress < 68 ? 'Fracciones y Mezclas' : progress < 85 ? 'Mate Financiera' : 'Planteo de Ecuaciones'`
);

// Fix topics array in App.tsx practice grid
const oldTopics = `[
                         { id: 'edades_cronometria', name: 'Edades y Cronometría', icon: '⏳', color: 'bg-blue-500' },
                         { id: 'logica_inferencial', name: 'Lógica Inferencial', icon: '🧠', color: 'bg-violet-500' },
                         { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', icon: '🧪', color: 'bg-amber-500' },
                         { id: 'matematica_financiera', name: 'Mate Financiera', icon: '💰', color: 'bg-rose-500' },
                         { id: 'planteo_ecuaciones', name: 'Planteo de Ecuaciones', icon: '📊', color: 'bg-emerald-500' }
                       ]`;
                       
const newTopics = `[
                         { id: 'edades', name: 'Edades', icon: '👨‍👦', color: 'bg-blue-500' },
                         { id: 'cronometria_avanzada', name: 'Cronometría', icon: '⏳', color: 'bg-sky-500' },
                         { id: 'logica_inferencial', name: 'Lógica Inferencial', icon: '🧠', color: 'bg-violet-500' },
                         { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', icon: '🧪', color: 'bg-amber-500' },
                         { id: 'matematica_financiera', name: 'Mate Financiera', icon: '💰', color: 'bg-rose-500' },
                         { id: 'planteo_ecuaciones', name: 'Planteo de Ecuaciones', icon: '📊', color: 'bg-emerald-500' }
                       ]`;
                       
code = code.replace(oldTopics, newTopics);

fs.writeFileSync('src/App.tsx', code);
