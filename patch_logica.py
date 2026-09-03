import re

with open('src/utils/math_razonamiento_5to.ts', 'r') as f:
    content = f.read()

target = '''export function generateLogicaInferencial(isGolden: boolean): ProblemData {
  const t = rnd(0, 1);
  let intro, expected, explanation;
  
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
    
    const intro_certeza = `En una caja hay ${rojas} esferas rojas, ${azules} azules y ${verdes} verdes. ¿Cuál es el mínimo número de esferas que se deben extraer al azar para tener la certeza de haber obtenido al menos 2 de cada color?`;
    intro = intro_certeza;
    expected = max1 + mid + 2;
    explanation = `Aplicamos el peor de los casos (caso extremo). Primero sacaríamos todas las esferas de los dos colores más abundantes: ${max1} y ${mid}. Hasta ahí no tenemos ninguna del tercer color. Luego, necesitamos 2 del último color, por lo que extraemos 2 más. Total = ${max1} + ${mid} + 2 = ${expected}.`;
  }'''

replacement = '''export function generateLogicaInferencial(isGolden: boolean, level: number = 50): ProblemData {
  let intro, expected, explanation;
  let visualData = null;
  
  // Nivel bajo o progreso inicial (< 40 en el curso general, que aquí mapea a < 51, 
  // o si están en los primeros ejercicios). Usaremos level para determinar.
  // En curso normal, este tema es el 3er modulo (levels 34 a 50).
  // Haremos que los primeros niveles (ej. 34 a 42, o si es menor a 42) sean lógica proposicional (p y q).
  const isProposicional = level < 42;

  if (isProposicional) {
    const p_val = rnd(0, 1) === 1;
    const q_val = rnd(0, 1) === 1;
    const op = rnd(0, 3); // 0: AND (^), 1: OR (v), 2: IMPLIES (->), 3: IFF (<->)
    
    let res = false;
    let op_symbol = "";
    let op_name = "";
    
    if (op === 0) { res = p_val && q_val; op_symbol = "\\\\land"; op_name = "conjunción"; }
    else if (op === 1) { res = p_val || q_val; op_symbol = "\\\\lor"; op_name = "disyunción"; }
    else if (op === 2) { res = !p_val || q_val; op_symbol = "\\\\rightarrow"; op_name = "condicional"; }
    else if (op === 3) { res = p_val === q_val; op_symbol = "\\\\leftrightarrow"; op_name = "bicondicional"; }

    const p_str = p_val ? "V" : "F";
    const q_str = q_val ? "V" : "F";
    
    intro = `Sabiendo que la proposición "p" es ${p_str} y la proposición "q" es ${q_str}. ¿Cuál es el valor de verdad de la siguiente fórmula lógica?\n\n*(Escribe V o F)*`;
    expected = res ? "V" : "F";
    explanation = `Tenemos que p = ${p_str} y q = ${q_str}.\nAl evaluar p ${op_symbol} q (una ${op_name}), obtenemos que ${p_str} ${op_symbol} ${q_str} es ${res ? 'Verdadero (V)' : 'Falso (F)'}.`;
    
    visualData = {
      type: 'latex',
      latex: `p \\\\quad ${op_symbol} \\\\quad q`,
      size: 'large'
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
  }'''

# Replace ignoring formatting differences somewhat
import sys
content_new = re.sub(r'export function generateLogicaInferencial\(isGolden: boolean\): ProblemData \{.*?(?=\n\nexport function |\nexport function |$)', replacement + '\n\n', content, flags=re.DOTALL)
if content_new == content:
    print("Failed to replace!")
else:
    with open('src/utils/math_razonamiento_5to.ts', 'w') as f:
        f.write(content_new)
    print("Success")
