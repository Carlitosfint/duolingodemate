import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

old_logic = """      // Check path milestones triggers
      const nextProgress = Math.min(200, user.progress + 1);
      const earnedRoulette = nextProgress > 0 && nextProgress % 20 === 0;
      const earnedShell = nextProgress > 0 && nextProgress % 12 === 0 && !earnedRoulette;
      const earnedRace = nextProgress > 0 && nextProgress % 12 === 6 && !earnedRoulette;
      const earnedChest = nextProgress > 0 && nextProgress % 2 === 0 && !earnedRoulette && !earnedShell && !earnedRace;"""

new_logic = """      // Check path milestones triggers
      const nextProgress = Math.min(200, user.progress + 1);
      const earnedShell = nextProgress > 0 && nextProgress % 12 === 0;
      const earnedRace = nextProgress > 0 && nextProgress % 12 === 6;
      const earnedChest = nextProgress > 0 && nextProgress % 2 === 0 && !earnedShell && !earnedRace;"""

content = content.replace(old_logic, new_logic)

with open('src/App.tsx', 'w') as f:
    f.write(content)
