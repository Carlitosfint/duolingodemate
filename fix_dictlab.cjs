const fs = require('fs');
let code = fs.readFileSync('src/components/DictLabModal.tsx', 'utf8');

const oldTabs = `razonamiento_5to: [
      { id: 'planteo', label: 'Planteo Avanzado', icon: '📊' },
      { id: 'edades', label: 'Edades y Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' }
    ]`;

const newTabs = `razonamiento_5to: [
      { id: 'edades', label: 'Edades y Cronometría', icon: '⏳' },
      { id: 'logica', label: 'Lógica Inferencial', icon: '🧠' },
      { id: 'mezclas', label: 'Fracciones y Mezclas', icon: '🧪' },
      { id: 'financiera', label: 'Mate Financiera', icon: '💰' },
      { id: 'planteo', label: 'Planteo Ecuaciones', icon: '📊' }
    ]`;

code = code.replace(oldTabs, newTabs);

const oldContentTitle = `<h4 className="font-black text-emerald-900 text-lg mb-2">Planteo Avanzado y Optimización</h4>`;
const newContentTitle = `<h4 className="font-black text-emerald-900 text-lg mb-2">Planteo de Ecuaciones</h4>`;
code = code.replace(oldContentTitle, newContentTitle);

fs.writeFileSync('src/components/DictLabModal.tsx', code);
