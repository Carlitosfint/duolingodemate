const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<span className="flex items-center gap-1 flex-wrap justify-center"><Icon name="x" size=\{18\} \/> Incorrecto\. La respuesta era \{correctVal\}%\. ¡Vuelve a intentarlo!<\/span>/,
  '<span className="flex items-center gap-1 flex-wrap justify-center"><Icon name="x" size={18} /> Incorrecto. La respuesta era {correctVal}{currentProblem.data.unit}. ¡Vuelve a intentarlo!</span>'
);

fs.writeFileSync('src/App.tsx', code);
