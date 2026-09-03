const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

// Fix the import to use an alias
code = code.replace(
  /import \{ generatePlanteoEcuaciones, generateEdades, generateCronometria, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera \} from "\.\/math_razonamiento_5to";/,
  `import { generatePlanteoEcuaciones, generateEdades, generateCronometria as generateCronometria5to, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera } from "./math_razonamiento_5to";`
);

// Switch for razonamiento_5to
code = code.replace(
  /case 'cronometria_avanzada': return generateCronometria\(isGolden\);/g,
  `case 'cronometria_avanzada': return generateCronometria5to(isGolden);`
);

// Level ranges for razonamiento_5to
code = code.replace(
  /if \(level < 34\) return generateCronometria\(isGolden\);/g,
  `if (level < 34) return generateCronometria5to(isGolden);`
);

fs.writeFileSync('src/utils/math.ts', code);
