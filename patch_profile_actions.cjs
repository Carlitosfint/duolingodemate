const fs = require('fs');

let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

code = code.replace(
  /onLogout\?: \(\) => void;\n\}/,
  `onLogout?: () => void;
  onOpenCodice?: () => void;
  onOpenMistakes?: () => void;
}`
);

code = code.replace(
  /onLogout\n\}\) => \{/,
  `onLogout,
  onOpenCodice,
  onOpenMistakes
}) => {`
);

code = code.replace(
  /\{onLogout && \(\s*<Button onClick=\{onLogout\} color="red" className="shrink-0 text-xs py-2 px-3">\s*Cerrar Sesión 🚪\s*<\/Button>\s*\)\}/,
  `{onOpenCodice && (
            <Button onClick={onOpenCodice} color="slate" className="shrink-0 text-xs py-2 px-3">
              Códice 📜
            </Button>
          )}
          {onOpenMistakes && (
            <Button onClick={onOpenMistakes} color="slate" className="shrink-0 text-xs py-2 px-3">
              Errores ❌
            </Button>
          )}
          {onLogout && (
            <Button onClick={onLogout} color="red" className="shrink-0 text-xs py-2 px-3">
              Cerrar Sesión 🚪
            </Button>
          )}`
);

fs.writeFileSync('src/components/ProfileModal.tsx', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  /<ProfileModal \s*stats=\{stats\}\s*user=\{user\}\s*trophies=\{trophies\}\s*coinsSpent=\{coinsSpent\}\s*skipsUsed=\{skipsUsed\}\s*isInline=\{true\}\s*onReplayTutorial=\{playIntro\}\s*onLogout=\{handleLogout\}\s*\/>/,
  `<ProfileModal 
                            stats={stats}
                            user={user}
                            trophies={trophies}
                            coinsSpent={coinsSpent}
                            skipsUsed={skipsUsed}
                            isInline={true}
                            onReplayTutorial={playIntro}
                            onLogout={handleLogout}
                            onOpenCodice={() => setViewMode('codice')}
                            onOpenMistakes={() => setViewMode('mistakes')}
                         />`
);

fs.writeFileSync('src/App.tsx', appCode);

