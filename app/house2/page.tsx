"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Panorama from "@/components/House2";
import BottomBar from "@/components/ShareIcon";
import LoadingScreen from "@/components/LoadingPage";
import MuteButton from "@/components/MuteButton"; // ✅ Added
import { useAudio } from "@/contexts/AudioContext"; // ✅ Added

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const { isMuted } = useAudio(); // ✅ Get global mute state
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Loading Simulation
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

  // 2. ✅ Sync Audio with Global Mute State
  useEffect(() => {
    if (!audioRef.current) return;

    // Apply global mute state to the local audio element
    audioRef.current.muted = isMuted;

    const playAudio = () => {
      audioRef.current?.play().catch(() => {
        console.log("Waiting for user interaction to play audio");
      });
    };

    if (!loading) {
      playAudio();
    }

    // Fallback for browser autoplay restrictions
    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, [loading, isMuted]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Loading Screen Overlay */}
      {loading && <LoadingScreen progress={progress} />}

      {/* ✅ Mute Button Overlay (z-index 60 ensures it's above Navbar z-50) */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      {/* ✅ Specific Audio for House2 */}
      <audio 
        ref={audioRef} 
        src="/sounds/house_ambient.webm" 
        loop 
      />

      <Navbar />
      <Panorama />
      <BottomBar />
    </main>
  );
}