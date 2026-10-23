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

// ==========================================
// RM BÁSICO - III BIMESTRE
// ==========================================

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
  const camp1 = randInt(4, 7);
  const time1 = (camp1 - 1) * randInt(2, 4);
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

// ==========================================
// RM BÁSICO - IV BIMESTRE
// ==========================================

// 6. Sucesiones y Analogías
function generateSucesionesRM(isGolden: boolean): ProblemData {
  const a1 = randInt(3, 12);
  const d0 = randInt(2, 6);
  const step = randInt(2, 4);
  // 2nd order sequence: t_n
  const terms = [a1];
  let curr = a1;
  let diff = d0;
  for (let i = 1; i < 6; i++) {
    curr += diff;
    terms.push(curr);
    diff += step;
  }
  const ans = terms[5];
  const shown = terms.slice(0, 5).join('; ');
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Halla el término que continúa en la siguiente sucesión numérica:\n${shown}; x`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Analizamos las diferencias entre términos consecutivos:\n+${d0}, +${d0 + step}, +${d0 + 2 * step}, +${d0 + 3 * step}...\nLa razón aumenta de ${step} en ${step}. El siguiente incremento es +${d0 + 4 * step}.\nPor lo tanto: x = ${terms[4]} + ${d0 + 4 * step} = ${ans}.`,
    type: 'Sucesiones y Analogías',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// 7. Series y Sumatorias
function generateSeriesRM(isGolden: boolean): ProblemData {
  const n = randInt(12, 25);
  const sum = (n * (n + 1)) / 2;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Calcula el valor de la siguiente serie notable:\nS = 1 + 2 + 3 + 4 + ... + ${n}`,
    expectedAnswer: String(sum),
    unit: '',
    explanation: `Usamos la fórmula de Gauss para la suma de los primeros n números naturales:\nS = n(n + 1) / 2\nPara n = ${n}: S = ${n} × ${n + 1} / 2 = ${sum}.`,
    type: 'Series y Sumatorias',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// 8. Operadores Matemáticos
function generateOperadoresRM(isGolden: boolean): ProblemData {
  const k1 = randInt(2, 5);
  const k2 = randInt(1, 4);
  const a = randInt(3, 8);
  const b = randInt(2, 7);
  const ans = k1 * a + k2 * b;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Se define el operador matemático (a # b) mediante la regla:\na # b = ${k1}a + ${k2}b\nCalcula el valor de: ${a} # ${b}`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Reemplazamos a = ${a} y b = ${b} en la ley de formación:\n${a} # ${b} = ${k1}(${a}) + ${k2}(${b}) = ${k1 * a} + ${k2 * b} = ${ans}.`,
    type: 'Operadores Matemáticos',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// 9. Fracciones y Porcentajes (RM Básico)
function generateFraccionesRM(isGolden: boolean): ProblemData {
  const base = randInt(2, 9) * 100;
  const pct = randChoice([15, 20, 25, 30, 40]);
  const ans = (base * pct) / 100;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `De un presupuesto escolar de S/ ${base}, se destina el ${pct}% para materiales de laboratorio. ¿Cuántos soles se destinaron a laboratorio?`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Calculamos el ${pct}% de ${base}:\n(${pct} / 100) × ${base} = ${pct} × ${base / 100} = ${ans}.`,
    type: 'Fracciones y Porcentajes',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// 10. Certezas y Principios de Conteo
function generateCertezasRM(isGolden: boolean): ProblemData {
  const rojas = randInt(5, 9);
  const azules = randInt(4, 8);
  const verdes = randInt(3, 7);
  const ans = rojas + azules + 1;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `En una urna oscura hay ${rojas} esferas rojas, ${azules} azules y ${verdes} verdes. ¿Cuántas esferas se deben extraer al azar y como mínimo para tener la certeza de haber obtenido al menos una esfera verde?`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `En problemas de certezas nos ponemos en el "peor de los casos": primero salen todas las esferas que NO son verdes (todas las rojas y todas las azules).\nPeor caso = ${rojas} (rojas) + ${azules} (azules) + 1 (verde segura) = ${ans}.`,
    type: 'Certezas y Conteo',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// ==========================================
// RM 5TO - IV BIMESTRE
// ==========================================

function generateAnalisisCombinatorio(isGolden: boolean): ProblemData {
  const n = randInt(5, 8);
  // C(n, 2) o P(n)
  const mode = randChoice(['comb', 'perm']);
  if (mode === 'comb') {
    const ans = (n * (n - 1)) / 2;
    return {
      intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `En un comité estudiantil de ${n} candidatos, se desea elegir una comisión de 2 representantes sin importar el cargo. ¿De cuántas maneras diferentes se puede formar dicha comisión?`,
      expectedAnswer: String(ans),
      unit: '',
      explanation: `Como no importa el orden, usamos Combinación: C(${n}, 2) = (${n} × ${n - 1}) / 2 = ${ans} maneras.`,
      type: 'Análisis Combinatorio',
      isGolden,
      mathData: [],
      hintsType: 'numeric'
    };
  } else {
    const k = randInt(4, 6);
    let fact = 1;
    for (let i = 2; i <= k - 1; i++) fact *= i;
    return {
      intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `¿De cuántas maneras distintas pueden sentarse ${k} amigos alrededor de una mesa circular con ${k} asientos simétricamente distribuidos?`,
      expectedAnswer: String(fact),
      unit: '',
      explanation: `Aplicamos Permutación Circular: PC(${k}) = (${k} - 1)! = ${k - 1}! = ${fact} maneras.`,
      type: 'Análisis Combinatorio',
      isGolden,
      mathData: [],
      hintsType: 'numeric'
    };
  }
}

function generateProbabilidades5to(isGolden: boolean): ProblemData {
  const sumTarget = randChoice([7, 8, 9]);
  const favMap: Record<number, number> = { 7: 6, 8: 5, 9: 4 };
  const fav = favMap[sumTarget];
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Al lanzar dos dados convencionales simultáneamente sobre una mesa, ¿cuántos casos favorables existen de que la suma de los puntos obtenidos sea exactamente ${sumTarget}?`,
    expectedAnswer: String(fav),
    unit: '',
    explanation: `El espacio muestral tiene 36 resultados posibles. Los pares ordenados que suman ${sumTarget} son exactamente ${fav} casos favorables.`,
    type: 'Probabilidades',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateSucesionesSeries5to(isGolden: boolean): ProblemData {
  const n = randInt(6, 12);
  const ans = (n * (n + 1) * (2 * n + 1)) / 6;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Calcula la suma de los primeros ${n} cuadrados perfectos:\nS = 1² + 2² + 3² + ... + ${n}²`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Por suma notable de cuadrados:\nS = n(n + 1)(2n + 1) / 6\nS = ${n}(${n + 1})(${2 * n + 1}) / 6 = ${ans}.`,
    type: 'Sucesiones y Series',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateLogaritmosRM(isGolden: boolean): ProblemData {
  const base = randChoice([2, 3, 5]);
  const exp1 = randInt(2, 4);
  const exp2 = randInt(1, 3);
  const val1 = Math.pow(base, exp1);
  const val2 = Math.pow(base, exp2);
  const ans = exp1 + exp2;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Utilizando propiedades de logaritmos, determina el valor de E:\nE = log_${base}(${val1}) + log_${base}(${val2})`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Como ${val1} = ${base}^${exp1} y ${val2} = ${base}^${exp2}:\nlog_${base}(${val1}) = ${exp1} y log_${base}(${val2}) = ${exp2}.\nEntonces E = ${exp1} + ${exp2} = ${ans}.`,
    type: 'Operadores y Logaritmos',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateMaximosMinimos5to(isGolden: boolean): ProblemData {
  const h = randInt(3, 8);
  const k = randInt(10, 25);
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Halla el valor mínimo que puede tomar la expresión cuadrática:\nP(x) = (x - ${h})² + ${k}\npara cualquier número real x.`,
    expectedAnswer: String(k),
    unit: '',
    explanation: `Todo cuadrado perfecto en los reales cumple (x - ${h})² ≥ 0.\nEl valor mínimo se alcanza cuando x = ${h}, haciendo cero el paréntesis.\nPor lo tanto, P_mín = 0 + ${k} = ${k}.`,
    type: 'Máximos y Mínimos',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateSuficienciaDatos5to(isGolden: boolean): ProblemData {
  const sum = randInt(20, 40);
  const diff = randInt(4, 12);
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Se desea calcular el valor numérico de "x".\nInformación I: x + y = ${sum}\nInformación II: x - y = ${diff}\nMarca: 1 (I sola), 2 (II sola), 3 (Ambas I y II juntas), 4 (Cada una por separado), 5 (Faltan datos).`,
    expectedAnswer: "3",
    unit: '',
    explanation: `Con una sola ecuación y dos incógnitas no se puede hallar x de forma única.\nAl usar ambas informaciones (I y II juntas) tenemos un sistema lineal 2×2 compatible determinado. Respuesta correcta: 3.`,
    type: 'Suficiencia de Datos',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// ==========================================
// TRIGONOMETRÍA - IV BIMESTRE
// ==========================================

function generateReduccionPrimerCuadrante(isGolden: boolean): ProblemData {
  const choice = randChoice([
    { expr: '180° · sen(150°)', ans: 90, exp: 'sen(150°) = sen(180° - 30°) = sen(30°) = 1/2. Multiplicado por 180 resulta 90.' },
    { expr: '100 · tg(135°) + 150', ans: 50, exp: 'tg(135°) = -tg(45°) = -1. Entonces 100(-1) + 150 = 50.' },
    { expr: '60 · cos(120°) + 80', ans: 50, exp: 'cos(120°) = -cos(60°) = -1/2. Entonces 60(-1/2) + 80 = 50.' },
    { expr: '25 · sec(180°) + 45', ans: 20, exp: 'sec(180°) = -1. Entonces 25(-1) + 45 = 20.' }
  ]);
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Reduce al primer cuadrante y calcula el valor numérico de:\nE = ${choice.expr}`,
    expectedAnswer: String(choice.ans),
    unit: '',
    explanation: choice.exp,
    type: 'Reducción al 1er Cuadrante',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateCircunferenciaTrigonometrica(isGolden: boolean): ProblemData {
  const a = randInt(3, 8);
  const b = randInt(5, 15);
  const maxVal = a + b;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `En la Circunferencia Trigonométrica (C.T.), si θ pertenece a los reales, halla el máximo valor de:\nM = ${a}·sen(θ) + ${b}`,
    expectedAnswer: String(maxVal),
    unit: '',
    explanation: `En toda la C.T. se cumple que -1 ≤ sen(θ) ≤ 1.\nEl máximo valor ocurre cuando sen(θ) = 1:\nM_máx = ${a}(1) + ${b} = ${maxVal}.`,
    type: 'Circunferencia Trigonométrica',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateIdentidadesTrigonometricas(isGolden: boolean): ProblemData {
  const k = randInt(4, 18);
  const m = randInt(2, 12);
  const ans = k + m;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Simplifica utilizando identidades pitagóricas:\nE = ${k}·sen²(x) + ${k}·cos²(x) + ${m}`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Factorizamos ${k}: E = ${k}(sen²x + cos²x) + ${m}.\nPor identidad pitagórica fundamental, sen²x + cos²x = 1.\nEntonces E = ${k}(1) + ${m} = ${ans}.`,
    type: 'Identidades Trigonométricas',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateAngulosCompuestos(isGolden: boolean): ProblemData {
  const k = randInt(2, 9);
  const ans = k * 1; // tg(45) = 1
  const a = randInt(10, 35);
  const b = 45 - a;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Sabiendo que α = ${a}° y β = ${b}°, calcula el valor de:\nP = ${k} · [ (tg α + tg β) / (1 - tg α · tg β) ]`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `La expresión entre corchetes corresponde al desarrollo de tg(α + β).\nComo α + β = ${a}° + ${b}° = 45°, tenemos tg(45°) = 1.\nPor lo tanto, P = ${k} × 1 = ${ans}.`,
    type: 'Ángulos Compuestos',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateAnguloDoble(isGolden: boolean): ProblemData {
  const mult = randInt(2, 8) * 10;
  // 2 sen(15) cos(15) = sen(30) = 1/2
  const ans = mult / 2;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Aplica la identidad del seno del ángulo doble para calcular:\nR = ${mult} · (2 · sen 15° · cos 15°)`,
    expectedAnswer: String(ans),
    unit: '',
    explanation: `Por identidad del ángulo doble: 2·sen(x)·cos(x) = sen(2x).\nPara x = 15°: 2·sen(15°)·cos(15°) = sen(30°) = 1/2.\nEntonces R = ${mult} × (1/2) = ${ans}.`,
    type: 'Ángulo Doble y Mitad',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

// ==========================================
// GEOMETRÍA 5TO - IV BIMESTRE
// ==========================================

function generatePrismaCilindro(isGolden: boolean): ProblemData {
  const r = randInt(2, 6);
  const h = randInt(5, 12);
  const volSinPi = r * r * h;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Un cilindro circular recto tiene un radio de base r = ${r} m y una generatriz (altura) h = ${h} m. Si su volumen es V = k·π m³, halla el valor de k.`,
    expectedAnswer: String(volSinPi),
    unit: '',
    explanation: `El volumen de un cilindro recto es V = π · r² · h.\nReemplazando: V = π · (${r})² · (${h}) = ${volSinPi}π m³.\nPor lo tanto, k = ${volSinPi}.`,
    type: 'Prisma y Cilindro',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generatePiramideCono(isGolden: boolean): ProblemData {
  const bArea = randInt(3, 10) * 3;
  const h = randInt(4, 12);
  const vol = (bArea * h) / 3;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Una pirámide regular tiene un área de base igual a ${bArea} cm² y una altura de ${h} cm. Calcula su volumen en cm³.`,
    expectedAnswer: String(vol),
    unit: 'cm³',
    explanation: `El volumen de toda pirámide es V = (Área_base × altura) / 3.\nV = (${bArea} × ${h}) / 3 = ${vol} cm³.`,
    type: 'Pirámide y Cono',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateEsferaTeoremas(isGolden: boolean): ProblemData {
  const r = randInt(2, 7);
  const areaCoef = 4 * r * r;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Calcula el área de la superficie esférica de una esfera de radio R = ${r} u. Si la respuesta es A = k·π u², indica el valor de k.`,
    expectedAnswer: String(areaCoef),
    unit: '',
    explanation: `El área de la superficie esférica es A = 4 · π · R².\nPara R = ${r}: A = 4 · π · (${r})² = ${areaCoef}π u².\nPor lo tanto, k = ${areaCoef}.`,
    type: 'Esfera y Pappus-Guldin',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateRectaCircunferencia(isGolden: boolean): ProblemData {
  const h = randInt(1, 5);
  const k = randInt(2, 6);
  const r = randInt(3, 9);
  const r2 = r * r;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Dada la ecuación ordinaria de la circunferencia:\n(x - ${h})² + (y + ${k})² = ${r2}\nCalcula la suma de la longitud de su radio más la abscisa de su centro.`,
    expectedAnswer: String(r + h),
    unit: '',
    explanation: `De la ecuación (x - h)² + (y - k)² = R²:\nLa abscisa del centro es h = ${h} y el radio es R = √${r2} = ${r}.\nSuma = ${r} + ${h} = ${r + h}.`,
    type: 'Recta y Circunferencia',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

function generateParabolaElipse(isGolden: boolean): ProblemData {
  const p = randInt(2, 9);
  const ladoRecto = 4 * p;
  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + `Una parábola con vértice en el origen tiene como parámetro focal p = ${p}. ¿Cuál es la longitud de su Lado Recto (LR = |4p|)?`,
    expectedAnswer: String(ladoRecto),
    unit: '',
    explanation: `En toda parábola, la longitud del Lado Recto equivale a |4p|.\nComo p = ${p}, entonces LR = 4 × ${p} = ${ladoRecto}.`,
    type: 'Parábola y Elipse',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export const generateMathProblem = (isGolden: boolean, topic: string | null = null, level: number = 0, course: string = 'razonamiento'): ProblemData => {
  if (topic) {
    if (course === 'razonamiento_5to') {
      switch (topic) {
        // III Bimestre
        case 'edades': return generateEdades(isGolden);
        case 'cronometria_avanzada': return generateCronometria5to(isGolden);
        case 'logica_inferencial': return generateLogicaInferencial(isGolden, level);
        case 'mezclas_aleaciones': return generateMezclasAleaciones(isGolden);
        case 'matematica_financiera': return generateMateFinanciera(isGolden);
        case 'planteo_ecuaciones': return generatePlanteoEcuaciones(isGolden);
        // IV Bimestre
        case 'analisis_combinatorio': return generateAnalisisCombinatorio(isGolden);
        case 'probabilidades': return generateProbabilidades5to(isGolden);
        case 'sucesiones_series_5to': return generateSucesionesSeries5to(isGolden);
        case 'logaritmos_rm': return generateLogaritmosRM(isGolden);
        case 'maximos_minimos': return generateMaximosMinimos5to(isGolden);
        case 'suficiencia_datos': return generateSuficienciaDatos5to(isGolden);
        default: return generateEdades(isGolden);
      }
    } else if (course === 'geometria_5to') {
      switch (topic) {
        // III Bimestre
        case 'relaciones_metricas': return generateRelacionesMetricas(isGolden);
        case 'areas_regiones': return generateAreasRegiones(isGolden);
        case 'superficies_circulares': return generateSuperficiesCirculares(isGolden);
        case 'geometria_espacio': return generateGeometriaEspacio(isGolden);
        case 'solidos_poliedros': return generateSolidos(isGolden);
        // IV Bimestre
        case 'prisma_cilindro': return generatePrismaCilindro(isGolden);
        case 'piramide_cono': return generatePiramideCono(isGolden);
        case 'esfera_teoremas': return generateEsferaTeoremas(isGolden);
        case 'recta_circunferencia': return generateRectaCircunferencia(isGolden);
        case 'parabola_elipse': return generateParabolaElipse(isGolden);
        default: return generateRelacionesMetricas(isGolden);
      }
    } else if (course === 'trigonometria') {
      switch (topic) {
        // III Bimestre
        case 'propiedades_rt': return generatePropiedadesRT(isGolden);
        case 'resolucion_triangulos': return generateResolucionTriangulos(isGolden);
        case 'angulos_verticales': return generateAngulosVerticales(isGolden);
        case 'geometria_analitica': return generateGeometriaAnalitica(isGolden);
        case 'angulos_posicion_normal': return generateAngulosPosicionNormal(isGolden);
        // IV Bimestre
        case 'reduccion_primer_cuadrante': return generateReduccionPrimerCuadrante(isGolden);
        case 'circunferencia_trigonometrica': return generateCircunferenciaTrigonometrica(isGolden);
        case 'identidades_trigonometricas': return generateIdentidadesTrigonometricas(isGolden);
        case 'angulos_compuestos': return generateAngulosCompuestos(isGolden);
        case 'angulo_doble': return generateAnguloDoble(isGolden);
        default: return generatePropiedadesRT(isGolden);
      }
    } else {
      switch (topic) {
        // III Bimestre
        case 'metodos': return generateMetodosOperativos(isGolden);
        case 'cripto': return generateCriptoaritmetica(isGolden);
        case 'logica': return generateLogicaRecreativa(isGolden);
        case 'cronometria': return generateCronometria(isGolden);
        case 'conteo': return generateConteoFiguras(isGolden);
        // IV Bimestre
        case 'sucesiones': return generateSucesionesRM(isGolden);
        case 'series': return generateSeriesRM(isGolden);
        case 'operadores': return generateOperadoresRM(isGolden);
        case 'fracciones_rm': return generateFraccionesRM(isGolden);
        case 'certezas': return generateCertezasRM(isGolden);
        default: return generateMetodosOperativos(isGolden);
      }
    }
  } else {
    // Mapa Principal (0-49: III Bimestre, 50-99: IV Bimestre)
    if (course === 'razonamiento_5to') {
      if (level < 9) return generateEdades(isGolden);
      if (level < 17) return generateCronometria5to(isGolden);
      if (level < 25) return generateLogicaInferencial(isGolden, level);
      if (level < 33) return generateMezclasAleaciones(isGolden);
      if (level < 42) return generateMateFinanciera(isGolden);
      if (level < 50) return generatePlanteoEcuaciones(isGolden);
      if (level < 58) return generateAnalisisCombinatorio(isGolden);
      if (level < 67) return generateProbabilidades5to(isGolden);
      if (level < 75) return generateSucesionesSeries5to(isGolden);
      if (level < 83) return generateLogaritmosRM(isGolden);
      if (level < 92) return generateMaximosMinimos5to(isGolden);
      return generateSuficienciaDatos5to(isGolden);
    } else if (course === 'trigonometria') {
      if (level < 10) return generatePropiedadesRT(isGolden);
      if (level < 20) return generateResolucionTriangulos(isGolden);
      if (level < 30) return generateAngulosVerticales(isGolden);
      if (level < 40) return generateGeometriaAnalitica(isGolden);
      if (level < 50) return generateAngulosPosicionNormal(isGolden);
      if (level < 60) return generateReduccionPrimerCuadrante(isGolden);
      if (level < 70) return generateCircunferenciaTrigonometrica(isGolden);
      if (level < 80) return generateIdentidadesTrigonometricas(isGolden);
      if (level < 90) return generateAngulosCompuestos(isGolden);
      return generateAnguloDoble(isGolden);
    } else if (course === 'geometria_5to') {
      if (level < 10) return generateRelacionesMetricas(isGolden);
      if (level < 20) return generateAreasRegiones(isGolden);
      if (level < 30) return generateSuperficiesCirculares(isGolden);
      if (level < 40) return generateGeometriaEspacio(isGolden);
      if (level < 50) return generateSolidos(isGolden);
      if (level < 60) return generatePrismaCilindro(isGolden);
      if (level < 70) return generatePiramideCono(isGolden);
      if (level < 80) return generateEsferaTeoremas(isGolden);
      if (level < 90) return generateRectaCircunferencia(isGolden);
      return generateParabolaElipse(isGolden);
    } else {
      if (level < 10) return generateMetodosOperativos(isGolden);
      if (level < 20) return generateCriptoaritmetica(isGolden);
      if (level < 30) return generateLogicaRecreativa(isGolden);
      if (level < 40) return generateCronometria(isGolden);
      if (level < 50) return generateConteoFiguras(isGolden);
      if (level < 60) return generateSucesionesRM(isGolden);
      if (level < 70) return generateSeriesRM(isGolden);
      if (level < 80) return generateOperadoresRM(isGolden);
      if (level < 90) return generateFraccionesRM(isGolden);
      return generateCertezasRM(isGolden);
    }
  }
};
