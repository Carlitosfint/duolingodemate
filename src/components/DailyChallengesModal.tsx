import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './CustomIcons';

type DailyChallengesModalProps = {
  dailyChallenges: any[];
  claimedChallenges: number[];
  claimChallenge: (challenge: any) => void;
  onClose: () => void;
  currentThemeStyle: any;
};

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  dailyChallenges,
  claimedChallenges,
  claimChallenge,
  onClose,
  currentThemeStyle
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border-2 flex flex-col max-h-[90vh] ${currentThemeStyle.cardBg}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${currentThemeStyle.textPrimary}`}>
             <Icon name="star" size={28} className="text-amber-500" /> Desafíos del Día
          </h2>
          <button 
            onClick={onClose}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors ${currentThemeStyle.textPrimary}`}
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto no-scrollbar pr-2 pb-4">
          <AnimatePresence initial={false} mode="popLayout">
            {dailyChallenges.map((challenge, idx) => {
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
                  className={`flex items-center gap-3.5 p-3 rounded-2xl transition-colors border border-black/5 ${isClaimed ? 'opacity-60 bg-black/5' : 'bg-black/5 shadow-sm'}`}
                >
                   <span className="text-3xl filter drop-shadow-sm shrink-0">{challenge.icon}</span>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-end mb-1 gap-2">
                        <div className="min-w-0">
                          <p className={`font-bold text-sm truncate ${currentThemeStyle.textPrimary}`}>{challenge.title}</p>
                          <p className={`font-bold text-xs flex items-center gap-1 mt-0.5 ${currentThemeStyle.textSecondary}`}>
                            Premio: +{challenge.reward.amount} {challenge.reward.type === 'coins' ? <Icon name="coins" size={14} className="inline-block text-amber-500" /> : <Icon name="ticket" size={14} className="inline-block text-blue-500" />}
                          </p>
                        </div>
                        {isClaimed ? (
                          <span className="text-xs font-black text-emerald-500 uppercase shrink-0 bg-emerald-500/10 px-2 py-1 rounded-md">Hecho</span>
                        ) : isCompleted ? (
                          <button onClick={() => claimChallenge(challenge)} className="text-[10px] font-black text-white bg-blue-500 hover:bg-blue-600 active:scale-95 px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer shrink-0 uppercase tracking-widest">Canjear</button>
                        ) : (
                          <p className={`font-bold text-xs shrink-0 bg-black/10 px-2 py-1 rounded-md ${currentThemeStyle.textSecondary}`}>{challenge.current}/{challenge.target}</p>
                        )}
                      </div>
                      <div className="w-full bg-black/10 rounded-full h-2.5 mt-2 overflow-hidden border border-black/5">
                         <motion.div
                            initial={{ width: 0 }}
                           animate={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                           transition={{ duration: 0.8, ease: 'easeOut' }}
                           className={`${challenge.color} h-full rounded-full`}
                         />
                      </div>
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
