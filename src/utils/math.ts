import { generatePlanteoEcuaciones, generateEdades, generateCronometria as generateCronometria5to, generateLogicaInferencial, generateMezclasAleaciones, generateMateFinanciera } from "./math_razonamiento_5to";
import { ProblemData } from '../types';
import { generatePropiedadesRT, generateResolucionTriangulos, generateAngulosVerticales, generateGeometriaAnalitica, generateAngulosPosicionNormal } from "./math_trigonometria";
import { generateRelacionesMetricas, generateAreasRegiones, generateSuperficiesCirculares, generateGeometriaEspacio, generateSolidos } from "./math_geometria_5to";
import { metodosBank } from './metodosBank';

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 1. Métodos Operativos Clásicos (Cangrejo / Rombo)
function generateMetodosOperativos(isGolden: boolean): ProblemData {
  const bankProblem = randChoice(metodosBank);
  return {
    ...bankProblem,
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + bankProblem.intro,
    isGolden
  };
}

// 2. Criptoaritmética
function generateCriptoaritmetica(isGolden: boolean): ProblemData {
  // A + B = C o A * B = C
  // Ejemplo: A2 + 3B = 75
  const A = randInt(1, 9);
  const B = randInt(1, 9);
  const sum = (A * 10 + 2) + (30 + B);
  
  const intro = `Reconstruye la siguiente suma:\n A2 + 3B = ${sum}\nHalla el valor de A + B.`;
  const visualData = {
    type: 'cripto',
    rows: [
      ['A', '2'],
      ['3', 'B']
    ],
    result: String(sum).split(''),
    operator: '+'
  };
  const expectedAnswer = String(A + B);
  const explanation = `Tenemos A2 + 3B = ${sum}.\nDescomponiendo: (10A + 2) + (30 + B) = ${sum}.\n10A + B = ${sum - 32}.\nSi A=${A} y B=${B}, entonces 10(${A}) + ${B} = ${10*A + B}. Por lo tanto, A+B = ${A+B}.`;

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer,
    unit: '',
    explanation,
    type: 'Criptoaritmética',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

// 3. Lógica Recreativa
function generateLogicaRecreativa(isGolden: boolean): ProblemData {
  const type = randChoice(['dias', 'parentesco']);
  let intro, expectedAnswer, explanation, visualData;

  if (type === 'dias') {
    // Si el ayer del mañana del pasado mañana es jueves, ¿qué día es hoy?
    // hoy = 0, ayer = -1, mañana = 1, pasado mañana = 2.
    // eq: -1 + 1 + 2 = 2 (pasado mañana). Si +2 es Jueves, hoy (0) es Martes.
    intro = "Si el ayer del mañana del pasado mañana de hoy es Jueves, ¿qué día de la semana fue el ayer de hoy? (Responde con el número de día de la semana, 1=Lunes, 7=Domingo)";
    visualData = {
      type: 'timeline',
      events: [
        { label: 'Ayer', offset: -1 },
        { label: 'Mañana', offset: 1 },
        { label: 'Pasado m.', offset: 2 }
      ],
      current: 'Jueves'
    };
    // Ayer = -1, mañana = 1, pasado mañana = 2 -> total = +2.
    // Hoy + 2 = Jueves(4) -> Hoy = Martes(2).
    // Ayer de hoy = Lunes(1).
    expectedAnswer = "1";
    explanation = "Ayer (-1) + mañana (+1) + pasado mañana (+2) = +2.\nEl día que está 2 días después de hoy es Jueves. Por lo tanto, hoy es Martes.\nEl ayer de hoy fue Lunes (Día 1).";
  } else {
    intro = "En una reunión familiar están presentes: un abuelo, una abuela, dos padres, dos madres, dos esposos, dos esposas, un suegro, una suegra, un nieto, y una nieta. ¿Cuál es la menor cantidad de personas presentes en dicha reunión?";
    visualData = {
      type: 'family',
      roles: ['Abuelo/a', 'Padres', 'Esposos/as', 'Suegros/as', 'Nietos/as']
    };
    expectedAnswer = "6";
    explanation = "Para minimizar el número de personas, buscamos personas que cumplan múltiples roles.\nLa estructura mínima es:\n- Primera generación: Abuelo y Abuela (esposos, padres, suegros).\n- Segunda generación: Hijo (del abuelo/abuela) y su Esposa (padres, esposos).\n- Tercera generación: Un hijo y una hija (nietos).\nTotal de personas: 2 + 2 + 2 = 6.";
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer,
    unit: '',
    explanation,
    type: 'Lógica Recreativa',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

// 4. Cronometría Básica
function generateCronometria(isGolden: boolean): ProblemData {
  // Un reloj da 5 campanadas en 12 segundos. ¿En cuántos segundos dará 10 campanadas?
  // Intervalos: 5 campanadas = 4 intervalos = 12s -> 1 intervalo = 3s.
  // 10 campanadas = 9 intervalos -> 9 * 3 = 27s.
  const camp1 = randInt(4, 7);
  const time1 = (camp1 - 1) * randInt(2, 4); // tiempo exacto divisible
  const camp2 = randInt(9, 12);
  const intLength = time1 / (camp1 - 1);
  const expected = (camp2 - 1) * intLength;

  const intro = `Un reloj de pared da ${camp1} campanadas en ${time1} segundos. ¿En cuántos segundos dará ${camp2} campanadas?`;
  const visualData = {
    type: 'clock',
    camp1,
    time1,
    camp2
  };
  const explanation = `Regla de campanadas: siempre hay que contar los "intervalos" entre campanadas.\n${camp1} campanadas tienen ${camp1 - 1} intervalos.\n${camp1 - 1} intervalos duran ${time1} segundos, así que cada intervalo dura ${intLength} segundos.\n${camp2} campanadas tienen ${camp2 - 1} intervalos.\nTiempo total = ${camp2 - 1} × ${intLength} = ${expected} segundos.`;

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Cronometría',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

// 5. Conteo de Figuras
function generateConteoFiguras(isGolden: boolean): ProblemData {
  // Segmentos en una línea: n(n+1)/2
  const n = randInt(4, 10);
  const expected = (n * (n + 1)) / 2;

  const intro = `En una recta se marcan ${n+1} puntos colineales consecutivos. ¿Cuál es el número total de segmentos que se pueden contar en dicha recta?`;
  const visualData = {
    type: 'segments',
    points: n + 1
  };
  const explanation = `Fórmula de conteo de segmentos por inducción: n(n+1)/2, donde n es el número de espacios simples.\nSi hay ${n+1} puntos, hay ${n} espacios simples.\nTotal = ${n} × ${n+1} / 2 = ${expected} segmentos.`;

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Conteo de Figuras',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}


export const generateMathProblem = (isGolden: boolean, topic: string | null = null, level: number = 0, course: string = 'razonamiento'): ProblemData => {
  if (topic) {
    if (course === 'razonamiento_5to') {
      switch (topic) {
        case 'edades': return generateEdades(isGolden);
        case 'cronometria_avanzada': return generateCronometria5to(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden, level);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);
        default: return generateEdades(isGolden);
      }
    } else if (course === 'geometria_5to') {
      switch (topic) {
        case 'relaciones_metricas': return generateRelacionesMetricas(isGolden);
        case 'areas_regiones': return generateAreasRegiones(isGolden);
        case 'superficies_circulares': return generateSuperficiesCirculares(isGolden);
        case 'geometria_espacio': return generateGeometriaEspacio(isGolden);
        case 'solidos_poliedros': return generateSolidos(isGolden);
        default: return generateRelacionesMetricas(isGolden);
      }
    } else if (course === 'geometria_5to') {
      if (level < 20) return generateRelacionesMetricas(isGolden);
      if (level < 40) return generateAreasRegiones(isGolden);
      if (level < 60) return generateSuperficiesCirculares(isGolden);
      if (level < 80) return generateGeometriaEspacio(isGolden);
      return generateSolidos(isGolden);
    } else if (course === 'trigonometria') {
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
    if (course === 'razonamiento_5to') {
      if (level < 17) return generateEdades(isGolden);
      if (level < 34) return generateCronometria5to(isGolden);
      if (level < 51) return generateLogicaInferencial(isGolden, level);
      if (level < 68) return generateMezclasAleaciones(isGolden);
      if (level < 85) return generateMateFinanciera(isGolden);
      return generatePlanteoEcuaciones(isGolden);
    } else if (course === 'trigonometria') {
      if (level < 20) return generatePropiedadesRT(isGolden);
      if (level < 40) return generateResolucionTriangulos(isGolden);
      if (level < 60) return generateAngulosVerticales(isGolden);
      if (level < 80) return generateGeometriaAnalitica(isGolden);
      return generateAngulosPosicionNormal(isGolden);
    } else if (course === 'geometria_5to') {
      if (level < 20) return generateRelacionesMetricas(isGolden);
      if (level < 40) return generateAreasRegiones(isGolden);
      if (level < 60) return generateSuperficiesCirculares(isGolden);
      if (level < 80) return generateGeometriaEspacio(isGolden);
      return generateSolidos(isGolden);
    } else {
      if (level < 20) return generateMetodosOperativos(isGolden);
      if (level < 40) return generateCriptoaritmetica(isGolden);
      if (level < 60) return generateLogicaRecreativa(isGolden);
      if (level < 80) return generateCronometria(isGolden);
      return generateConteoFiguras(isGolden);
    }
  }
};
