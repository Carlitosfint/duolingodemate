const fs = require('fs');
let code = fs.readFileSync('src/utils/math.ts', 'utf8');

code = code.replace(
  /explanation = \`Método del Rombo:\\nPara hallar la cantidad de \$\{scenario\.ask\} \(valor \$\{scenario\.bVal\}\), usamos: \(\$\{totalHeads\} × \$\{scenario\.aVal\} - \$\{totalLegs\}\) \/ \(\$\{scenario\.aVal\} - \$\{scenario\.bVal\}\)\. Resolviendo: \(\$\{totalHeads \* scenario\.aVal\} - \$\{totalLegs\}\) \/ \$\{scenario\.aVal - scenario\.bVal\} = \$\{countB\}\.\`;/,
  "explanation = `Método del Rombo:\\n1. Colocamos los valores en el rombo:\\n   - Izquierda: Total de elementos (${totalHeads})\\n   - Derecha: Total acumulado (${totalLegs})\\n   - Arriba: Valor mayor (${scenario.bVal})\\n   - Abajo: Valor menor (${scenario.aVal})\\n2. Aplicamos la fórmula para hallar el valor de ABAJO (${scenario.a}):\\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\\n   = (${totalHeads} × ${scenario.bVal} - ${totalLegs}) / (${scenario.bVal} - ${scenario.aVal})\\n   = (${totalHeads * scenario.bVal} - ${totalLegs}) / ${scenario.bVal - scenario.aVal}\\n   = ${countA} ${scenario.a}.\\n3. Como nos piden ${scenario.ask}:\\n   ${scenario.ask === scenario.a ? countA : `Restamos del total: ${totalHeads} - ${countA} = ${countB} ${scenario.ask}`}.`;"
);

fs.writeFileSync('src/utils/math.ts', code);
