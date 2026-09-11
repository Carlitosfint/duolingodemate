let globalAudioCtx: AudioContext | null = null;

export const getAudioCtx = (): AudioContext | null => {
  try {
    if (!globalAudioCtx) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) globalAudioCtx = new Ctx();
    }
    if (globalAudioCtx && globalAudioCtx.state === 'suspended') {
      globalAudioCtx.resume().catch(() => {});
    }
    return globalAudioCtx;
  } catch (e) {
    console.warn("Audio bloqueado:", e);
    return null;
  }
};

export const playClickSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

export const playCatchSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

export const playErrorAlertSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
};

export const playRouletteTick = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {}
};

export const startTickingSound = (duration: number) => {
  let start = Date.now();
  let delay = 30;
  const tick = () => {
    let elapsed = Date.now() - start;
    if (elapsed < duration) {
      playRouletteTick();
      delay = 30 + Math.pow((elapsed / duration), 3) * 600;
      setTimeout(tick, delay);
    }
  };
  tick();
};

export const playFrenzySound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    [300, 400, 500, 600].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.4);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.4);
    });
  } catch (e) {}
};

export const playShieldSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
};

export const playRainbowSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1 + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    });
  } catch (e) {}
};

export const playRumbleSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(30, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.5);
    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  } catch (e) {}
};

export const playEpicRevealSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    [880, 1108.73, 1318.51, 1760].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.05 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + 2.0);
    });
  } catch (e) {}
};

let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let musicIntervalId: any = null;
let currentMusicTheme: string | null = null;
export let isMusicEnabled = false;

export const setMusicEnabled = (enabled: boolean) => {
  isMusicEnabled = enabled;
  if (!enabled) {
    if (musicIntervalId) {
      clearInterval(musicIntervalId);
      musicIntervalId = null;
    }
    activeOscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    activeOscillators = [];
    currentMusicTheme = null;
  }
};

export const playThemeAmbientMusic = (themeId: string) => {
  try {
    if (!isMusicEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    if (currentMusicTheme === themeId && musicIntervalId) {
      return;
    }

    currentMusicTheme = themeId;

    if (musicIntervalId) {
      clearInterval(musicIntervalId);
      musicIntervalId = null;
    }

    activeOscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    activeOscillators = [];

    const playChord = () => {
      if (ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      let freqs: number[] = [];
      let type: OscillatorType = 'sine';
      let decay = 4.0;
      let vol = 0.01;

      if (themeId === 'default') {
        freqs = [261.63, 329.63, 392.00, 440.00]; // C4, E4, G4, A4
        type = 'sine';
        decay = 4.5;
        vol = 0.008;
      } else if (themeId === 'neon') {
        freqs = [220.00, 261.63, 329.63, 493.88]; // A3, C4, E4, B4
        type = 'triangle';
        decay = 4.5;
        vol = 0.006;
      } else if (themeId === 'galaxy') {
        freqs = [329.63, 493.88, 587.33, 659.25, 880.00]; // E4, B4, D5, E5, A5
        type = 'sine';
        decay = 5.5;
        vol = 0.005;
      } else if (themeId === 'volcano') {
        freqs = [110.00, 164.81, 220.00, 261.63]; // A2, E3, A3, C4
        type = 'triangle';
        decay = 5.5;
        vol = 0.01;
      } else if (themeId === 'forest') {
        freqs = [261.63, 349.23, 440.00, 523.25]; // C4, F4, A4, C5
        type = 'sine';
        decay = 3.5;
        vol = 0.008;
      }

      freqs.forEach((freq, i) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = type;
          osc.frequency.setValueAtTime(freq, now + i * 0.15);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(vol, now + 0.6 + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, now + decay);

          osc.start(now);
          osc.stop(now + decay);

          activeOscillators.push({ osc, gain });

          setTimeout(() => {
            activeOscillators = activeOscillators.filter(item => item.osc !== osc);
          }, decay * 1000 + 500);
        } catch (e) {}
      });

      if (themeId === 'forest' && Math.random() > 0.4) {
        setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            const baseChirp = 1200 + Math.random() * 800;
            osc.frequency.setValueAtTime(baseChirp, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(baseChirp + 200, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.003, ctx.currentTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
          } catch (e) {}
        }, 1500);
      } else if (themeId === 'galaxy' && Math.random() > 0.4) {
        setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800 + Math.random() * 900, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.003, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
          } catch (e) {}
        }, 2000);
      }
    };

    playChord();
    musicIntervalId = setInterval(playChord, 5000);
  } catch (e) {
    console.error("Ambient music error:", e);
  }
};


export const playTransitionSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};

export const playRevealSound = () => {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};
