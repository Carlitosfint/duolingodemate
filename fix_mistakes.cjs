const fs = require('fs');
let code = fs.readFileSync('src/components/MistakesModal.tsx', 'utf8');

code = code.replace(
  /Respuesta Correcta: \{m\.correctAnswer\}%<\/div>/g,
  'Respuesta Correcta: {m.correctAnswer}</div>'
);

fs.writeFileSync('src/components/MistakesModal.tsx', code);
