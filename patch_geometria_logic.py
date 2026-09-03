import re

with open("src/utils/math_geometria_5to.ts", "r") as f:
    content = f.read()

old_func = """export function generateRelacionesMetricas(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation, visualData;
  
  if (t === 0) {
    // Relaciones métricas en triángulo rectángulo: h^2 = m * n
    const m = rnd(2, 5);
    const n = rnd(3, 8) * m; // to make it perfect square if possible. Let's just use specific numbers.
    const h_opts = [4, 6, 8, 10, 12];
    const h = h_opts[rnd(0, h_opts.length - 1)];
    const mn_opts = [[2, 8], [4, 9], [4, 16], [5, 20], [9, 16]];
    const [m_val, n_val] = mn_opts[rnd(0, mn_opts.length - 1)];
    const h_val = Math.sqrt(m_val * n_val);
    
    intro = `En un triángulo rectángulo, las proyecciones de los catetos sobre la hipotenusa miden ${m_val} y ${n_val}. Calcula la longitud de la altura relativa a la hipotenusa.`;
    expected = h_val;
    explanation = `Por relaciones métricas en el triángulo rectángulo, el cuadrado de la altura relativa a la hipotenusa es igual al producto de las proyecciones de los catetos: h² = m × n.
h² = ${m_val} × ${n_val} = ${m_val * n_val}
h = ${h_val}.`;

    visualData = {
      type: 'geometry',
      shape: 'triangle_altitude',
      m: m_val,
      n: n_val,
      h: 'h'
    };
  } else {
    // Relaciones métricas en circunferencia: Teorema de las cuerdas (a * b = c * d)
    const pairs = [[2, 6, 3, 4], [3, 8, 4, 6], [4, 5, 2, 10], [5, 6, 3, 10]];
    const [a, b, c, d] = pairs[rnd(0, pairs.length - 1)];
    
    intro = `En una circunferencia, dos cuerdas se intersecan. Los segmentos de la primera cuerda miden ${a} y ${b}, y uno de los segmentos de la segunda cuerda mide ${c}. ¿Cuánto mide el otro segmento de la segunda cuerda?`;
    expected = d;
    explanation = `Por el teorema de las cuerdas, el producto de los segmentos de una cuerda es igual al producto de los segmentos de la otra: ${a} × ${b} = ${c} × x.
${a * b} = ${c}x
x = ${d}.`;

    visualData = {
      type: 'geometry',
      shape: 'circle_chords',
      a, b, c, d: 'x'
    };
  }

  if (isGolden) {
    intro += ` Suma 3 a tu respuesta.`;
    expected += 3;
    explanation += ` Sumando 3 obtenemos ${expected}.`;
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
}"""

new_func = """export function generateRelacionesMetricas(isGolden: boolean): ProblemData {
  const t = rnd(0, 2);
  let intro, expected, explanation, visualData;
  
  if (t === 0) {
    // Relaciones métricas en triángulo rectángulo: h^2 = m * n
    const mn_opts = [[2, 8], [4, 9], [4, 16], [5, 20], [9, 16]];
    const [m_val, n_val] = mn_opts[rnd(0, mn_opts.length - 1)];
    const h_val = Math.sqrt(m_val * n_val);
    
    intro = `Analicemos este triángulo rectángulo. Las proyecciones (sombras) de sus dos lados más cortos (catetos) sobre el piso (hipotenusa) miden ${m_val} y ${n_val}. ¿Podrías calcular la altura (h)?`;
    expected = h_val;
    explanation = `¡Es una propiedad mágica de los triángulos rectángulos!\n\nEl cuadrado de la altura siempre es igual a la multiplicación de las dos proyecciones que deja en el piso:\n1) Escribimos la fórmula: h² = m × n\n2) Reemplazamos: h² = ${m_val} × ${n_val} = ${m_val * n_val}\n3) Sacamos la raíz cuadrada: h = ${h_val}\n\n¡La altura es ${h_val}!`;

    visualData = {
      type: 'geometry',
      shape: 'triangle_altitude',
      m: m_val,
      n: n_val,
      h: 'h'
    };
  } else if (t === 1) {
    // Relaciones métricas cateto: a^2 = c * m
    const cm_opts = [[16, 4], [25, 9], [100, 36], [25, 16], [9, 4]]; // [c, m] -> c must be > m. a = sqrt(c*m)
    const [c_val, m_val] = cm_opts[rnd(0, cm_opts.length - 1)];
    const a_val = Math.sqrt(c_val * m_val);

    intro = `Mira el cateto izquierdo "a". Sabemos que toda la hipotenusa (c) mide ${c_val} y la proyección (sombra) que deja ese mismo cateto en el suelo mide ${m_val}. ¿Cuánto mide el cateto "a"?`;
    expected = a_val;
    explanation = `Existe una fórmula directa para esto:\nEl cateto al cuadrado es igual a toda la hipotenusa multiplicada por su propia sombra (proyección).\n\n1) Fórmula: a² = c × m\n2) Reemplazamos: a² = ${c_val} × ${m_val} = ${c_val * m_val}\n3) Sacamos raíz cuadrada: a = ${a_val}\n\n¡El cateto mide ${a_val}!`;
    
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
    explanation = `El Teorema de las Cuerdas nos dice que si multiplicamos los dos pedazos de una cuerda, dará lo mismo que multiplicar los dos pedazos de la otra.\n\n1) Multiplicamos la primera cuerda: ${a} × ${b} = ${a * b}\n2) Igualamos a la segunda: ${c} × x = ${a * b}\n3) Despejamos x: x = ${a * b} / ${c} = ${d}\n\n¡El pedazo faltante mide ${d}!`;

    visualData = {
      type: 'geometry',
      shape: 'circle_chords',
      a, b, c, d: 'x'
    };
  }

  if (isGolden) {
    intro += `\n\n[Reto extra]: Súmale 3 al resultado final.`;
    expected += 3;
    explanation += `\n\nAl final, le sumamos 3 al resultado, obteniendo ${expected}.`;
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
}"""

if old_func in content:
    content = content.replace(old_func, new_func)
    with open("src/utils/math_geometria_5to.ts", "w") as f:
        f.write(content)
    print("Patched Geometry generation successfully")
else:
    print("Could not find the function generation block")
