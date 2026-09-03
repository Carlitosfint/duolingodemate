const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /\{user\.role === 'teacher' \? \(/g,
  `{(user.role === 'teacher' || user.role === 'admin') ? (`
);

code = code.replace(
  /<Icon name="users" size=\{14\} \/> Profesor/,
  `<Icon name="users" size={14} /> {user.role === 'admin' ? 'Administrador' : 'Profesor'}`
);

code = code.replace(
  /\{user\.role !== 'teacher' && \(/g,
  `{(user.role !== 'teacher' && user.role !== 'admin') && (`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
