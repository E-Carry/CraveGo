import React, { createContext, useContext, useState, useRef } from 'react';

interface AudioContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
  playAdd: () => void;
  playRemove: () => void;
  playSuccess: () => void;
  playDing: () => void;
  playError: () => void;
}

const CraveAudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('cravego-sound');
    return saved !== null ? saved === 'true' : true;
  });

  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('cravego-sound', String(next));
      return next;
    });
  };

  const playTone = (freq: number, type: OscillatorType, duration: number, startDelay = 0, gainLevel = 0.08) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + startDelay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(gainLevel, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore audio autoplay restrictions
    }
  };

  const playClick = () => {
    playTone(800, 'sine', 0.04, 0, 0.04);
  };

  const playAdd = () => {
    // Upbeat dual chime (C5 to G5)
    playTone(523.25, 'triangle', 0.08, 0, 0.08);
    playTone(783.99, 'sine', 0.12, 0.06, 0.09);
  };

  const playRemove = () => {
    // Low pop (F4 to C4)
    playTone(349.23, 'sine', 0.08, 0, 0.06);
    playTone(261.63, 'sine', 0.1, 0.05, 0.05);
  };

  const playSuccess = () => {
    // Celebration harmonic arpeggio (C5 -> E5 -> G5 -> C6)
    playTone(523.25, 'sine', 0.12, 0, 0.1);
    playTone(659.25, 'sine', 0.12, 0.08, 0.1);
    playTone(783.99, 'sine', 0.15, 0.16, 0.12);
    playTone(1046.5, 'triangle', 0.35, 0.24, 0.15);
  };

  const playDing = () => {
    playTone(880, 'sine', 0.25, 0, 0.08);
  };

  const playError = () => {
    playTone(220, 'sawtooth', 0.12, 0, 0.06);
    playTone(180, 'sawtooth', 0.18, 0.06, 0.06);
  };

  return (
    <CraveAudioContext.Provider value={{ soundEnabled, toggleSound, playClick, playAdd, playRemove, playSuccess, playDing, playError }}>
      {children}
    </CraveAudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(CraveAudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
