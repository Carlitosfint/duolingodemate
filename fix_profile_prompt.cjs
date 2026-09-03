const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

const promptLogic = `
          {(user.role !== 'teacher' && user.role !== 'admin') && (
            <div className="mt-1">
              <button 
                onClick={(e) => {
                  const el = e.currentTarget.nextElementSibling;
                  if (el) el.classList.toggle('hidden');
                }}
                className="text-[10px] text-slate-300 hover:text-slate-500 underline"
              >
                ¿Eres profesor?
              </button>
              <div className="hidden mt-2 flex items-center gap-2">
                <input type="text" id="roleCode" placeholder="Código de acceso" className="text-xs px-2 py-1 rounded border border-slate-200" />
                <Button color="blue" className="py-1 px-2 text-[10px]" onClick={async () => {
                  const input = document.getElementById('roleCode') as HTMLInputElement;
                  const code = input?.value;
                  if (code) {
                    try {
                      const { auth } = await import('../lib/firebase.ts');
                      const token = await auth.currentUser?.getIdToken();
                      const res = await fetch('/api/user/elevate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
                        body: JSON.stringify({ code })
                      });
                      if (res.ok) {
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
            </div>
          )}
`;

code = code.replace(
  /\{\(user\.role !== 'teacher' && user\.role !== 'admin'\) && \([\s\S]*?<\/button>\s*\)\}/,
  promptLogic
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);
