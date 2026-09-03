import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_block = """      // Check path milestones triggers
      const nextProgress = Math.min(200, user.progress + 1);
      const earnedShell = nextProgress > 0 && nextProgress % 12 === 0;
      const earnedRace = nextProgress > 0 && nextProgress % 12 === 6;
      const earnedChest = nextProgress > 0 && nextProgress % 2 === 0 && !earnedShell && !earnedRace;"""

new_block = """      // Store nextProgress to use later if needed
      const nextProgress = Math.min(200, user.progress + 1);"""

content = content.replace(old_block, new_block)

old_milestones = """      // Trigger milestones UI
      if (earnedShell) {
        setTimeout(() => { setShowShellGame(true); }, 2200);
      } else if (earnedRace) {
        setTimeout(() => { setShowPetRace(true); }, 2200);
      } else if (earnedChest) {
        setTimeout(() => { openRandomChest(nextProgress % 10 === 0 ? 'legendary' : (nextProgress % 4 === 0 ? 'rare' : 'common')); }, 2200);
      }"""

new_milestones = """      // Events are now handled from the map directly, not auto-triggered here."""

content = content.replace(old_milestones, new_milestones)

with open('src/App.tsx', 'w') as f:
    f.write(content)
