import sys
import glob

replacements = {
    '⭐': '<Icon name="star" className="inline-block" size={18} />',
    '🔒': '<Icon name="lock" className="inline-block" size={18} />',
    '🔓': '<Icon name="unlock" className="inline-block" size={18} />',
    '📦': '<Icon name="box" className="inline-block" size={18} />',
    '🏁': '<Icon name="flag" className="inline-block" size={18} />',
    '🚀': '<Icon name="sprout" className="inline-block" size={18} />',
    '🎁': '<Icon name="gift" className="inline-block" size={18} />',
    '📅': '<Icon name="book" className="inline-block" size={18} />',
    '📰': '<Icon name="store" className="inline-block" size={18} />',
    '💸': '<Icon name="flying_money" className="inline-block" size={18} />',
    '👑': '<Icon name="crown" className="inline-block" size={18} />',
    '💎': '<Icon name="diamond" className="inline-block" size={18} />',
    '🌱': '<Icon name="sprout" className="inline-block" size={18} />',
    '📈': '<Icon name="trending_up" className="inline-block" size={18} />',
    '📉': '<Icon name="trending_down" className="inline-block" size={18} />',
    '⚡': '<Icon name="zap" className="inline-block" size={18} />',
    '🏛️': '<Icon name="bank" className="inline-block" size={18} />',
    '❌': '<Icon name="x" className="inline-block" size={18} />',
    '✅': '<Icon name="check" className="inline-block" size={18} />',
    '📊': '<Icon name="trending_up" className="inline-block" size={18} />',
}

for filepath in glob.glob('src/components/*.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()
    
    modified = False
    
    # Check if there are emojis in the file before doing replacements
    for emoji, replacement in replacements.items():
        if emoji in content:
            # We don't want to replace emojis in types or imports
            content = content.replace(f">{emoji}", f">{replacement}")
            content = content.replace(f"{emoji} ", f"{replacement} ")
            content = content.replace(f" {emoji}", f" {replacement}")
            modified = True
            
    if modified:
        if "import { Icon }" not in content:
            content = "import { Icon } from '../CustomIcons';\n" + content
            content = content.replace("from '../CustomIcons'", "from './CustomIcons'") # just to fix path
            
        with open(filepath, 'w') as f:
            f.write(content)

with open('src/App.tsx', 'r') as f:
    content = f.read()

for emoji, replacement in replacements.items():
    if emoji in content:
        content = content.replace(f">{emoji}", f">{replacement}")
        content = content.replace(f"{emoji} ", f"{replacement} ")
        content = content.replace(f" {emoji}", f" {replacement}")

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done phase 2")
