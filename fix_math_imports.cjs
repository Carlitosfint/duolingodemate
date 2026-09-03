const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

code = code.replace(
  /import \{ generatePlanteoAvanzado, generateEdadesCronometria, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera \} from "\.\/math_razonamiento_5to";/,
  `import { generatePlanteoEcuaciones, generateEdadesCronometria, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera } from "./math_razonamiento_5to";`
);

// Switch for specific topics
code = code.replace(
  /case 'planteo_avanzado': return generatePlanteoAvanzado\(isGolden\);/g,
  `case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);`
);

code = code.replace(
  /default: return generatePlanteoAvanzado\(isGolden\);/g,
  `default: return generatePlanteoEcuaciones(isGolden);`
);

// Switch block
const oldSwitch = `switch (topic) {
        case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);
        case 'edades_cronometria': return generateEdadesCronometria(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        default: return generatePlanteoEcuaciones(isGolden);
      }`;

const newSwitch = `switch (topic) {
        case 'edades_cronometria': return generateEdadesCronometria(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);
        default: return generateEdadesCronometria(isGolden);
      }`;

code = code.replace(oldSwitch, newSwitch);

// Level logic
const oldLevelLogic = `if (level < 20) return generatePlanteoAvanzado(isGolden);
      if (level < 40) return generateEdadesCronometria(isGolden);
      if (level < 60) return generateLogicaInferencial(isGolden);
      if (level < 80) return generateMezclasAleaciones(isGolden);
      return generateMateFinanciera(isGolden);`;

const newLevelLogic = `if (level < 20) return generateEdadesCronometria(isGolden);
      if (level < 40) return generateLogicaInferencial(isGolden);
      if (level < 60) return generateMezclasAleaciones(isGolden);
      if (level < 80) return generateMateFinanciera(isGolden);
      return generatePlanteoEcuaciones(isGolden);`;

code = code.replace(oldLevelLogic, newLevelLogic);
// Try another matching if first one missed it:
code = code.replace(
  /if \(level < 20\) return generatePlanteoAvanzado\(isGolden\);\s*if \(level < 40\) return generateEdadesCronometria\(isGolden\);\s*if \(level < 60\) return generateLogicaInferencial\(isGolden\);\s*if \(level < 80\) return generateMezclasAleaciones\(isGolden\);\s*return generateMateFinanciera\(isGolden\);/g,
  `if (level < 20) return generateEdadesCronometria(isGolden);
      if (level < 40) return generateLogicaInferencial(isGolden);
      if (level < 60) return generateMezclasAleaciones(isGolden);
      if (level < 80) return generateMateFinanciera(isGolden);
      return generatePlanteoEcuaciones(isGolden);`
);

fs.writeFileSync('src/utils/math.ts', code);
