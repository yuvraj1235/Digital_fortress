"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Panorama from "@/components/village";
import BottomBar from "@/components/ShareIcon";
import LoadingScreen from "@/components/LoadingPage";
import MuteButton from "@/components/MuteButton"; // ✅ Added
import { useAudio } from "@/contexts/AudioContext"; // ✅ Added

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const { isMuted } = useAudio(); // ✅ Access global mute state
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulated loading logic
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

  // ✅ Audio Sync Logic
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Keep HTML audio element in sync with the global toggle
    audioRef.current.muted = isMuted;

    const playAudio = () => {
      audioRef.current?.play().catch(() => {
        console.log("Autoplay blocked: Waiting for user interaction.");
      });
    };

    // Play once loading is finished
    if (!loading) {
      playAudio();
    }

    // Fallback: Enable sound on first click
    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, [loading, isMuted]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Show loading screen until progress is 100% */}
      {loading && <LoadingScreen progress={progress} />}

      {/* ✅ Mute Button positioned top-right */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      {/* ✅ Ambient Audio Element */}
      <audio 
        ref={audioRef} 
        src="/sounds/village_ambient.webm" // Suggestion: specific sound for village
        loop 
      />

      <Navbar />
      <Panorama />
      <BottomBar />
    </main>
  );
}