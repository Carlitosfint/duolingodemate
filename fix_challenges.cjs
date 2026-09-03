const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { DailyChallengesModal }')) {
  code = code.replace(
    /import \{ WelcomeBonusModal \} from '\.\/components\/WelcomeBonusModal';/,
    "import { WelcomeBonusModal } from './components/WelcomeBonusModal';\nimport { DailyChallengesModal } from './components/DailyChallengesModal';"
  );
}

// Add state
if (!code.includes('const [showChallenges, setShowChallenges] = useState(false);')) {
  code = code.replace(
    /const \[showProfile, setShowProfile\] = useState\(false\);/,
    "const [showProfile, setShowProfile] = useState(false);\n  const [showChallenges, setShowChallenges] = useState(false);"
  );
}

// Replace Zap header with Target button
code = code.replace(
  /<div className="hidden sm:flex items-center gap-1\.5 px-3 text-slate-300">\s*<span className="text-sm opacity-50 filter grayscale"><Icon name="zap" className="inline-block" size=\{18\} \/><\/span>\s*<div className="w-5 h-1\.5 bg-slate-200 rounded-full"><\/div>\s*<div className="w-5 h-1\.5 bg-slate-200 rounded-full"><\/div>\s*<div className="w-5 h-1\.5 bg-slate-200 rounded-full"><\/div>\s*<\/div>/,
  `<button 
             onClick={() => { playClickSound(); setShowChallenges(true); }}
             className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg md:text-xl border-2 border-blue-200 hover:scale-105 active:scale-95 transition-all shadow-sm relative indestructible-btn"
             title="Desafíos del Día"
           >
             <Icon name="target" size={18} className="inline-block" />
           </button>`
);

// Remove Desafios block from right sidebar (lines 1757-1830 approximately)
// It starts with {/* Desafíos del día */} and ends before {/* Poderes Rápidos */}
// Let's use regex matching the whole block.
code = code.replace(
  /\s*\{\/\* Desafíos del día \*\/\}\s*<motion\.div layout transition=\{\{ layout: \{ duration: 0\.35, ease: \[0\.16, 1, 0\.3, 1\] \} \}\} className=\{\`rounded-\[2rem\] border-2 p-5 shadow-sm \$\{currentThemeStyle\.cardBg\}\`\}>[\s\S]*?<\/motion\.div>\s*<\/motion\.div>/,
  ''
);

// Insert the modal in the render tree, next to WelcomeBonusModal
code = code.replace(
  /\{showWelcomeBonus && user && \(/,
  `{showChallenges && (
        <DailyChallengesModal
          dailyChallenges={dailyChallenges}
          claimedChallenges={claimedChallenges}
          claimChallenge={handleClaimChallenge}
          onClose={() => { playClickSound(); setShowChallenges(false); }}
          currentThemeStyle={currentThemeStyle}
        />
      )}
      {showWelcomeBonus && user && (`
);

fs.writeFileSync('src/App.tsx', code);
