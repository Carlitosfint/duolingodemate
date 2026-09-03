const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix the "VER MENOS" button
// Sometimes overflow-hidden on the parent prevents the layout animation from resizing properly
code = code.replace(
  /className=\{\`rounded-\[\2rem\] border-2 p-5 shadow-sm \$\{currentThemeStyle\.cardBg\} overflow-hidden\`\}>/,
  'className={`rounded-[2rem] border-2 p-5 shadow-sm ${currentThemeStyle.cardBg}`}'
);

// 2. Fix the "Enviar Respuesta" to "Reclamar Recompensa" transition
code = code.replace(
  /\{currentProblem\.solved \? \(\(\) => \{/,
  '<AnimatePresence mode="wait">\n                {currentProblem.solved ? (() => {'
);
code = code.replace(
  /<Button \n                        type="button"\n                        onClick=\{\(\) => \{/g,
  '<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Button \n                        type="button"\n                        onClick={() => {'
);
code = code.replace(
  /<Icon name="gift" size=\{18\} className="inline-block" \/> Reclamar Recompensa\n                      <\/Button>/g,
  '<Icon name="gift" size={18} className="inline-block" /> Reclamar Recompensa\n                      </Button></motion.div>'
);
code = code.replace(
  /<Button \n                      type="button"\n                      onClick=\{loadNextProblem\}/g,
  '<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}><Button \n                      type="button"\n                      onClick={loadNextProblem}'
);
code = code.replace(
  /SIGUIENTE DESAFÍO <Icon name="arrow_right" size=\{20\} className="inline-block ml-1" \/>\n                    <\/Button>/g,
  'SIGUIENTE DESAFÍO <Icon name="arrow_right" size={20} className="inline-block ml-1" />\n                    </Button></motion.div>'
);

code = code.replace(
  /<\/>\n                    <h4 className="text-slate-500/g,
  '<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>\n                    <h4 className="text-slate-500'
);

code = code.replace(
  /ENVIAR RESPUESTA <Icon name="check" size=\{20\} \/>\n                    <\/button>\n                  <\/>\n                \)}/g,
  'ENVIAR RESPUESTA <Icon name="check" size={20} />\n                    </button>\n                  </motion.div>\n                )}</AnimatePresence>'
);

fs.writeFileSync('src/App.tsx', code);
