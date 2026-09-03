import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_logic = """      // Trigger milestones UI
      if (earnedRoulette) {
        setTimeout(() => { setShowTicketModal(true); }, 2200);
      } else if (earnedShell) {
        setTimeout(() => { setShowShellGame(true); }, 2200);
      } else if (earnedRace) {
        setTimeout(() => { setShowPetRace(true); }, 2200);
      } else if (earnedChest) {"""

new_logic = """      // Trigger milestones UI
      if (earnedShell) {
        setTimeout(() => { setShowShellGame(true); }, 2200);
      } else if (earnedRace) {
        setTimeout(() => { setShowPetRace(true); }, 2200);
      } else if (earnedChest) {"""

content = content.replace(old_logic, new_logic)

with open('src/App.tsx', 'w') as f:
    f.write(content)
