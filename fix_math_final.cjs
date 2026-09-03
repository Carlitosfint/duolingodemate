const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

const regexToReplace = /if \(course === 'razonamiento_5to'\) \{\s*switch \(topic\) \{\s*case 'planteo_avanzado': return generatePlanteoAvanzado\(isGolden\);\s*case 'edades_cronometria': return generateEdadesCronometria\(isGolden\);\s*case 'logica_inferencial': return generateLogicaInferencial\(isGolden\);\s*case 'mezclas_aleaciones': return generateMezclasAleaciones\(isGolden\);\s*case 'matematica_financiera': return generateMateFinanciera\(isGolden\);\s*default: return generatePlanteoAvanzado\(isGolden\);\s*\}\s*\} else if \(course === 'razonamiento_5to'\) \{\s*if \(level < 20\) return generatePlanteoAvanzado\(isGolden\);\s*if \(level < 40\) return generateEdadesCronometria\(isGolden\);\s*if \(level < 60\) return generateLogicaInferencial\(isGolden\);\s*if \(level < 80\) return generateMezclasAleaciones\(isGolden\);\s*return generateMateFinanciera\(isGolden\);\s*\} else if \(course === 'trigonometria'\) \{/g;

const correctCode = `if (course === 'razonamiento_5to') {
      if (level < 20) return generatePlanteoAvanzado(isGolden);
      if (level < 40) return generateEdadesCronometria(isGolden);
      if (level < 60) return generateLogicaInferencial(isGolden);
      if (level < 80) return generateMezclasAleaciones(isGolden);
      return generateMateFinanciera(isGolden);
    } else if (course === 'trigonometria') {`;

code = code.replace(regexToReplace, correctCode);
fs.writeFileSync('src/utils/math.ts', code);
