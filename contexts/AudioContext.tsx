// context/AudioContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioContext = createContext({
  isMuted: false,
  toggleMute: () => {},
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('isMuted') === 'true';
    setIsMuted(saved);
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem('isMuted', String(newState));
      return newState;
    });
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);