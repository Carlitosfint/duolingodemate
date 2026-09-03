import glob
import os

replacements = {
    '👍': '<Icon name="check" size={18} className="inline-block" />',
    '🗺': '<Icon name="home" size={18} className="inline-block" />',
    '✍': '<Icon name="book" size={18} className="inline-block" />',
    '👨': '<Icon name="user" size={18} className="inline-block" />',
    '🏫': '<Icon name="teacher" size={18} className="inline-block" />',
    '🔴': '<Icon name="x" size={18} className="inline-block text-red-500" />',
    '📐': '<Icon name="target" size={18} className="inline-block" />',
    '🛸': '<Icon name="ufo" size={18} className="inline-block" />',
    '🧩': '<Icon name="box" size={18} className="inline-block" />',
    '💔': '<Icon name="x" size={18} className="inline-block text-red-500" />',
    '🔢': '<Icon name="hash" size={18} className="inline-block" />',
    '💡': '<Icon name="zap" size={18} className="inline-block text-yellow-500" />',
    '➜': '<Icon name="arrow_right" size={18} className="inline-block" />',
    '✓': '<Icon name="check" size={18} className="inline-block" />',
    '🐂': '<Icon name="bull" size={18} className="inline-block" />',
    '🐱': '<Icon name="cat" size={18} className="inline-block" />',
    '🦉': '<Icon name="owl" size={18} className="inline-block" />',
    '🦊': '<Icon name="fox" size={18} className="inline-block" />',
    '💨': '<Icon name="zap" size={18} className="inline-block" />',
    '😢': '<Icon name="x" size={18} className="inline-block text-blue-500" />',
    '🎉': '<Icon name="sparkles" size={18} className="inline-block" />',
    '➡': '<Icon name="arrow_right" size={18} className="inline-block" />',
    '🎰': '<Icon name="ticket" size={18} className="inline-block" />',
    '🌟': '<Icon name="star" size={18} className="inline-block" />',
    '📂': '<Icon name="folder" size={18} className="inline-block" />',
    '📚': '<Icon name="book" size={18} className="inline-block" />',
    '🧠': '<Icon name="teacher" size={18} className="inline-block" />',
    '📥': '<Icon name="box" size={18} className="inline-block" />',
    '📵': '<Icon name="x" size={18} className="inline-block" />',
    '☄️': '<Icon name="zap" size={18} className="inline-block" />',
    '☄': '<Icon name="zap" size={18} className="inline-block" />',
    '🛡️': '<Icon name="shield" size={18} className="inline-block" />',
    '🛡': '<Icon name="shield" size={18} className="inline-block" />',
    '🏷️': '<Icon name="ticket" size={18} className="inline-block" />',
    '🏷': '<Icon name="ticket" size={18} className="inline-block" />',
    '🖼️': '<Icon name="star" size={18} className="inline-block" />',
    '🖼': '<Icon name="star" size={18} className="inline-block" />',
    '🔎': '<Icon name="target" size={18} className="inline-block" />',
    '🧪': '<Icon name="zap" size={18} className="inline-block" />',
    '☑️': '<Icon name="check" size={18} className="inline-block" />',
    '☑': '<Icon name="check" size={18} className="inline-block" />',
    '🎓': '<Icon name="teacher" size={18} className="inline-block" />',
    '✏️': '<Icon name="book" size={18} className="inline-block" />',
    '✏': '<Icon name="book" size={18} className="inline-block" />',
    '📘': '<Icon name="book" size={18} className="inline-block" />',
    '🦁': '<Icon name="dog" size={18} className="inline-block" />',
    '🐼': '<Icon name="cat" size={18} className="inline-block" />',
    '🐨': '<Icon name="cat" size={18} className="inline-block" />',
}

for filepath in glob.glob('src/components/*.tsx') + ['src/App.tsx']:
    with open(filepath, 'r') as f:
        content = f.read()
    
    modified = False
    
    for emoji, replacement in replacements.items():
        if emoji in content:
            content = content.replace(f">{emoji}", f">{replacement}")
            content = content.replace(f"{emoji} ", f"{replacement} ")
            content = content.replace(f" {emoji}", f" {replacement}")
            content = content.replace(f"'{emoji}'", f"'{emoji}'") # skip in string literals if they are just data mapping
            # actually we can just blindly replace in React node positions
            modified = True
            
    if modified:
        if "import { Icon }" not in content:
            if 'App.tsx' in filepath:
                content = "import { Icon } from './components/CustomIcons';\n" + content
            else:
                content = "import { Icon } from '../CustomIcons';\n" + content
                content = content.replace("from '../CustomIcons'", "from './CustomIcons'") # fix path
            
        with open(filepath, 'w') as f:
            f.write(content)

print("Done phase 3")
