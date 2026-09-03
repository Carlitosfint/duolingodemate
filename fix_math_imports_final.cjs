const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

// Update imports
code = code.replace(
  /import \{ generatePlanteoEcuaciones, generateEdadesCronometria, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera \} from "\.\/math_razonamiento_5to";/,
  `import { generatePlanteoEcuaciones, generateEdades, generateCronometria, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera } from "./math_razonamiento_5to";`
);

// Update switch
const oldSwitch = `switch (topic) {
        case 'edades_cronometria': return generateEdadesCronometria(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);
        default: return generateEdadesCronometria(isGolden);
      }`;

const newSwitch = `switch (topic) {
        case 'edades': return generateEdades(isGolden);
        case 'cronometria_avanzada': return generateCronometria(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);
        default: return generateEdades(isGolden);
      }`;

code = code.replace(oldSwitch, newSwitch);

// Update level thresholds (17, 34, 51, 68, 85)
const oldLevels = `if (level < 20) return generateEdadesCronometria(isGolden);
      if (level < 40) return generateLogicaInferencial(isGolden);
      if (level < 60) return generateMezclasAleaciones(isGolden);
      if (level < 80) return generateMateFinanciera(isGolden);
      return generatePlanteoEcuaciones(isGolden);`;

const newLevels = `if (level < 17) return generateEdades(isGolden);
      if (level < 34) return generateCronometria(isGolden);
      if (level < 51) return generateLogicaInferencial(isGolden);
      if (level < 68) return generateMezclasAleaciones(isGolden);
      if (level < 85) return generateMateFinanciera(isGolden);
      return generatePlanteoEcuaciones(isGolden);`;

code = code.replace(oldLevels, newLevels);

fs.writeFileSync('src/utils/math.ts', code);
