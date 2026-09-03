const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

code = `import { generatePlanteoAvanzado, generateEdadesCronometria, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera } from "./math_razonamiento_5to";\n` + code;

const sigRegex = /if \(course === 'trigonometria'\) \{/g;
const replacement = `if (course === 'razonamiento_5to') {
      switch (topic) {
        case 'planteo_avanzado': return generatePlanteoAvanzado(isGolden);
        case 'edades_cronometria': return generateEdadesCronometria(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        default: return generatePlanteoAvanzado(isGolden);
      }
    } else if (course === 'trigonometria') {`;

code = code.replace(sigRegex, replacement);

const levelRegex = /if \(course === 'trigonometria'\) \{\s*if \(level < 20\) return generatePropiedadesRT\(isGolden\);/g;
const levelRep = `if (course === 'razonamiento_5to') {
      if (level < 20) return generatePlanteoAvanzado(isGolden);
      if (level < 40) return generateEdadesCronometria(isGolden);
      if (level < 60) return generateLogicaInferencial(isGolden);
      if (level < 80) return generateMezclasAleaciones(isGolden);
      return generateMateFinanciera(isGolden);
    } else if (course === 'trigonometria') {
      if (level < 20) return generatePropiedadesRT(isGolden);`;

code = code.replace(levelRegex, levelRep);

fs.writeFileSync('src/utils/math.ts', code);
