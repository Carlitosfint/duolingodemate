const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressMap.tsx', 'utf8');

code = code.replace(
  /          if \(isChest\) \{/,
  `          const isSectionGate = step > 0 && step % 20 === 0;

          if (isSectionGate) {
            bgClass = isPast || isCurrent ? 'bg-blue-500 border-blue-600 text-white shadow-lg' : 'bg-slate-300 border-slate-400 text-slate-500 shadow-inner';
            nodeSize = 'w-28 h-28';
            wrapperClass = \`flex flex-col items-center justify-center \${nodeSize} rounded-3xl shrink-0 transition-all duration-300 relative z-30 \${bgClass} border-b-[8px] cursor-pointer hover:scale-105 active:scale-95\`;
            
            const topicName = step === 20 ? 'Criptoaritmética' : step === 40 ? 'Lógica Recreativa' : step === 60 ? 'Cronometría Básica' : step === 80 ? 'Conteo de Figuras' : 'Fin del Camino';
            
            innerContent = (
              <div className="flex flex-col items-center gap-1">
                <Icon name={isPast || isCurrent ? "unlock" : "lock"} size={36} />
                <span className="text-[10px] font-black uppercase text-center leading-tight px-1">{topicName}</span>
              </div>
            );
          } else if (isChest) {`
);

fs.writeFileSync('src/components/ProgressMap.tsx', code);
