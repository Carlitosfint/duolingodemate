const fs = require('fs');

let code = fs.readFileSync('src/components/ProgressMap.tsx', 'utf8');

code = code.replace(
  /const topicName = step === 20 \? 'Criptoaritmética' : step === 40 \? 'Lógica Recreativa' : step === 60 \? 'Cronometría Básica' : step === 80 \? 'Conteo de Figuras' : 'Fin del Camino';\s*innerContent = \(\s*<div className="flex flex-col items-center gap-1">\s*<Icon name=\{isPast \|\| isCurrent \? "unlock" : "lock"\} size=\{36\} \/>\s*<span className="text-\[10px\] font-black uppercase text-center leading-tight px-1">\{topicName\}<\/span>\s*<\/div>\s*\);/,
  `const topicName = step === 20 ? 'Criptoaritmética' : step === 40 ? 'Lógica Recreativa' : step === 60 ? 'Cronometría Básica' : step === 80 ? 'Conteo de Figuras' : 'Campeón';
            
            const isFinal = step === 100;
            const finalIcon = isFinal ? 'crown' : (isPast || isCurrent ? "unlock" : "lock");
            if (isFinal) {
              bgClass = isPast || isCurrent ? 'bg-amber-500 border-amber-600 text-white shadow-[0_0_25px_rgba(245,158,11,0.5)]' : 'bg-slate-800 border-slate-900 text-amber-500 shadow-inner';
            }
            
            innerContent = (
              <div className="flex flex-col items-center gap-1">
                <Icon name={finalIcon} size={36} className={isFinal && !isPast && !isCurrent ? 'opacity-80' : ''} />
                <span className={\`text-[10px] font-black uppercase text-center leading-tight px-1 \${isFinal ? 'text-amber-100' : ''}\`}>{topicName}</span>
              </div>
            );`
);

fs.writeFileSync('src/components/ProgressMap.tsx', code);
