import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_logic = """                             if (step > 0 && step % 20 === 0) {
                                playClickSound();
                                setShowTicketModal(true);
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             } else if (step > 0 && step % 12 === 0) {"""

new_logic = """                             if (step > 0 && step % 12 === 0) {"""

content = content.replace(old_logic, new_logic)

with open('src/App.tsx', 'w') as f:
    f.write(content)
