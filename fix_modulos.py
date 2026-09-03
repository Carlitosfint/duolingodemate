import sys

# 1. Update ProgressMap.tsx
with open('src/components/ProgressMap.tsx', 'r') as f:
    content = f.read()

old_logic = """          const isUfo = step > 0 && step % 12 === 0;
          const isRace = step > 0 && step % 12 === 6;
          const isChest = step > 0 && step % 3 === 0 && !isRace && !isUfo;"""

new_logic = """          const isUfo = (step + 1) % 12 === 0;
          const isRace = (step + 1) % 12 === 6;
          const isChest = (step + 1) % 3 === 0 && !isRace && !isUfo;"""

content = content.replace(old_logic, new_logic)
with open('src/components/ProgressMap.tsx', 'w') as f:
    f.write(content)

# 2. Update App.tsx
with open('src/App.tsx', 'r') as f:
    app_content = f.read()

old_click = """                        } else if (step === progress) {
                          if (step > 0 && step % 3 === 0) {
                             if (step % 12 === 0) {
                                playClickSound();
                                setShowShellGame(true);
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             } else if (step % 12 === 6) {
                                playClickSound();
                                setShowPetRace(true);
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             } else {
                                playClickSound();
                                setOpenChestAnimation({ isOpen: true, rewardType: 'common', piecesWon: [], coinsWon: 250, ticketsWon: 5, rarity: 'common' });
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             }
                          } else {
                             playClickSound();
                             setViewMode('exercise');
                          }
                        }"""

new_click = """                        } else if (step === progress) {
                          if ((step + 1) % 3 === 0) {
                             if ((step + 1) % 12 === 0) {
                                playClickSound();
                                setShowShellGame(true);
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             } else if ((step + 1) % 12 === 6) {
                                playClickSound();
                                setShowPetRace(true);
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             } else {
                                playClickSound();
                                setOpenChestAnimation({ isOpen: true, rewardType: 'common', piecesWon: [], coinsWon: 250, ticketsWon: 5, rarity: 'common' });
                                setUser(prev => prev ? { ...prev, progress: prev.progress + 1 } : null);
                             }
                          } else {
                             playClickSound();
                             setViewMode('exercise');
                          }
                        }"""

app_content = app_content.replace(old_click, new_click)

old_past = """                        if (step < progress) {
                          if (step % 3 !== 0) setViewMode('exercise');
                          else alert("Ya reclamaste esta recompensa en el pasado.");
                        }"""

new_past = """                        if (step < progress) {
                          if ((step + 1) % 3 !== 0) setViewMode('exercise');
                          else alert("Ya reclamaste esta recompensa en el pasado.");
                        }"""

app_content = app_content.replace(old_past, new_past)

# Reward text
old_reward = """    if (nextProgress > 0 && nextProgress % 12 === 0) return "¡Minijuego Shell Game!";
    if (nextProgress > 0 && nextProgress % 12 === 6) return "¡Carrera de Campeones!";
    if (nextProgress > 0 && nextProgress % 3 === 0) return "¡Cofre de Recompensas!";"""

new_reward = """    if ((nextProgress + 1) % 12 === 0) return "¡Minijuego Shell Game!";
    if ((nextProgress + 1) % 12 === 6) return "¡Carrera de Campeones!";
    if ((nextProgress + 1) % 3 === 0) return "¡Cofre de Recompensas!";"""

app_content = app_content.replace(old_reward, new_reward)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)

