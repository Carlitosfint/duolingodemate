const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. In handleSkip (line 746 before, now somewhere near)
code = code.replace(
  /const prob = generateMathProblem\(isGolden, selectedTopic, user\?\.progress \|\| 0\);/g,
  `const prob = generateMathProblem(isGolden, selectedTopic, activeCourse === 'trigonometria' ? (user?.courseProgress?.trigonometria || 0) : (user?.progress || 0), activeCourse);`
);

// 2. In advanceEventProgress
code = code.replace(
  /setUser\(prev => prev \? \{\s*\.\.\.prev,\s*tickets: prev\.tickets \+ ticketsEarned,\s*progress: isInfiniteMode \? prev\.progress : Math\.min\(100, prev\.progress \+ 1\)\s*\} : null\);/,
  `setUser(prev => {
      if (!prev) return null;
      if (isInfiniteMode) {
        return { ...prev, tickets: prev.tickets + ticketsEarned };
      }
      if (activeCourse === 'trigonometria') {
        const cp = prev.courseProgress || {};
        return { ...prev, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, trigonometria: Math.min(100, (cp.trigonometria || 0) + 1) } };
      }
      return { ...prev, tickets: prev.tickets + ticketsEarned, progress: Math.min(100, prev.progress + 1) };
    });`
);

// 3. In checkAnswerSubmit success block
code = code.replace(
  /setUser\(prev => prev \? \{\s*\.\.\.prev,\s*coins: prev\.coins \+ coinsEarned,\s*tickets: prev\.tickets \+ ticketsEarned,\s*progress: isInfiniteMode \? prev\.progress : Math\.min\(100, prev\.progress \+ 1\)\s*\} : null\);/,
  `setUser(prev => {
        if (!prev) return null;
        if (isInfiniteMode) {
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned };
        }
        if (activeCourse === 'trigonometria') {
          const cp = prev.courseProgress || {};
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, trigonometria: Math.min(100, (cp.trigonometria || 0) + 1) } };
        }
        return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, progress: Math.min(100, prev.progress + 1) };
      });`
);

code = code.replace(
  /const nextProgress = isInfiniteMode \? user\.progress : Math\.min\(100, user\.progress \+ 1\);/,
  `const nextProgress = isInfiniteMode ? (activeCourse === 'trigonometria' ? (user.courseProgress?.trigonometria || 0) : user.progress) : Math.min(100, (activeCourse === 'trigonometria' ? (user.courseProgress?.trigonometria || 0) : user.progress) + 1);`
);

// 4. Update the map rendering variables
code = code.replace(
  /const progress = user\?\.progress \|\| 0;/g,
  `const progress = activeCourse === 'trigonometria' ? (user?.courseProgress?.trigonometria || 0) : (user?.progress || 0);`
);

// Also the "const nextProgress = Math.min(100, progress + 1);" is fine since progress is already mapped.

fs.writeFileSync('src/App.tsx', code);
