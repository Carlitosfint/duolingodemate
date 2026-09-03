import fs from 'fs';

let data = fs.readFileSync('src/data.ts', 'utf8');

data = data.replace(/problema financiero/g, 'problema matemático');
data = data.replace(/Inversor Activo/g, 'Mente Activa');
data = data.replace(/Tiburón Financiero/g, 'Genio Lógico');
data = data.replace(/Cazador de Divisas/g, 'Cazador de Enigmas');
data = data.replace(/Primer Depósito/g, 'Primer Desafío');
data = data.replace(/Multimillonario/g, 'Gran Inversor');
data = data.replace(/Crack de la Bolsa/g, 'Crack Matemático');

fs.writeFileSync('src/data.ts', data);
