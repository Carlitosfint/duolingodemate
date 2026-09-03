const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Change icon of header button
code = code.replace(
  /title="Desafíos del Día"\s*>\s*<Icon name="target" size=\{18\} className="inline-block" \/>/g,
  `title="Desafíos del Día"
           >
             <Icon name="star" size={18} className="inline-block" />`
);

// Add the challenges block to sidebar
const blockToInsert = `
               {/* Desafíos del día */}
               <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} className={\`rounded-[2rem] border-2 p-5 shadow-sm \$\{currentThemeStyle.cardBg\}\`}>
                  <div className="flex justify-between items-center mb-5 gap-2">
                     <h4 className={\`font-black \$\{currentThemeStyle.textPrimary\} flex items-center gap-2\`}>
                       <Icon name="star" size={18} className="text-amber-500" /> Desafíos del día
                     </h4>
                     <button
                       type="button"
                       onClick={() => {
                         playClickSound();
                         setExpandedChallenges(!expandedChallenges);
                       }}
                       className="text-[10px] font-black text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-700/40 cursor-pointer uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95"
                     >
                       <span>{expandedChallenges ? 'VER MENOS' : 'VER TODOS'}</span>
                       <motion.span
                         animate={{ rotate: expandedChallenges ? 180 : 0 }}
                         transition={{ duration: 0.3, ease: 'easeInOut' }}
                         className="inline-block"
                       >
                         <Icon name="chevron_down" size={12} />
                       </motion.span>
                     </button>
                  </div>
                  <motion.div layout transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} className="space-y-4">
                     <AnimatePresence initial={false} mode="popLayout">
                        {dailyChallenges.slice(0, expandedChallenges ? 5 : 3).map((challenge, idx) => {
                          const isCompleted = challenge.current >= challenge.target;
                          const isClaimed = claimedChallenges.includes(challenge.id);
                          
                          return (
                            <motion.div 
                              key={challenge.id} 
                              layout
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.25, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                              className={\`flex items-center gap-3.5 p-1.5 rounded-2xl transition-colors \$\{isClaimed ? 'opacity-60' : ''\}\`}
                            >
                               <span className="text-3xl filter drop-shadow-sm shrink-0">{challenge.icon}</span>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-end mb-1 gap-2">
                                    <div className="min-w-0">
                                      <p className={\`font-bold text-xs truncate \$\{currentThemeStyle.textPrimary\}\`}>{challenge.title}</p>
                                      <p className="font-bold text-[10px] text-slate-400 flex items-center gap-1">
                                        Premio: +{challenge.reward.amount} {challenge.reward.type === 'coins' ? <Icon name="coins" size={14} className="inline-block text-amber-500" /> : <Icon name="ticket" size={14} className="inline-block text-blue-500" />}
                                      </p>
                                    </div>
                                    {isClaimed ? (
                                      <span className="text-[10px] font-black text-emerald-500 uppercase shrink-0">Completado</span>
                                    ) : isCompleted ? (
                                      <button onClick={() => claimChallenge(challenge)} className="text-[10px] font-black text-white bg-blue-500 hover:bg-blue-600 active:scale-95 px-2.5 py-1 rounded-lg shadow-sm transition-all cursor-pointer shrink-0">CANJEAR</button>
                                    ) : (
                                      <p className="font-bold text-xs text-slate-400 shrink-0">{challenge.current}/{challenge.target}</p>
                                    )}
                                  </div>
                                  <div className="w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full h-2.5 mt-1 overflow-hidden border border-slate-300/30">
                                     <motion.div
                                        initial={{ width: 0 }}
                                       animate={{ width: \`\$\{(challenge.current / challenge.target) * 100\}%\` }}
                                       transition={{ duration: 0.8, ease: 'easeOut' }}
                                       className={\`\$\{challenge.color\} h-full rounded-full\`}
                                     />
                                  </div>
                               </div>
                            </motion.div>
                          );
                        })}
                     </AnimatePresence>
                  </motion.div>
               </motion.div>

               {/* Tienda preview */}
`;

code = code.replace(/\{\/\* Tienda preview \*\/\}/g, blockToInsert.trim());

fs.writeFileSync('src/App.tsx', code);
