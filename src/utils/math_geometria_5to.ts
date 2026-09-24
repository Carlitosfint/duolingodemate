import { ProblemData } from '../types';

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRelacionesMetricas(isGolden: boolean): ProblemData {
  const t = rnd(0, 2);
  let intro, expected, explanation, visualData;
  
  if (t === 0) {
    // Relaciones métricas en triángulo rectángulo: h² = m·n.
    // m = d·u² y n = d·v² garantizan que h = d·u·v sea entero, en vez de la
    // lista fija de 5 pares que hacía repetir siempre los mismos problemas.
    const d = rnd(1, 5);
    let u = rnd(1, 5);
    let v = rnd(1, 5);
    while (v === u) v = rnd(1, 5);
    const m_val = d * u * u;
    const n_val = d * v * v;
    const h_val = d * u * v;
    
    intro = `Analicemos este triángulo rectángulo. Las proyecciones (sombras) de sus dos lados más cortos (catetos) sobre el piso (hipotenusa) miden ${m_val} y ${n_val}. ¿Podrías calcular la altura (h)?`;
    expected = h_val;
    explanation = `¡Es una propiedad mágica de los triángulos rectángulos!

El cuadrado de la altura siempre es igual a la multiplicación de las dos proyecciones que deja en el piso:
1) Escribimos la fórmula: h² = m × n
2) Reemplazamos: h² = ${m_val} × ${n_val} = ${m_val * n_val}
3) Sacamos la raíz cuadrada: h = ${h_val}

¡La altura es ${h_val}!`;

    visualData = {
      type: 'geometry',
      shape: 'triangle_altitude',
      m: m_val,
      n: n_val,
      h: 'h'
    };
  } else if (t === 1) {
    // Relaciones métricas en el cateto: a² = c·m.
    // Sobre un 3-4-5 escalado por s, la hipotenusa mide 25s y las
    // proyecciones 9s y 16s, así que a = 15s o 20s: siempre enteros y con un
    // triángulo real detrás (m < c y n = c - m > 0).
    const s = rnd(1, 6);
    const c_val = 25 * s;
    const useShortLeg = rnd(0, 1) === 0;
    const m_val = (useShortLeg ? 9 : 16) * s;
    const a_val = (useShortLeg ? 15 : 20) * s;

    intro = `Mira el cateto izquierdo "a". Sabemos que toda la hipotenusa (c) mide ${c_val} y la proyección (sombra) que deja ese mismo cateto en el suelo mide ${m_val}. ¿Cuánto mide el cateto "a"?`;
    expected = a_val;
    explanation = `Existe una fórmula directa para esto:
El cateto al cuadrado es igual a toda la hipotenusa multiplicada por su propia sombra (proyección).

1) Fórmula: a² = c × m
2) Reemplazamos: a² = ${c_val} × ${m_val} = ${c_val * m_val}
3) Sacamos raíz cuadrada: a = ${a_val}

¡El cateto mide ${a_val}!`;
    
    visualData = {
      type: 'geometry',
      shape: 'triangle_leg',
      c: c_val,
      m: m_val
    };
  } else {
    // Relaciones métricas en circunferencia: Teorema de las cuerdas (a * b = c * d)
    const pairs = [[2, 6, 3, 4], [3, 8, 4, 6], [4, 5, 2, 10], [5, 6, 3, 10]];
    const [a, b, c, d] = pairs[rnd(0, pairs.length - 1)];
    
    intro = `Tenemos dos cuerdas cruzadas dentro de un círculo. La primera cuerda se partió en dos pedazos de ${a} y ${b}. La segunda cuerda tiene un pedazo de ${c}. ¿Cuánto mide el trozo faltante "x"?`;
    expected = d;
    explanation = `El Teorema de las Cuerdas nos dice que si multiplicamos los dos pedazos de una cuerda, dará lo mismo que multiplicar los dos pedazos de la otra.

1) Multiplicamos la primera cuerda: ${a} × ${b} = ${a * b}
2) Igualamos a la segunda: ${c} × x = ${a * b}
3) Despejamos x: x = ${a * b} / ${c} = ${d}

¡El pedazo faltante mide ${d}!`;

    visualData = {
      type: 'geometry',
      shape: 'circle_chords',
      a, b, c, d: 'x'
    };
  }

  if (isGolden) {
    intro += `

[Reto extra]: Súmale 3 al resultado final.`;
    expected += 3;
    explanation += `

Al final, le sumamos 3 al resultado, obteniendo ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Relaciones Métricas',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

export function generateAreasRegiones(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation, visualData;
  
  if (t === 0) {
    // Área con trigonometría: (a * b * sen(theta)) / 2
    // Use theta = 30° (sen 30 = 1/2) or 150°
    const a = rnd(4, 10) * 2;
    const b = rnd(4, 10) * 2;
    
    intro = `Calcula el área de una región triangular donde dos de sus lados miden ${a} cm y ${b} cm, y el ángulo comprendido entre ellos es 30°.`;
    expected = (a * b) / 4;
    explanation = `Usando la fórmula trigonométrica para el área del triángulo: S = (a × b × sen(θ)) / 2.
Sabemos que sen(30°) = 1/2.
S = (${a} × ${b} × 1/2) / 2 = (${a * b / 2}) / 2 = ${expected} cm².`;

    visualData = {
      type: 'geometry',
      shape: 'triangle_angle',
      a, b, angle: '30°'
    };
  } else {
    // Relación de áreas con mediana (divide al triángulo en 2 áreas iguales)
    const totalArea = rnd(10, 30) * 4;
    
    intro = `El área de una región triangular ABC es ${totalArea} cm². Se traza la mediana BM (M en AC) y luego la mediana AN (N en BM) del triángulo ABM. ¿Cuál es el área de la región triangular ANM?`;
    expected = totalArea / 4;
    explanation = `La mediana BM divide al triángulo mayor en dos triángulos de igual área: ABM y MBC. 
Área(ABM) = ${totalArea} / 2 = ${totalArea / 2} cm².
Luego, en el triángulo ABM, la mediana AN divide su área en dos partes iguales.
Área(ANM) = ${totalArea / 2} / 2 = ${expected} cm².`;

    visualData = {
      type: 'geometry',
      shape: 'triangle_medians',
      area: totalArea
    };
  }

  if (isGolden) {
    intro += ` Multiplica tu resultado por 2.`;
    expected *= 2;
    explanation += ` Multiplicando por 2 da ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Áreas de Regiones',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

const gcd = (p: number, q: number): number => (q === 0 ? p : gcd(q, p % q));

// A fraction as the answer key: a decimal when it ends ("25/2" -> "12.5"),
// otherwise the fraction itself ("16/3"). The grader reads both, and accepts
// the student's rounding of it too.
function fractionKey(num: number, den: number): string {
  let rest = den;
  for (const p of [2, 5]) while (rest % p === 0) rest /= p;
  return rest === 1 ? String(num / den) : `${num}/${den}`;
}

export function generateSuperficiesCirculares(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation, visualData;
  
  if (t === 0) {
    // Sector circular: S = (pi * r^2 * theta) / 360, asked as S / pi.
    // That's often not a whole number (64·30/360 = 16/3). It used to be
    // rounded to 5.33 for the key, so the exact answer "16/3" was marked
    // wrong; now the key is the exact fraction.
    const r = rnd(2, 6) * 2;
    const angles = [30, 45, 60, 90, 120];
    const angle = angles[rnd(0, angles.length - 1)];
    const g = gcd(r * r * angle, 360);
    let num = (r * r * angle) / g;
    const den = 360 / g;
    if (isGolden) num += den; // the golden version asks for 1 more
    const baseNum = num - (isGolden ? den : 0);
    const base = fractionKey(baseNum, den);
    const isFraction = base.includes('/');
    // "16π/3", not "16/3π", which reads as 16 over 3π.
    const withPi = isFraction ? `${baseNum}π/${den}` : `${base}π`;
    const approx = isFraction ? ` (≈ ${(baseNum / den).toFixed(2)})` : '';

    intro = `Calcula el área de un sector circular cuyo radio mide ${r} cm y su ángulo central es ${angle}°. Da tu respuesta dividida entre π (pi); si no sale exacta, puedes escribirla como fracción.`;
    expected = fractionKey(num, den);
    explanation = `Fórmula del sector circular: S = (π × r² × θ) / 360°.
S = (π × ${r}² × ${angle}) / 360 = (π × ${r * r} × ${angle}) / 360 = ${withPi}.
Como piden la respuesta dividida entre π, el valor es ${base}${approx}.`;

    visualData = {
      type: 'geometry',
      shape: 'circular_sector',
      r, angle: `${angle}°`
    };
  } else {
    // Corona circular: S = pi(R^2 - r^2)
    const R = rnd(5, 10);
    const r = rnd(2, R - 1);
    
    intro = `Calcula el área de una corona circular determinada por dos circunferencias concéntricas de radios ${R} y ${r}. Da tu respuesta dividida entre π.`;
    expected = R * R - r * r;
    explanation = `El área de la corona circular es la diferencia de las áreas de los dos círculos: S = π(R² - r²).
S = π(${R}² - ${r}²) = π(${R * R} - ${r * r}) = ${expected}π.
La respuesta sin π es ${expected}.`;

    visualData = {
      type: 'geometry',
      shape: 'circular_crown',
      R, r
    };
  }

  if (isGolden) {
    intro += ` Súmale 1 al final.`;
    // The sector's key is already a string with the 1 added.
    if (t !== 0) expected = Number(expected) + 1;
    explanation += ` Sumándole 1 queda en ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Superficies Circulares',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

export function generateGeometriaEspacio(isGolden: boolean): ProblemData {
  let intro, expected, explanation, visualData;
  
  // PA ⊥ al plano, AB en el plano => triángulo PAB recto en A.
  // Una terna pitagórica escalada mantiene la aritmética exacta; antes se
  // elegía entre 4 ternas fijas, así que solo existían 4 problemas posibles.
  const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const [t1, t2, t3] = triples[rnd(0, triples.length - 1)];
  const scale = rnd(1, 3);
  // Cualquiera de los catetos puede ser la vertical.
  const swap = rnd(0, 1) === 0;
  const h_height = (swap ? t1 : t2) * scale;
  const proj = (swap ? t2 : t1) * scale;
  const dist = t3 * scale;

  intro = `Una recta PA es perpendicular al plano que contiene a un rectángulo ABCD (P no pertenece al plano). Si PA = ${h_height} y AB = ${proj}, calcula la distancia desde el punto P hasta el vértice B.`;
  expected = dist;
  explanation = `Como PA es perpendicular al plano, es perpendicular a cualquier recta del plano que pase por A. En particular, PA ⊥ AB.
Se forma el triángulo rectángulo PAB, recto en A.
Por el teorema de Pitágoras: PB² = PA² + AB²
PB² = ${h_height}² + ${proj}² = ${h_height * h_height} + ${proj * proj} = ${h_height * h_height + proj * proj}
PB = ${dist}.`;

  visualData = {
    type: 'geometry',
    shape: 'space_3perp',
    h: h_height,
    proj: proj
  };

  if (isGolden) {
    intro += ` Multiplica la respuesta final por 2.`;
    expected *= 2;
    explanation += ` Y por 2 obtenemos ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Geometría del Espacio',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

export function generateSolidos(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation, visualData;
  
  if (t === 0) {
    // Cubo (Hexaedro regular)
    const a = rnd(2, 8);
    intro = `Calcula el área total de un cubo cuya arista mide ${a} cm.`;
    expected = 6 * a * a;
    explanation = `Un cubo tiene 6 caras cuadradas congruentes.
Área de una cara = a² = ${a}² = ${a * a}.
Área total = 6 × ${a * a} = ${expected} cm².`;

    visualData = {
      type: 'geometry',
      shape: 'cube',
      a
    };
  } else {
    // Cilindro
    const r = rnd(2, 6);
    const h = rnd(4, 10);
    intro = `Calcula el volumen de un cilindro de revolución cuyo radio de la base mide ${r} y su generatriz (altura) mide ${h}. Da tu respuesta dividida entre π.`;
    expected = r * r * h;
    explanation = `El volumen del cilindro se calcula con la fórmula: V = π × r² × h.
V = π × ${r}² × ${h} = π × ${r * r} × ${h} = ${expected}π.
Como piden la respuesta sin π, es ${expected}.`;

    visualData = {
      type: 'geometry',
      shape: 'cylinder',
      r, h
    };
  }

  if (isGolden) {
    intro += ` Súmale 10 a tu resultado.`;
    expected += 10;
    explanation += ` Sumándole 10 tenemos ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Sólidos y Poliedros',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}
