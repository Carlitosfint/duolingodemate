import sys

with open('src/App.tsx', 'r') as f:
    content = f.read()

start_marker = "<ProgressMap progress={progress} onNodeClick={(step) => {"
end_marker = "}} />"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers")
    sys.exit(1)

new_click_handler = """<ProgressMap progress={progress} onNodeClick={(step) => {
                        if (step < progress) {
                          if ((step + 1) % 3 !== 0) setViewMode('exercise');
                          else alert("Ya reclamaste esta recompensa en el pasado.");
                        } else if (step === progress) {
                          if ((step + 1) % 3 === 0) { 
                             if (step > 0 && (step + 1) % 21 === 0) {
                                playClickSound();
                                setShowShellGame(true);
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             } else {
                                playClickSound();
                                setOpenChestAnimation({ isOpen: true, rewardType: 'common', piecesWon: [], coinsWon: 250, ticketsWon: 5, rarity: 'common' });
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             }
                          } else {
                             setViewMode('exercise');
                          }
                        }
                     """

content = content[:start_idx] + new_click_handler + content[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done")
