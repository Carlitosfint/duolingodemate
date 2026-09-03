const fs = require('fs');

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const bank = [];
while (bank.length < 100) {
  const type = (bank.length % 2 === 0) ? 'cangrejo' : 'rombo';
  let intro, expectedAnswer, explanation, visualData;

  if (type === 'cangrejo') {
    const expected = randInt(10, 100); 
    const A = randInt(2, 5);
    const C = randInt(2, 5);
    
    // We want ((expected * A) + B) to be divisible by C
    const step1 = expected * A;
    const rem = step1 % C;
    const addNeeded = (C - rem) % C;
    const B = addNeeded + C * randInt(1, 10);
    
    const step2 = (step1 + B) / C;
    const D = randInt(1, step2 - 1); // ensures E > 0
    const E = step2 - D;

    if (!Number.isInteger(E) || E <= 0) continue;

    intro = 'Pienso en un número. Si lo multiplico por ' + A + ', luego le sumo ' + B + ', al resultado lo divido entre ' + C + ' y finalmente le resto ' + D + ', obtengo ' + E + '. ¿Cuál es el número que pensé?';
    visualData = {
      type: 'cangrejo',
      steps: [
        { op: '×', val: A },
        { op: '+', val: B },
        { op: '÷', val: C },
        { op: '-', val: D }
      ],
      result: E
    };
    expectedAnswer = String(expected);
    explanation = 'Método del cangrejo (operaciones inversas):\n1. Empezamos en ' + E + '.\n2. Sumamos ' + D + ' -> ' + (E + D) + '\n3. Multiplicamos por ' + C + ' -> ' + ((E + D) * C) + '\n4. Restamos ' + B + ' -> ' + (((E + D) * C) - B) + '\n5. Dividimos entre ' + A + ' -> ' + expected + '.';
  } else {
    const items = [
      { a: 'gallinas', aVal: 2, b: 'vacas', bVal: 4, desc: 'patas', ask: 'vacas' },
      { a: 'motos', aVal: 2, b: 'autos', bVal: 4, desc: 'llantas', ask: 'autos' },
      { a: 'monedas de S/2', aVal: 2, b: 'monedas de S/5', bVal: 5, desc: 'soles', ask: 'monedas de S/5' }
    ];
    const scenario = randChoice(items);
    const countA = randInt(15, 40); 
    const countB = randInt(10, 30);  
    
    const totalHeads = countA + countB;
    const totalLegs = countA * scenario.aVal + countB * scenario.bVal;

    intro = 'En un grupo hay ' + scenario.a + ' y ' + scenario.b + '. Si se cuentan en total ' + totalHeads + ' elementos y ' + totalLegs + ' ' + scenario.desc + ', ¿cuántos(as) ' + scenario.ask + ' hay?';
    visualData = {
      type: 'rombo',
      top: scenario.bVal,
      bottom: scenario.aVal,
      left: totalHeads,
      right: totalLegs,
      leftLabel: 'Total elementos',
      rightLabel: 'Total ' + scenario.desc,
      topLabel: scenario.b + ' (' + scenario.bVal + ')',
      bottomLabel: scenario.a + ' (' + scenario.aVal + ')'
    };
    expectedAnswer = String(countB);
    const text3 = scenario.ask === scenario.a ? String(countA) : 'Restamos del total: ' + totalHeads + ' - ' + countA + ' = ' + countB + ' ' + scenario.ask;
    
    explanation = 'Método del Rombo:\n1. Colocamos los valores en el rombo:\n   - Izquierda: Total de elementos (' + totalHeads + ')\n   - Derecha: Total acumulado (' + totalLegs + ')\n   - Arriba: Valor mayor (' + scenario.bVal + ')\n   - Abajo: Valor menor (' + scenario.aVal + ')\n2. Aplicamos la fórmula para hallar el valor de ABAJO (' + scenario.a + '):\n   (Izquierda × Arriba - Derecha) / (Arriba - Abajo)\n   = (' + totalHeads + ' × ' + scenario.bVal + ' - ' + totalLegs + ') / (' + scenario.bVal + ' - ' + scenario.aVal + ')\n   = (' + (totalHeads * scenario.bVal) + ' - ' + totalLegs + ') / ' + (scenario.bVal - scenario.aVal) + '\n   = ' + countA + ' ' + scenario.a + '.\n3. Como nos piden ' + scenario.ask + ':\n   ' + text3 + '.';
  }

  bank.push({
    intro, expectedAnswer, explanation, visualData, unit: '', type: 'Métodos Operativos', mathData: [], hintsType: 'numeric'
  });
}

const fileContent = `import { ProblemData } from '../types';\n\nexport const metodosBank: Omit<ProblemData, "isGolden">[] = ${JSON.stringify(bank, null, 2)};\n`;
fs.writeFileSync('src/utils/metodosBank.ts', fileContent);
