const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /DESAFÍO \{\(viewMode === 'infinite_map' \? \(infiniteProgress\[selectedTopic\] \|\| 0\) : \(user\?\.progress \|\| 0\)\) \+ 1\} - \{selectedTopic === 'metodos' \? 'MÉTODOS OPERATIVOS' : selectedTopic === 'cripto' \? 'CRIPTOARITMÉTICA' : selectedTopic === 'logica' \? 'LÓGICA RECREATIVA' : selectedTopic === 'cronometria' \? 'CRONOMETRÍA BÁSICA' : 'CONTEO DE FIGURAS'\{"}"\}/,
  "DESAFÍO {(viewMode === 'infinite_map' ? (infiniteProgress[selectedTopic!] || 0) : (user?.progress || 0)) + 1} - {selectedTopic === 'metodos' ? 'MÉTODOS OPERATIVOS' : selectedTopic === 'cripto' ? 'CRIPTOARITMÉTICA' : selectedTopic === 'logica' ? 'LÓGICA RECREATIVA' : selectedTopic === 'cronometria' ? 'CRONOMETRÍA BÁSICA' : 'CONTEO DE FIGURAS'}"
);

fs.writeFileSync('src/App.tsx', code);
