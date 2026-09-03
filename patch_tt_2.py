import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add import
if "import { TruthTableInput } from './components/TruthTableInput';" not in content:
    content = content.replace("import { ProblemVisualizer } from './components/Visualizer';", "import { ProblemVisualizer } from './components/Visualizer';\nimport { TruthTableInput } from './components/TruthTableInput';")

# Change left side rendering
old_vis = "{currentProblem.data.visualData && <ProblemVisualizer data={currentProblem.data.visualData} />}"
new_vis = "{currentProblem.data.visualData && currentProblem.data.visualData.type !== 'truth_table' && <ProblemVisualizer data={currentProblem.data.visualData} />}"

if old_vis in content:
    content = content.replace(old_vis, new_vis)
    print("Patched left side")
else:
    print("Could not find left side")

# Change right side input
# I want to find the <input> wrapper block:
# <div className="w-full relative mb-6">
#   <input ... />
#   {currentProblem.data.unit && ...}
# </div>
#
# Let's do it using regex to grab the exact block.

pattern = re.compile(r'(<div className="w-full relative mb-6">.*?</div>)', re.DOTALL)
match = pattern.search(content)
if match:
    original_div = match.group(1)
    
    new_div = """{currentProblem.data.visualData?.type === 'truth_table' ? (
                      <TruthTableInput 
                        formula={currentProblem.data.visualData.formula}
                        value={inputAnswer}
                        onChange={(val) => {
                          setInputAnswer(val);
                          if (previewTheme) setPreviewTheme(null);
                        }}
                        disabled={currentProblem.solved}
                        isShaking={isShaking}
                      />
                    ) : (
                      """ + original_div + """
                    )}"""
    content = content[:match.start()] + new_div + content[match.end():]
    print("Patched right side")
else:
    print("Could not find right side")

with open("src/App.tsx", "w") as f:
    f.write(content)
