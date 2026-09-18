import { ProblemData } from '../types';

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePropiedadesRT(isGolden: boolean): ProblemData {
  // Identidades recíprocas (sen * csc = 1, cos * sec = 1, tan * cot = 1)
  // o co-razones (sen(x) = cos(y) => x+y=90)
  const isReciprocal = Math.random() > 0.5;
  let intro, expected, explanation;
  const factor = isGolden ? rnd(2, 5) : 1;

  if (isReciprocal) {
    // ej: tan(3x) * cot(x + 40) = 1 => 3x = x + 40 => 2x = 40 => x = 20
    const x = rnd(10, 30); // x is integer
    const eqType = rnd(0, 2);
    const names = [
      ['sen', 'csc'],
      ['cos', 'sec'],
      ['tan', 'cot']
    ];
    const [rt1, rt2] = names[eqType];
    
    // a = x * mult1, b = x * mult1 (since a = b)
    const offset = rnd(10, 40);
    const a = (x * 2) + offset;
    const b = (x * 2) + offset;
    
    // We want to ask for x.
    // eq: rt1(3x) * rt2(x + offset) = 1 => 3x = x + offset => 2x = offset => x = offset/2
    const offset2 = rnd(10, 40) * 2; // even
    const ansX = offset2 / 2;
    
    intro = `Si se cumple que ${rt1}(3x) · ${rt2}(x + ${offset2}°) = 1. Calcula el valor de x.`;
    expected = ansX;
    explanation = `Por propiedades de las razones trigonométricas recíprocas, si ${rt1}(A) · ${rt2}(B) = 1, entonces A = B. Por lo tanto, 3x = x + ${offset2}° => 2x = ${offset2}° => x = ${ansX}.`;
    
    if (isGolden) {
        intro += ` Luego, calcula ${factor}x.`;
        expected = ansX * factor;
        explanation += ` Entonces, ${factor}x = ${expected}.`;
    }
  } else {
    // co-razones: sen(A) = cos(B) => A+B=90
    const names = [
      ['sen', 'cos'],
      ['tan', 'cot'],
      ['sec', 'csc']
    ];
    const eqType = rnd(0, 2);
    const [rt1, rt2] = names[eqType];
    
    const ansX = rnd(10, 30);
    // A + B = 90
    // (2x + 10) + (x + 20) = 90 => 3x + 30 = 90 => 3x = 60 => x = 20
    const term1_x = rnd(1, 2);
    const term2_x = rnd(1, 2);
    const total_x = term1_x + term2_x; // 2 to 4
    
    const max_sum = 90 - (total_x * 10);
    const sum_const = rnd(10, max_sum);
    // make sure sum_const makes x integer => (90 - sum_const) % total_x == 0
    let valid_sum = sum_const;
    while ((90 - valid_sum) % total_x !== 0) valid_sum++;
    
    const final_x = (90 - valid_sum) / total_x;
    
    const c1 = rnd(1, valid_sum - 1);
    const c2 = valid_sum - c1;
    
    intro = `Si se cumple que ${rt1}(${term1_x === 1 ? '' : term1_x}x + ${c1}°) = ${rt2}(${term2_x === 1 ? '' : term2_x}x + ${c2}°). Calcula x.`;
    expected = final_x;
    explanation = `Por ángulos complementarios (co-razones), si ${rt1}(A) = ${rt2}(B), entonces A + B = 90°. Por lo tanto, (${term1_x}x + ${c1}) + (${term2_x}x + ${c2}) = 90 => ${total_x}x + ${valid_sum} = 90 => ${total_x}x = ${90-valid_sum} => x = ${final_x}.`;
    
    if (isGolden) {
        intro += ` Luego, calcula ${factor}x.`;
        expected = final_x * factor;
        explanation += ` Entonces, ${factor}x = ${expected}.`;
    }
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Propiedades de las RT',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateResolucionTriangulos(isGolden: boolean): ProblemData {
  const k = rnd(2, 10);
  const angles = [30, 45, 60, 37, 53];
  const angle = angles[rnd(0, angles.length - 1)];
  
  let expected, intro, explanation;
  
  if (angle === 45) {
    // catetos k, hip k*sqrt(2)
    intro = `En un triángulo rectángulo, un ángulo agudo mide 45° y un cateto mide ${k}. ¿Cuál es la longitud del otro cateto?`;
    expected = k;
    explanation = `En un triángulo notable de 45°, los catetos son iguales. Si uno mide ${k}, el otro también mide ${k}.`;
  } else if (angle === 30) {
    // cateto opuesto k, hip 2k
    intro = `En un triángulo rectángulo, la hipotenusa mide ${2*k} y un ángulo mide 30°. ¿Cuánto mide el cateto opuesto a dicho ángulo?`;
    expected = k;
    explanation = `En un triángulo de 30° y 60°, el cateto opuesto a 30° es la mitad de la hipotenusa. Mitad de ${2*k} = ${k}.`;
  } else if (angle === 60) {
    intro = `En un triángulo rectángulo, un ángulo mide 60° y su cateto adyacente mide ${k}. ¿Cuánto mide la hipotenusa?`;
    expected = 2*k;
    explanation = `En un triángulo de 30° y 60°, la hipotenusa es el doble del cateto adyacente a 60°. Doble de ${k} = ${2*k}.`;
  } else if (angle === 37) {
    intro = `En un triángulo rectángulo, la hipotenusa mide ${5*k} y un ángulo mide 37°. ¿Cuánto mide el cateto opuesto a dicho ángulo?`;
    expected = 3*k;
    explanation = `En un triángulo notable de 37° y 53°, los lados son proporcionales a 3, 4 y 5. El opuesto a 37° es 3k. Si 5k = ${5*k} => k = ${k}. Entonces 3k = ${3*k}.`;
  } else { // 53
    intro = `En un triángulo rectángulo, el cateto opuesto a 53° mide ${4*k}. ¿Cuánto mide la hipotenusa?`;
    expected = 5*k;
    explanation = `En el triángulo de 37° y 53°, el opuesto a 53° es 4k. Si 4k = ${4*k} => k = ${k}. La hipotenusa es 5k = ${5*k}.`;
  }
  
  if (isGolden) {
      intro += ` Multiplica el resultado por 2.`;
      expected *= 2;
      explanation += ` Finalmente, multiplicado por 2 es ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Resolución de Triángulos',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateAngulosVerticales(isGolden: boolean): ProblemData {
  const h = rnd(10, 50) * 3; // mult of 3 just in case
  const d = h; // 45 degrees
  
  let intro = `Desde un punto en tierra ubicado a ${d}m de la base de una torre, se observa su parte más alta con un ángulo de elevación de 45°. ¿Cuál es la altura de la torre (en metros)?`;
  let expected = h;
  let explanation = `Si el ángulo de elevación es 45°, se forma un triángulo rectángulo isósceles. Por lo tanto, la altura de la torre es igual a la distancia horizontal, es decir, ${h}m.`;
  
  const v = rnd(0, 1);
  if (v === 1) {
    const k = rnd(5, 20);
    intro = `Una persona observa la parte superior de un poste con un ángulo de elevación de 37°. Si la distancia de la persona a la base del poste es ${4*k}m, ¿cuál es la altura del poste en metros? (Ignora la altura de la persona).`;
    expected = 3*k;
    explanation = `Formamos un triángulo de 37°-53°. La distancia horizontal (cateto adyacente a 37°) es 4k = ${4*k} => k=${k}. La altura es el cateto opuesto a 37°, que es 3k = ${3*k}m.`;
  }
  
  if (isGolden) {
      intro += ` Suma 10 al resultado.`;
      expected += 10;
      explanation += ` Finalmente, sumando 10 da ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: 'm',
    explanation,
    type: 'Ángulos Verticales',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateGeometriaAnalitica(isGolden: boolean): ProblemData {
  // Punto medio or distance (axis-aligned or easy hypotenuse)
  const isMidpoint = Math.random() > 0.5;
  let intro, expected, explanation;
  
  if (isMidpoint) {
    const x1 = rnd(-10, 10);
    const y1 = rnd(-10, 10);
    const x2 = rnd(-10, 10);
    const y2 = rnd(-10, 10);
    const xm = (x1 + x2) / 2;
    const ym = (y1 + y2) / 2;
    
    intro = `Calcula la suma de coordenadas (X + Y) del punto medio del segmento cuyos extremos son A(${x1}; ${y1}) y B(${x2}; ${y2}).`;
    expected = xm + ym;
    explanation = `El punto medio M tiene coordenadas Xm = (${x1} + ${x2})/2 = ${xm} e Ym = (${y1} + ${y2})/2 = ${ym}. La suma es ${xm} + ${ym} = ${expected}.`;
  } else {
    // Distance (easy pythagorean triple)
    const base = [3, 5, 8, 7][rnd(0,3)];
    const height = base === 3 ? 4 : (base === 5 ? 12 : (base === 8 ? 15 : 24));
    
    const x1 = rnd(0, 10);
    const y1 = rnd(0, 10);
    const x2 = x1 + base;
    const y2 = y1 + height;
    
    const d = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    
    intro = `Calcula la distancia entre los puntos P(${x1}; ${y1}) y Q(${x2}; ${y2}).`;
    expected = d;
    explanation = `Usando la fórmula de distancia: d = √[(${x2} - ${x1})² + (${y2} - ${y1})²] = √[${base}² + ${height}²] = ${d}.`;
  }
  
  if (isGolden) {
      intro += ` Multiplica tu respuesta por 3.`;
      expected *= 3;
      explanation += ` Multiplicado por 3 es ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Intro Geometría Analítica',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateAngulosPosicionNormal(isGolden: boolean): ProblemData {
  // A Pythagorean triple keeps r whole; the quadrant decides the signs. This
  // used to be four hard-coded problems, so every student saw the same four.
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37]];
  const [legA, legB, r] = triples[rnd(0, triples.length - 1)];
  // Either leg can play the horizontal role, for more distinct-looking points.
  const [absX, absY] = rnd(0, 1) === 0 ? [legA, legB] : [legB, legA];
  const q = rnd(1, 4);
  const x = (q === 1 || q === 4) ? absX : -absX;
  const y = (q === 1 || q === 2) ? absY : -absY;
  const letter = ['α', 'θ', 'β', 'γ'][q - 1];
  const useSine = rnd(0, 1) === 0;
  // -4² is -16: a negative coordinate has to be squared inside parentheses.
  const sq = (n: number) => (n < 0 ? `(${n})²` : `${n}²`);

  let intro = `El punto P(${x}; ${y}) pertenece al lado final de un ángulo ${letter} en posición normal. Calcula ${r}·${useSine ? 'sen' : 'cos'}(${letter}).`;
  let expected = useSine ? y : x;
  const ratio = useSine ? `Y/r = ${y}/${r}` : `X/r = ${x}/${r}`;
  let explanation = `El radio vector es r = √(${sq(x)} + ${sq(y)}) = √(${x * x} + ${y * y}) = ${r}. Como ${useSine ? 'sen' : 'cos'}(${letter}) = ${ratio}, entonces ${r}·${useSine ? 'sen' : 'cos'}(${letter}) = ${r}·(${expected}/${r}) = ${expected}.`;

  if (isGolden) {
      intro += ` Y luego réstale 2.`;
      expected -= 2;
      explanation += ` Restando 2 da ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Ángulos en Posición Normal',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}
