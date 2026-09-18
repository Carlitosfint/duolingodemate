import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from './CustomIcons';

export type ToastTone = 'warn' | 'info';

// In-app replacement for window.alert: the native dialog blocks the page,
// looks nothing like the rest of the app and shows the raw hostname on
// mobile ("localhost:3000 dice:").
export const Toast: React.FC<{ toast: { text: string; tone: ToastTone } | null }> = ({ toast }) => (
  <AnimatePresence>
    {toast && (
      <motion.div
        key={toast.text}
        initial={{ opacity: 0, y: -24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-sm pointer-events-none"
      >
        <div
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 shadow-lg backdrop-blur-sm font-black text-sm ${
            toast.tone === 'warn'
              ? 'bg-amber-50/95 border-amber-300 text-amber-800'
              : 'bg-blue-50/95 border-blue-300 text-blue-800'
          }`}
        >
          <span className="shrink-0">
            <Icon name={toast.tone === 'warn' ? 'alert' : 'sparkles'} size={20} />
          </span>
          <span className="leading-snug">{toast.text}</span>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
