const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

const roleCode = `
          {user.role === 'teacher' ? (
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
              <Icon name="users" size={14} /> Profesor
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estudiante en Colegio Ángeles de Jesús</p>
          )}
          
          {user.role !== 'teacher' && (
            <button 
              onClick={async () => {
                const code = prompt('Ingresa el código de acceso (PROFE2026):');
                if (code) {
                  try {
                    const token = await auth.currentUser?.getIdToken();
                    const res = await fetch('/api/user/elevate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
                      body: JSON.stringify({ code })
                    });
                    if (res.ok) {
                      alert('¡Rol actualizado a Profesor! Por favor recarga la página.');
                      window.location.reload();
                    } else {
                      alert('Código inválido');
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }
              }}
              className="text-[10px] text-slate-300 hover:text-slate-500 underline mt-1"
            >
              ¿Eres profesor?
            </button>
          )}
`;

code = code.replace(
  /<p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estudiante en Colegio Ángeles de Jesús<\/p>/,
  roleCode
);

// add auth import
if (!code.includes('auth')) {
  code = code.replace(
    /import React from 'react';/,
    `import React from 'react';\nimport { auth } from '../lib/firebase.ts';`
  );
}

fs.writeFileSync('src/components/ProfileModal.tsx', code);
