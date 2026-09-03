const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

// Add import
code = code.replace(
  /import \{ generatePropiedadesRT, generateResolucionTriangulos, generateAngulosVerticales, generateGeometriaAnalitica, generateAngulosPosicionNormal \} from "\.\/math_trigonometria";/,
  `import { generatePropiedadesRT, generateResolucionTriangulos, generateAngulosVerticales, generateGeometriaAnalitica, generateAngulosPosicionNormal } from "./math_trigonometria";\nimport { generateRelacionesMetricas, generateAreasRegiones, generateSuperficiesCirculares, generateGeometriaEspacio, generateSolidos } from "./math_geometria_5to";`
);

// Switch for topic
const oldSwitchTrig = `} else if (course === 'trigonometria') {`;
const newSwitchGeom = `} else if (course === 'geometria_5to') {
      switch (topic) {
        case 'relaciones_metricas': return generateRelacionesMetricas(isGolden);
        case 'areas_regiones': return generateAreasRegiones(isGolden);
        case 'superficies_circulares': return generateSuperficiesCirculares(isGolden);
        case 'geometria_espacio': return generateGeometriaEspacio(isGolden);
        case 'solidos_poliedros': return generateSolidos(isGolden);
        default: return generateRelacionesMetricas(isGolden);
      }
    } else if (course === 'trigonometria') {`;

code = code.replace(oldSwitchTrig, newSwitchGeom);

// Levels
const oldLevelsTrig = `} else if (course === 'trigonometria') {`;
const newLevelsGeom = `} else if (course === 'geometria_5to') {
      if (level < 20) return generateRelacionesMetricas(isGolden);
      if (level < 40) return generateAreasRegiones(isGolden);
      if (level < 60) return generateSuperficiesCirculares(isGolden);
      if (level < 80) return generateGeometriaEspacio(isGolden);
      return generateSolidos(isGolden);
    } else if (course === 'trigonometria') {`;

code = code.replace(oldLevelsTrig, newLevelsGeom);

fs.writeFileSync('src/utils/math.ts', code);
