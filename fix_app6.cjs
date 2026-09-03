const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const checkAnswerSubmit = \(e: React\.FormEvent\) => \{/,
  `const advanceEventProgress = () => {
    const nextStreak = streak + 1;
    let extraTickets = 0;
    let ticketsEarned = 0;
    
    if (nextStreak % 5 === 0) {
      extraTickets = nextStreak + ((equipedPet || PET_BUFFS[0]).buffType === 'combo_extra' ? (equipedPet || PET_BUFFS[0]).value : 0);
      ticketsEarned += extraTickets;
      setIsSupernova(true);
      playFrenzySound();
      setStats(prev => ({ ...prev, supernovas: prev.supernovas + 1 }));
    }
    
    const isInfiniteMode = viewMode === 'infinite_map';
    setUser(prev => prev ? {
        ...prev,
        tickets: prev.tickets + ticketsEarned,
        progress: isInfiniteMode ? prev.progress : Math.min(100, prev.progress + 1)
      } : null);
      if (isInfiniteMode && selectedTopic) {
        setInfiniteProgress(prev => ({
          ...prev,
          [selectedTopic]: (prev[selectedTopic] || 0) + 1
        }));
      }
      
      setStreak(nextStreak);
  };

  const checkAnswerSubmit = (e: React.FormEvent) => {`
);

code = code.replace(
  /const onFinishShellGame = \(piecesWon: number\) => \{[\s\S]*?setShowShellGame\(false\);/,
  `const onFinishShellGame = (piecesWon: number) => {
    setShowShellGame(false);
    advanceEventProgress();
  `
);

code = code.replace(
  /const onFinishPetRace = \(piecesWon: number\) => \{[\s\S]*?setShowPetRace\(false\);/,
  `const onFinishPetRace = (piecesWon: number) => {
    setShowPetRace(false);
    advanceEventProgress();
  `
);

fs.writeFileSync('src/App.tsx', code);
