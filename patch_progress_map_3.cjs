const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressMap.tsx', 'utf8');

code = code.replace(
  /interface ProgressMapProps \{\n\s*progress: number;\n\s*onNodeClick\?: \(step: number\) => void;\n\}/,
  `interface ProgressMapProps {
  progress: number;
  onNodeClick?: (step: number) => void;
  isInfiniteMode?: boolean;
  infiniteTopicName?: string;
  totalStepsOverride?: number;
}`
);

code = code.replace(
  /export const ProgressMap: React\.FC<ProgressMapProps> = \(\{ progress, onNodeClick \}\) => \{/,
  `export const ProgressMap: React.FC<ProgressMapProps> = ({ progress, onNodeClick, isInfiniteMode, infiniteTopicName, totalStepsOverride }) => {`
);

code = code.replace(
  /const totalSteps = 100;/,
  `const totalSteps = totalStepsOverride || 100;`
);

code = code.replace(
  /const isSectionGate = step > 0 && step % 20 === 0;\s*if \(isSectionGate\) \{/,
  `const isSectionGate = !isInfiniteMode && step > 0 && step % 20 === 0;
          const isInfiniteMilestone = isInfiniteMode && step > 0 && step % 10 === 0;

          if (isSectionGate || isInfiniteMilestone) {`
);

code = code.replace(
  /const topicName = step === 20 \? 'Criptoaritmética' : step === 40 \? 'Lógica Recreativa' : step === 60 \? 'Cronometría Básica' : step === 80 \? 'Conteo de Figuras' : 'Campeón';/,
  `const topicName = isInfiniteMode ? \`Nivel \${step}\` : (step === 20 ? 'Criptoaritmética' : step === 40 ? 'Lógica Recreativa' : step === 60 ? 'Cronometría Básica' : step === 80 ? 'Conteo de Figuras' : 'Campeón');`
);

fs.writeFileSync('src/components/ProgressMap.tsx', code);
