const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /import \{ PuzzleSlice \} from '\.\/components\/PuzzleSlice';/,
  "import { PuzzleSlice } from './components/PuzzleSlice';\nimport { ProblemVisualizer } from './components/Visualizer';"
);

// We need to inject the ProblemVisualizer in the exercise render area.
// Find:
// {currentProblem.data.intro}
// </p>
// 
// And replace with:
// {currentProblem.data.intro}
// </p>
// {currentProblem.data.visualData && <ProblemVisualizer data={currentProblem.data.visualData} />}
code = code.replace(
  /\{currentProblem\.data\.intro\}\s*<\/p>/,
  `{currentProblem.data.intro}
              </p>
              {currentProblem.data.visualData && <ProblemVisualizer data={currentProblem.data.visualData} />}`
);

fs.writeFileSync('src/App.tsx', code);
