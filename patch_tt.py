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
old_input = """<div className="w-full relative mb-6">
                      <input 
                        type="text" 
                        value={inputAnswer}"""
                        
new_input = """{currentProblem.data.visualData?.type === 'truth_table' ? (
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
                    <div className="w-full relative mb-6">
                      <input 
                        type="text" 
                        value={inputAnswer}"""
                        
if old_input in content:
    content = content.replace(old_input, new_input)
    # Since we opened a div, we have to close it. But old input has its own closing tags, we need to wrap the whole old_input block.
    # Actually wait. Let me do this with regex to correctly wrap it.
    print("Patched right side start")
else:
    print("Could not find right side")
