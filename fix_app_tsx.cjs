const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Fix the JSX string for answerState
code = code.replace(
  /text: \`<Icon name="x" className="inline-block" size=\{18\} \/> Respuesta incorrecta. ¡Tu Escudo te protegió y salvó tu racha de 🔥 \$\{streak\}!\`/g,
  `text: <><Icon name="x" className="inline-block" size={18} /> Respuesta incorrecta. ¡Tu Escudo te protegió y salvó tu racha de 🔥 {streak}!</>`
);

// Update expectedType for razonamiento_5to
code = code.replace(
  /expectedType = pLevel < 20 \? 'Planteo Avanzado' : pLevel < 40 \? 'Edades y Cronometría' : pLevel < 60 \? 'Lógica Inferencial' : pLevel < 80 \? 'Fracciones y Mezclas' : 'Mate Financiera';/g,
  `expectedType = pLevel < 20 ? 'Edades y Cronometría' : pLevel < 40 ? 'Lógica Inferencial' : pLevel < 60 ? 'Fracciones y Mezclas' : pLevel < 80 ? 'Mate Financiera' : 'Planteo de Ecuaciones';`
);

// Update map view progress text
code = code.replace(
  /progress < 20 \? 'Planteo Avanzado' : progress < 40 \? 'Edades y Cronometría' : progress < 60 \? 'Lógica Inferencial' : progress < 80 \? 'Fracciones y Mezclas' : 'Mate Financiera'/g,
  `progress < 20 ? 'Edades y Cronometría' : progress < 40 ? 'Lógica Inferencial' : progress < 60 ? 'Fracciones y Mezclas' : progress < 80 ? 'Mate Financiera' : 'Planteo de Ecuaciones'`
);

// Update topics array
const oldTopics = `[
                         { id: 'planteo_avanzado', name: 'Planteo Avanzado', icon: '📊', color: 'bg-emerald-500' },
                         { id: 'edades_cronometria', name: 'Edades y Cronometría', icon: '⏳', color: 'bg-blue-500' },
                         { id: 'logica_inferencial', name: 'Lógica Inferencial', icon: '🧠', color: 'bg-violet-500' },
                         { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', icon: '🧪', color: 'bg-amber-500' },
                         { id: 'matematica_financiera', name: 'Mate Financiera', icon: '💰', color: 'bg-rose-500' }
                       ]`;

const newTopics = `[
                         { id: 'edades_cronometria', name: 'Edades y Cronometría', icon: '⏳', color: 'bg-blue-500' },
                         { id: 'logica_inferencial', name: 'Lógica Inferencial', icon: '🧠', color: 'bg-violet-500' },
                         { id: 'mezclas_aleaciones', name: 'Fracciones y Mezclas', icon: '🧪', color: 'bg-amber-500' },
                         { id: 'matematica_financiera', name: 'Mate Financiera', icon: '💰', color: 'bg-rose-500' },
                         { id: 'planteo_ecuaciones', name: 'Planteo de Ecuaciones', icon: '📊', color: 'bg-emerald-500' }
                       ]`;

code = code.replace(oldTopics, newTopics);

fs.writeFileSync('src/App.tsx', code);
