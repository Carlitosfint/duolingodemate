const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("ProblemVisualizer")) {
    code = code.replace(
      /import \{ ProgressMap \} from '\.\/components\/ProgressMap';/,
      "import { ProgressMap } from './components/ProgressMap';\nimport { ProblemVisualizer } from './components/Visualizer';"
    );
    
    code = code.replace(
      /\{currentProblem\.data\.intro\}\s*<\/p>/,
      `{currentProblem.data.intro}
              </p>
              {currentProblem.data.visualData && <ProblemVisualizer data={currentProblem.data.visualData} />}`
    );
} else {
    // Already contains it, just fix the import
    if (!code.includes("import { ProblemVisualizer }")) {
        code = code.replace(
          /import \{ ProgressMap \} from '\.\/components\/ProgressMap';/,
          "import { ProgressMap } from './components/ProgressMap';\nimport { ProblemVisualizer } from './components/Visualizer';"
        );
    }
}

// Fix isInfiniteMode
code = code.replace(
  /const checkAnswerSubmit = \(e: React\.FormEvent\) => \{/,
  "const checkAnswerSubmit = (e: React.FormEvent) => {\n    const isInfiniteMode = viewMode === 'infinite_map';"
);

// Fix setShowUfoGame (just stub them)
code = code.replace(
  /setShowUfoGame\(true\);/g,
  "console.log('UFO');"
);
code = code.replace(
  /setShowPetRace\(true\);/g,
  "console.log('Pet');"
);
code = code.replace(
  /setShowShellGame\(true\);/g,
  "console.log('Shell');"
);

fs.writeFileSync('src/App.tsx', code);
