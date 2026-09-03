const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { useAnimatedNumber }')) {
  code = code.replace(
    /import \{ generateMathProblem \} from '\.\/utils\/math';/,
    "import { generateMathProblem } from './utils/math';\nimport { useAnimatedNumber } from './utils/animated';"
  );
}

// Then find `const coins = user?.coins || 0;` and change it to animated.
code = code.replace(
  /const coins = user\?\.coins \|\| 0;\n  const tickets = user\?\.tickets \|\| 0;/,
  "const coinsReal = user?.coins || 0;\n  const ticketsReal = user?.tickets || 0;\n  const coins = useAnimatedNumber(coinsReal);\n  const tickets = useAnimatedNumber(ticketsReal);"
);

// We need to fix the case where coins and tickets are passed to components, or just let them receive the animated values (which is fine for display).
// But for stats or calculations we might need real.
// We probably want the animated ones for display, but real ones for updates. Since they just update the `user` state, we just display the animated values.

fs.writeFileSync('src/App.tsx', code);
