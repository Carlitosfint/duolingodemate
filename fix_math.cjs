const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

const originalSignature = `export const generateMathProblem = (isGolden: boolean, topic: string | null = null, level: number = 0): ProblemData => {
  if (topic) {
    switch (topic) {
      case 'metodos': return generateMetodosOperativos(isGolden);
      case 'cripto': return generateCriptoaritmetica(isGolden);
      case 'logica': return generateLogicaRecreativa(isGolden);
      case 'cronometria': return generateCronometria(isGolden);
      case 'conteo': return generateConteoFiguras(isGolden);
      default: return generateMetodosOperativos(isGolden);
    }
  } else {
    if (level < 20) return generateMetodosOperativos(isGolden);
    if (level < 40) return generateCriptoaritmetica(isGolden);
    if (level < 60) return generateLogicaRecreativa(isGolden);
    if (level < 80) return generateCronometria(isGolden);
    return generateConteoFiguras(isGolden);
  }
};`;

const newSignature = `export const generateMathProblem = (isGolden: boolean, topic: string | null = null, level: number = 0, course: string = 'razonamiento'): ProblemData => {
  if (topic) {
    if (course === 'trigonometria') {
      switch (topic) {
        case 'propiedades_rt': return generatePropiedadesRT(isGolden);
        case 'resolucion_triangulos': return generateResolucionTriangulos(isGolden);
        case 'angulos_verticales': return generateAngulosVerticales(isGolden);
        case 'geometria_analitica': return generateGeometriaAnalitica(isGolden);
        case 'angulos_posicion_normal': return generateAngulosPosicionNormal(isGolden);
        default: return generatePropiedadesRT(isGolden);
      }
    } else {
      switch (topic) {
        case 'metodos': return generateMetodosOperativos(isGolden);
        case 'cripto': return generateCriptoaritmetica(isGolden);
        case 'logica': return generateLogicaRecreativa(isGolden);
        case 'cronometria': return generateCronometria(isGolden);
        case 'conteo': return generateConteoFiguras(isGolden);
        default: return generateMetodosOperativos(isGolden);
      }
    }
  } else {
    if (course === 'trigonometria') {
      if (level < 20) return generatePropiedadesRT(isGolden);
      if (level < 40) return generateResolucionTriangulos(isGolden);
      if (level < 60) return generateAngulosVerticales(isGolden);
      if (level < 80) return generateGeometriaAnalitica(isGolden);
      return generateAngulosPosicionNormal(isGolden);
    } else {
      if (level < 20) return generateMetodosOperativos(isGolden);
      if (level < 40) return generateCriptoaritmetica(isGolden);
      if (level < 60) return generateLogicaRecreativa(isGolden);
      if (level < 80) return generateCronometria(isGolden);
      return generateConteoFiguras(isGolden);
    }
  }
};`;

code = code.replace(originalSignature, newSignature);
fs.writeFileSync('src/utils/math.ts', code);
