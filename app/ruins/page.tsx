"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Panorama from "@/components/Ruins";
import BottomBar from "@/components/ShareIcon";
import LoadingScreen from "@/components/LoadingPage";
import MuteButton from "@/components/MuteButton"; // ✅ Added
import { useAudio } from "@/contexts/AudioContext"; // ✅ Added

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const { isMuted } = useAudio(); // ✅ Access global mute state
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulated loading
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // ✅ Sync audio with global mute state and handle playback
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;

    const playAudio = () => {
      audioRef.current?.play().catch(() => {
        console.log("Audio waiting for user interaction");
      });
    };

    if (!loading) {
      playAudio();
    }

    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, [loading, isMuted]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {loading && <LoadingScreen progress={progress} />}

      {/* ✅ Mute Button positioned top-right (above navbar) */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      {/* ✅ Ambient Audio for Ruins */}
      <audio 
        ref={audioRef} 
        src="/sounds/ruins_ambient.webm" 
        loop 
      />

      <Navbar />
      <Panorama />
      <BottomBar />
    </main>
  );
}