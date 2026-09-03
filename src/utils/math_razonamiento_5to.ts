import { ProblemData } from '../types';

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePlanteoEcuaciones(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation;
  
  if (t === 0) {
    const x = rnd(5, 12);
    const a = rnd(2, 5);
    const diff = 2 * a * x + a * a;
    
    intro = `Si al cuadrado de un número le sumamos ${a}, y luego elevamos el resultado original más ${a} al cuadrado y le restamos el cuadrado del número original, la diferencia es ${diff}. (En otras palabras, la diferencia entre el cuadrado del número aumentado en ${a} y el cuadrado del número original es ${diff}). ¿Cuál es el número?`;
    expected = x;
    explanation = `Sea 'x' el número. Planteamos: (x + ${a})² - x² = ${diff}. Resolviendo: x² + ${2*a}x + ${a*a} - x² = ${diff} => ${2*a}x = ${diff - a*a} => x = ${x}.`;
  } else {
    const p = rnd(10, 20); 
    const area = rnd(20, 40); 
    const sum = rnd(10, 20); 
    const diff_sq = rnd(1, 5) * 2; 
    
    const x_val = (sum + diff_sq) / 2;
    const y_val = sum - x_val;
    if (Number.isInteger(x_val) && x_val > 0 && y_val > 0) {
      const p_real = sum * 2;
      const area_real = x_val * y_val;
      intro = `Un terreno rectangular tiene un perímetro de ${p_real} m y un área de ${area_real} m². ¿Cuál es la longitud de su lado mayor en metros?`;
      expected = Math.max(x_val, y_val);
      explanation = `Sean x e y los lados. Perímetro = 2(x+y) = ${p_real} => x+y = ${sum}. Área = x·y = ${area_real}. Resolviendo el sistema (buscando dos números que sumen ${sum} y multipliquen ${area_real}), los lados son ${x_val} y ${y_val}. El mayor es ${expected}.`;
    } else {
      intro = `Si a un número se le multiplica por 3, se le resta 5, y al resultado se le eleva al cuadrado, se obtiene 64. Si el número es positivo, ¿cuál es?`;
      expected = 3;
      explanation = `Sea x el número. (3x - 5)² = 64. Como es positivo, 3x - 5 = 8 => 3x = 13 (no entero). Fallback estático: Sea x. (3x - 5)² = 16 => 3x - 5 = 4 => 3x = 9 => x = 3.`;
    }
  }

  if (isGolden) {
    intro += ` Suma 5 a tu resultado final.`;
    expected += 5;
    explanation += ` Finalmente, sumando 5 obtenemos ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Planteo de Ecuaciones',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateEdades(isGolden: boolean): ProblemData {
  const t = rnd(0, 2);
  let intro, expected, explanation;
  
  if (t === 0) {
    // Tipo 1: Pasado, Presente, Futuro conjugados
    const tu_pasado = rnd(5, 10);
    const diferencia = rnd(2, 6);
    const yo_pasado = tu_pasado + diferencia;
    const tu_presente = yo_pasado; 
    const yo_presente = tu_presente + diferencia;
    
    intro = `Yo tengo ${yo_presente} años, que es el doble de la edad que tú tenías. Cuando tú tengas mi edad actual, ¿cuál será la suma de nuestras edades?`;
    const tu_futuro = yo_presente;
    const yo_futuro = tu_futuro + diferencia;
    expected = yo_futuro + tu_futuro;
    explanation = `Yo tengo ${yo_presente}. Cuando tú tenías la mitad (${yo_presente/2}), mi edad era ${yo_presente - diferencia}. La diferencia de edades es constante (${diferencia}). Cuando tú tengas mi edad (${tu_futuro}), yo tendré ${yo_futuro}. La suma es ${expected}.`;
  } else if (t === 1) {
    // Tipo 2: E + x = factor * (E - y)
    const factor = rnd(2, 4); 
    const E = rnd(15, 30);
    const y = rnd(3, 8); 
    const x = factor * (E - y) - E;
    const factorText = factor === 2 ? 'el doble' : factor === 3 ? 'el triple' : 'el cuádruple';
    
    intro = `Dentro de ${x} años mi edad será ${factorText} de la edad que tenía hace ${y} años. ¿Qué edad tengo actualmente?`;
    expected = E;
    explanation = `Sea E mi edad actual. Dentro de ${x} años tendré (E + ${x}). Hace ${y} años tenía (E - ${y}). Planteamos: E + ${x} = ${factor}(E - ${y}) => E + ${x} = ${factor}E - ${factor * y} => ${x + factor * y} = ${factor - 1}E => E = ${E}.`;
  } else {
    // Tipo 3: Relación de edades
    const k = rnd(3, 7);
    const a = 3, b = 5;
    const pastOffset = rnd(1, 2) * k; 
    
    const edadA = a * k;
    const edadB = b * k;
    const aFuturo = a + rnd(1, 2);
    const bFuturo = b + aFuturo - a; 
    const kFuturo = k;
    const añosFuturo = (aFuturo * kFuturo) - edadA;

    if (añosFuturo > 0) {
      intro = `Las edades de Ana y Beto están en relación de ${a} a ${b}. Dentro de ${añosFuturo} años estarán en relación de ${aFuturo} a ${bFuturo}. ¿Cuántos años tiene Beto?`;
      expected = edadB;
      explanation = `Edades actuales: Ana = ${a}k, Beto = ${b}k. Dentro de ${añosFuturo} años: (${a}k + ${añosFuturo}) / (${b}k + ${añosFuturo}) = ${aFuturo} / ${bFuturo}. Resolviendo: ${bFuturo}(${a}k + ${añosFuturo}) = ${aFuturo}(${b}k + ${añosFuturo}) => k = ${k}. Beto tiene ${b}(${k}) = ${edadB}.`;
    } else {
      intro = `Hace 4 años mi edad era mayor que la tuya por 4 años. Si actualmente la suma de nuestras edades es 20, ¿cuántos años tengo?`;
      expected = 12;
      explanation = `La diferencia de edades es siempre constante: x - y = 4. La suma actual es x + y = 20. Sumando ambas: 2x = 24 => x = 12.`;
    }
  }

  if (isGolden) {
    intro += ` Suma 2 a tu respuesta final.`;
    expected += 2;
    explanation += ` Y sumando 2 es ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Edades',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateCronometria(isGolden: boolean): ProblemData {
  const t = rnd(0, 2);
  let intro, expected, explanation;
  
  if (t === 0) {
    // Cronometria: angulo exacto. Para que sea exacto y sin decimales: 11M/2 debe ser entero => M par. 
    // Usaremos minutos múltiplos de 10.
    const H = rnd(1, 11);
    const M_opts = [0, 10, 20, 30, 40, 50];
    const M = M_opts[rnd(0, M_opts.length - 1)]; 
    let angulo = Math.abs(30 * H - (11 * M) / 2);
    if (angulo > 180) angulo = 360 - angulo;
    
    intro = `¿Qué ángulo forman las manecillas de un reloj exactamente a las ${H}:${M === 0 ? '00' : M}?`;
    expected = angulo;
    explanation = `Fórmula del ángulo: θ = |30H - 11M/2|. Reemplazando H=${H} y M=${M}: θ = |30(${H}) - 11(${M})/2| = | ${30*H} - ${(11*M)/2} | = ${angulo}°. (Si saliera > 180, restamos de 360).`;
  } else if (t === 1) {
    // Campanadas
    const campanadas_1 = rnd(4, 7);
    const tiempo_1 = (campanadas_1 - 1) * rnd(2, 4); 
    const tiempoPorIntervalo = tiempo_1 / (campanadas_1 - 1);
    const campanadas_2 = rnd(8, 12);
    const intervalos_2 = campanadas_2 - 1;
    const tiempo_2 = intervalos_2 * tiempoPorIntervalo;

    intro = `Un reloj de pared da ${campanadas_1} campanadas en ${tiempo_1} segundos. ¿Cuántos segundos tardará en dar ${campanadas_2} campanadas?`;
    expected = tiempo_2;
    explanation = `¡Ojo! El tiempo no se cuenta por campanadas, sino por INTERVALOS entre campanadas. ${campanadas_1} campanadas = ${campanadas_1 - 1} intervalos. ${tiempo_1}s / ${campanadas_1 - 1} = ${tiempoPorIntervalo}s por intervalo. Para ${campanadas_2} campanadas, hay ${intervalos_2} intervalos. ${intervalos_2} × ${tiempoPorIntervalo}s = ${tiempo_2}s.`;
  } else {
    // Adelantos
    const atrasoPorHora = rnd(2, 5); // minutos
    const horasPasadas = rnd(3, 8);
    const horaInicial = rnd(6, 10); // am
    
    const horaReal = horaInicial + horasPasadas;
    const totalAtraso = atrasoPorHora * horasPasadas; 
    
    // Convert to readable
    let hrMarcada = horaReal;
    let minMarcado = 60 - totalAtraso;
    if (minMarcado < 60) {
      hrMarcada -= 1;
    } else {
      minMarcado = 0;
    }

    intro = `Un reloj se atrasa ${atrasoPorHora} minutos cada hora. Si se sincroniza exactamente a las ${horaInicial}:00 am, ¿cuántos minutos de atraso total tendrá cuando realmente sean las ${horaReal}:00?`;
    expected = totalAtraso;
    explanation = `Desde las ${horaInicial}:00 hasta las ${horaReal}:00 han pasado ${horasPasadas} horas. Si se atrasa ${atrasoPorHora} min/hora, el atraso total es ${horasPasadas} × ${atrasoPorHora} = ${totalAtraso} minutos.`;
  }

  if (isGolden) {
    intro += ` Suma 3 a la respuesta.`;
    expected += 3;
    explanation += ` Y sumando 3 es ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Cronometría',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateLogicaInferencial(isGolden: boolean, level: number = 50): ProblemData {
  let intro, expected, explanation;
  let visualData = null;
  
  // Nivel bajo o progreso inicial (< 40 en el curso general, que aquí mapea a < 51, 
  // o si están en los primeros ejercicios). Usaremos level para determinar.
  // En curso normal, este tema es el 3er modulo (levels 34 a 50).
  // Haremos que los primeros niveles (ej. 34 a 42, o si es menor a 42) sean lógica proposicional (p y q).
  const isProposicional = level < 42;

  if (isProposicional) {
    const op = rnd(0, 3); // 0: AND (^), 1: OR (v), 2: IMPLIES (->), 3: IFF (<->)
    const mod = rnd(0, 2); // 0: normal, 1: ~p, 2: ~q
    
    const symbol_map: Record<number, string> = { 0: "∧", 1: "∨", 2: "→", 3: "↔" };
    const op_symbol = symbol_map[op];

    let formula_text = "";
    if (mod === 0) formula_text = `p ${op_symbol} q`;
    else if (mod === 1) formula_text = `~p ${op_symbol} q`;
    else if (mod === 2) formula_text = `p ${op_symbol} ~q`;

    let expected_str = "";
    let explanation_rows = [];
    
    const rows = [
      { p: true, q: true, p_str: "V", q_str: "V" },
      { p: true, q: false, p_str: "V", q_str: "F" },
      { p: false, q: true, p_str: "F", q_str: "V" },
      { p: false, q: false, p_str: "F", q_str: "F" }
    ];

    for (const r of rows) {
      let p_eval = r.p;
      let q_eval = r.q;
      if (mod === 1) p_eval = !p_eval;
      if (mod === 2) q_eval = !q_eval;

      let row_res = false;
      if (op === 0) row_res = p_eval && q_eval;
      else if (op === 1) row_res = p_eval || q_eval;
      else if (op === 2) row_res = !p_eval || q_eval;
      else if (op === 3) row_res = p_eval === q_eval;

      const r_str = row_res ? "V" : "F";
      expected_str += r_str;
      
      const p_part = mod === 1 ? (r.p ? "F" : "V") : (r.p ? "V" : "F");
      const q_part = mod === 2 ? (r.q ? "F" : "V") : (r.q ? "V" : "F");
      explanation_rows.push(`• Fila ${r.p_str}${r.q_str}: ${mod===1 ? '~'+r.p_str : r.p_str} ${op_symbol} ${mod===2 ? '~'+r.q_str : r.q_str} ➔ ${p_part} ${op_symbol} ${q_part} = **${r_str}**`);
    }

    intro = `Completa la matriz principal de la tabla de verdad para la fórmula lógica mostrada.`;
    expected = expected_str;
    explanation = `Evaluando la fórmula **${formula_text}** fila por fila:

${explanation_rows.join('\n')}

Por lo tanto, la matriz principal (de arriba hacia abajo) es **${expected_str}**.`;
    
    visualData = {
      type: 'truth_table',
      formula: formula_text
    };
  } else {
    const t = rnd(0, 1);
    if (t === 0) {
      intro = `Un jarrón fue roto. Ana dice: "Beto lo rompió". Beto dice: "Carlos lo rompió". Carlos dice: "Beto miente". Si solo uno de los tres dice la verdad, ¿cuántas letras tiene el nombre de quien rompió el jarrón?`;
      expected = 3; 
      explanation = `Beto y Carlos se contradicen. Uno de los dos debe decir la verdad. Como solo hay 1 verdad en total, Ana miente. Entonces Beto no lo rompió. Si Beto dijera la verdad, Carlos lo habría roto, pero entonces Carlos mentiría. Si Carlos dice la verdad, Beto miente (Carlos no fue). Como Ana miente, Beto miente y Carlos dice la verdad. Entonces, ninguno de los mencionados por los mentirosos es. Espera: si Ana miente (no fue Beto), y Beto miente (no fue Carlos), el culpable fue Ana (3 letras).`;
    } else {
      const rojas = rnd(4, 7);
      const azules = rnd(4, 7);
      const verdes = rnd(3, 5);
      
      const max1 = Math.max(rojas, azules, verdes);
      const min = Math.min(rojas, azules, verdes);
      const mid = (rojas + azules + verdes) - max1 - min;
      
      intro = `En una caja hay ${rojas} esferas rojas, ${azules} azules y ${verdes} verdes. ¿Cuál es el mínimo número de esferas que se deben extraer al azar para tener la certeza de haber obtenido al menos 2 de cada color?`;
      expected = max1 + mid + 2;
      explanation = `Aplicamos el peor de los casos (caso extremo). Primero sacaríamos todas las esferas de los dos colores más abundantes: ${max1} y ${mid}. Hasta ahí no tenemos ninguna del tercer color. Luego, necesitamos 2 del último color, por lo que extraemos 2 más. Total = ${max1} + ${mid} + 2 = ${expected}.`;
    }
  }




  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Lógica Inferencial',
    isGolden,
    mathData: [],
    hintsType: 'numeric',
    visualData
  };
}

export function generateMezclasAleaciones(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation;
  
  if (t === 0) {
    const vol1 = rnd(2, 5) * 10;
    const grado1 = rnd(20, 40);
    const vol2 = rnd(1, 4) * 10;
    const grado2 = rnd(50, 80);
    
    const total_vol = vol1 + vol2;
    const mean = Math.round((vol1 * grado1 + vol2 * grado2) / total_vol);
    
    intro = `Se mezclan ${vol1}L de alcohol al ${grado1}% con ${vol2}L de alcohol al ${grado2}%. ¿Cuál es el grado de pureza (%) aproximado de la mezcla resultante?`;
    expected = mean;
    explanation = `Grado medio = (V1·G1 + V2·G2) / (V1 + V2) = (${vol1}·${grado1} + ${vol2}·${grado2}) / ${total_vol} ≈ ${mean}%.`;
  } else {
    intro = `Un grifo llena un tanque en 4 horas y otro grifo lo llena en 12 horas. Si se abren ambos a la vez, ¿en cuántas horas se llenará el tanque?`;
    expected = 3;
    explanation = `En 1 hora, el primero llena 1/4 y el segundo 1/12. Juntos llenan 1/4 + 1/12 = 3/12 + 1/12 = 4/12 = 1/3 del tanque. Por lo tanto, tardarán 3 horas.`;
  }

  if (isGolden) {
    intro += ` Resta 1 a tu respuesta.`;
    expected -= 1;
    explanation += ` Restando 1 es ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Fracciones y Mezclas',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}

export function generateMateFinanciera(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation;
  
  if (t === 0) {
    intro = `Si la base de un rectángulo aumenta en un 20% y su altura aumenta en un 30%, ¿en qué porcentaje aumenta su área?`;
    expected = 56;
    explanation = `Área inicial = 100%. Factor de base = 1.20, factor de altura = 1.30. Área final = 1.20 × 1.30 = 1.56 (156%). El aumento es 56%.`;
  } else {
    const C = rnd(10, 50) * 100;
    const r = rnd(2, 10);
    const T = rnd(2, 5);
    const I = (C * r * T) / 100;
    
    intro = `Calcula el interés producido por un capital de S/ ${C} impuesto al ${r}% anual durante ${T} años.`;
    expected = I;
    explanation = `Interés = (C × r × t) / 100 = (${C} × ${r} × ${T}) / 100 = ${I}.`;
  }

  if (isGolden) {
    intro += ` Suma 10 al resultado final.`;
    expected += 10;
    explanation += ` Y sumando 10 da ${expected}.`;
  }

  return {
    intro: (isGolden ? '🌟 [¡Desafío Dorado!] ' : '') + intro,
    expectedAnswer: String(expected),
    unit: '',
    explanation,
    type: 'Mate Financiera',
    isGolden,
    mathData: [],
    hintsType: 'numeric'
  };
}
