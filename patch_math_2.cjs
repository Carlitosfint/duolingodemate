const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

// CRIPTOARITMÉTICA
code = code.replace(
  /const intro = `Reconstruye la siguiente suma:\\n A2 \+ 3B = \$\{sum\}\\nHalla el valor de A \+ B\.`;/,
  `const intro = \`Reconstruye la siguiente suma:\\n A2 + 3B = \${sum}\\nHalla el valor de A + B.\`;
  const visualData = {
    type: 'cripto',
    rows: [
      ['A', '2'],
      ['3', 'B']
    ],
    result: String(sum).split(''),
    operator: '+'
  };`
);

code = code.replace(
  /mathData: \[\],\n\s*hintsType: 'numeric'(\n\s*\};\n\})/g,
  (match, p1, offset, string) => {
    // Only replace inside generateCriptoaritmetica
    if (string.substring(offset - 200, offset).includes("Criptoaritmética")) {
        return `mathData: [],
    hintsType: 'numeric',
    visualData${p1}`;
    }
    return match;
  }
);


// LÓGICA RECREATIVA
code = code.replace(
  /intro = "Si el ayer del mañana del pasado mañana de hoy es Jueves, ¿qué día de la semana fue el ayer de hoy\? \(Responde con el número de día de la semana, 1=Lunes, 7=Domingo\)";/,
  `intro = "Si el ayer del mañana del pasado mañana de hoy es Jueves, ¿qué día de la semana fue el ayer de hoy? (Responde con el número de día de la semana, 1=Lunes, 7=Domingo)";
    var visualData = {
      type: 'timeline',
      events: [
        { label: 'Ayer', offset: -1 },
        { label: 'Mañana', offset: 1 },
        { label: 'Pasado m.', offset: 2 }
      ],
      current: 'Jueves'
    };`
);

code = code.replace(
  /intro = "En una reunión familiar están presentes: un abuelo, una abuela, dos padres, dos madres, dos esposos, dos esposas, un suegro, una suegra, un nieto, y una nieta\. ¿Cuál es la menor cantidad de personas presentes en dicha reunión\?";/,
  `intro = "En una reunión familiar están presentes: un abuelo, una abuela, dos padres, dos madres, dos esposos, dos esposas, un suegro, una suegra, un nieto, y una nieta. ¿Cuál es la menor cantidad de personas presentes en dicha reunión?";
    var visualData = {
      type: 'family',
      roles: ['Abuelo/a', 'Padres', 'Esposos/as', 'Suegros/as', 'Nietos/as']
    };`
);

// CRONOMETRÍA
code = code.replace(
  /const intro = `Un reloj de pared da \$\{camp1\} campanadas en \$\{time1\} segundos\. ¿En cuántos segundos dará \$\{camp2\} campanadas\?`;/,
  `const intro = \`Un reloj de pared da \${camp1} campanadas en \${time1} segundos. ¿En cuántos segundos dará \${camp2} campanadas?\`;
  const visualData = {
    type: 'clock',
    camp1,
    time1,
    camp2
  };`
);

// CONTEO
code = code.replace(
  /const intro = `En una recta se marcan \$\{n\+1\} puntos colineales consecutivos\. ¿Cuál es el número total de segmentos que se pueden contar en dicha recta\?`;/,
  `const intro = \`En una recta se marcan \${n+1} puntos colineales consecutivos. ¿Cuál es el número total de segmentos que se pueden contar en dicha recta?\`;
  const visualData = {
    type: 'segments',
    points: n + 1
  };`
);


fs.writeFileSync('src/utils/math.ts', code);
