import sys

with open('src/components/UI.tsx', 'r') as f:
    content = f.read()

old_import = "import React from 'react';\nimport { playClickSound } from '../utils/audio';"
new_import = "import React from 'react';\nimport { motion } from 'motion/react';\nimport { playClickSound } from '../utils/audio';"
content = content.replace(old_import, new_import)

old_bento_button = """  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        title={title} 
        className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-[3px] shadow-sm group transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 text-left w-full block ${gridClasses} ${className}`}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <div 
      title={title} 
      className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-[3px] shadow-sm group transition-all duration-300 ${gridClasses} ${className}`}
    >
      {innerContent}
    </div>
  );"""

new_bento_button = """  if (onClick) {
    return (
      <motion.button 
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.96, y: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={onClick} 
        title={title} 
        className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] md:active:border-b-[3px] shadow-sm group cursor-pointer text-left w-full block ${gridClasses} ${className}`}
      >
        {innerContent}
      </motion.button>
    );
  }

  return (
    <motion.div 
      title={title} 
      className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-x-[3px] md:border-t-[3px] md:border-b-[6px] shadow-sm group ${gridClasses} ${className}`}
    >
      {innerContent}
    </motion.div>
  );"""

content = content.replace(old_bento_button, new_bento_button)

with open('src/components/UI.tsx', 'w') as f:
    f.write(content)

