const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{showWelcomeBonus && \(/,
  `{showChallenges && (
        <DailyChallengesModal
          dailyChallenges={dailyChallenges}
          claimedChallenges={claimedChallenges}
          claimChallenge={handleClaimChallenge}
          onClose={() => { playClickSound(); setShowChallenges(false); }}
          currentThemeStyle={currentThemeStyle}
        />
      )}
      {showWelcomeBonus && (`
);

fs.writeFileSync('src/App.tsx', code);
