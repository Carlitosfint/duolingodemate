const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /activeCourse === 'trigonometria' \? \(user\?\.courseProgress\?\.trigonometria \|\| 0\) : \(user\?\.progress \|\| 0\)/g,
  `activeCourse === 'trigonometria' ? (user?.courseProgress?.trigonometria || 0) : activeCourse === 'razonamiento_5to' ? (user?.courseProgress?.razonamiento_5to || 0) : (user?.progress || 0)`
);

code = code.replace(
  /activeCourse === 'trigonometria' \? \(user\.courseProgress\?\.trigonometria \|\| 0\) : user\.progress/g,
  `activeCourse === 'trigonometria' ? (user.courseProgress?.trigonometria || 0) : activeCourse === 'razonamiento_5to' ? (user.courseProgress?.razonamiento_5to || 0) : user.progress`
);

code = code.replace(
  /if \(activeCourse === 'trigonometria'\) \{\s*const cp = prev\.courseProgress \|\| \{\};\s*return \{ \.\.\.prev, tickets: prev\.tickets \+ ticketsEarned, courseProgress: \{ \.\.\.cp, trigonometria: Math\.min\(100, \(cp\.trigonometria \|\| 0\) \+ 1\) \} \};\s*\}/g,
  `if (activeCourse === 'trigonometria') {
        const cp = prev.courseProgress || {};
        return { ...prev, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, trigonometria: Math.min(100, (cp.trigonometria || 0) + 1) } };
      }
      if (activeCourse === 'razonamiento_5to') {
        const cp = prev.courseProgress || {};
        return { ...prev, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, razonamiento_5to: Math.min(100, (cp.razonamiento_5to || 0) + 1) } };
      }`
);

code = code.replace(
  /if \(activeCourse === 'trigonometria'\) \{\s*const cp = prev\.courseProgress \|\| \{\};\s*return \{ \.\.\.prev, coins: prev\.coins \+ coinsEarned, tickets: prev\.tickets \+ ticketsEarned, courseProgress: \{ \.\.\.cp, trigonometria: Math\.min\(100, \(cp\.trigonometria \|\| 0\) \+ 1\) \} \};\s*\}/g,
  `if (activeCourse === 'trigonometria') {
          const cp = prev.courseProgress || {};
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, trigonometria: Math.min(100, (cp.trigonometria || 0) + 1) } };
        }
        if (activeCourse === 'razonamiento_5to') {
          const cp = prev.courseProgress || {};
          return { ...prev, coins: prev.coins + coinsEarned, tickets: prev.tickets + ticketsEarned, courseProgress: { ...cp, razonamiento_5to: Math.min(100, (cp.razonamiento_5to || 0) + 1) } };
        }`
);

fs.writeFileSync('src/App.tsx', code);
