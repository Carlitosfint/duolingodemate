const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

code = code.replace(
  /const type = randChoice\(\['cangrejo', 'rombo'\]\);\n\s*let intro, expectedAnswer, explanation;/,
  `const type = randChoice(['cangrejo', 'rombo']);
  let intro, expectedAnswer, explanation, visualData;`
);

code = code.replace(
  /intro = \`Pienso en un número\. Si lo multiplico por \$\{A\}, luego le sumo \$\{B\}, al resultado lo divido entre \$\{C\} y finalmente le resto \$\{D\}, obtengo \$\{E\}\. ¿Cuál es el número que pensé\?\`;/,
  `intro = \`Pienso en un número. Si lo multiplico por \${A}, luego le sumo \${B}, al resultado lo divido entre \${C} y finalmente le resto \${D}, obtengo \${E}. ¿Cuál es el número que pensé?\`;
    visualData = {
      type: 'cangrejo',
      steps: [
        { op: '×', val: A },
        { op: '+', val: B },
        { op: '÷', val: C },
        { op: '-', val: D }
      ],
      result: E
    };`
);

code = code.replace(
  /intro = \`En un grupo hay \$\{scenario\.a\} y \$\{scenario\.b\}\. Si se cuentan en total \$\{totalHeads\} elementos y \$\{totalLegs\} \$\{scenario\.desc\}, ¿cuántos\(as\) \$\{scenario\.ask\} hay\?\`;/,
  `intro = \`En un grupo hay \${scenario.a} y \${scenario.b}. Si se cuentan en total \${totalHeads} elementos y \${totalLegs} \${scenario.desc}, ¿cuántos(as) \${scenario.ask} hay?\`;
    visualData = {
      type: 'rombo',
      top: scenario.bVal,
      bottom: scenario.aVal,
      left: totalHeads,
      right: totalLegs,
      leftLabel: 'Total elementos',
      rightLabel: \`Total \${scenario.desc}\`,
      topLabel: \`\${scenario.b} (\${scenario.bVal})\`,
      bottomLabel: \`\${scenario.a} (\${scenario.aVal})\`
    };`
);

code = code.replace(
  /mathData: \[\],\n\s*hintsType: 'numeric'/,
  `mathData: [],
    hintsType: 'numeric',
    visualData`
);

fs.writeFileSync('src/utils/math.ts', code);
