const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

if (!code.includes('const [showRoleInput')) {
  code = code.replace(
    /const content = \(/,
    "const [showRoleInput, setShowRoleInput] = React.useState(false);\n  const content = ("
  );

  const promptLogic = `
          {(user.role !== 'teacher' && user.role !== 'admin') && (
            <div className="mt-1 text-left">
              <button 
                onClick={() => setShowRoleInput(!showRoleInput)}
                className="text-[10px] text-slate-400 hover:text-slate-600 underline"
              >
                ¿Eres profesor o administrador?
              </button>
              {showRoleInput && (
                <div className="mt-2 flex items-center gap-2">
                  <input type="text" id="roleCode" placeholder="Código de acceso" className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 outline-none focus:border-blue-400 font-bold" />
                  <Button color="blue" className="py-1.5 px-3 text-[10px]" onClick={async () => {
                    const input = document.getElementById('roleCode') as HTMLInputElement;
                    const code = input?.value;
                    if (code) {
                      try {
                        const token = await auth.currentUser?.getIdToken();
                        const res = await fetch('/api/user/elevate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
                          body: JSON.stringify({ code })
                        });
                        if (res.ok) {
                          alert('¡Rol actualizado! Recargando...');
                          window.location.reload();
                        } else {
                          input.value = '';
                          input.placeholder = 'Código inválido';
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }
                  }}>Verificar</Button>
                </div>
              )}
            </div>
          )}
`;

  code = code.replace(
    /\{\(user\.role !== 'teacher' && user\.role !== 'admin'\) && \([\s\S]*?<\/div>\s*\)\}/,
    promptLogic.trim()
  );

  fs.writeFileSync('src/components/ProfileModal.tsx', code);
}
