"use client";
import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingPage";
import { useEffect, useState, useRef } from "react";
import { useProgress } from "@react-three/drei";
import BottomBar from "@/components/ShareIcon";
import CustomCursor from "@/components/CustomCursor";
import Snowfall from "react-snowfall";
import { useAudio } from "@/contexts/AudioContext"; 
import MuteButton from "@/components/MuteButton"; 
import { useRouter } from "next/navigation"; // Import Router
import Image from "next/image"; // Import Image for the button texture

export default function Home() {
  const router = useRouter(); // Initialize Router
  const { progress: realProgress, active } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [effectiveProgress, setEffectiveProgress] = useState(0);
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Smooth Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // 2. Progress Synchronization
  useEffect(() => {
    if (!active && realProgress >= 100) {
      setEffectiveProgress(100);
    } else {
      setEffectiveProgress(Math.max(realProgress, simulatedProgress));
    }
  }, [active, realProgress, simulatedProgress]);

  // 3. Audio Control
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = isMuted;

    const playAudio = () => {
      audioRef.current?.play().catch(() => {});
    };

    if (effectiveProgress === 100) {
      playAudio();
    }

    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, [effectiveProgress, isMuted]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <Snowfall snowflakeCount={700} style={{ position: "fixed", inset: 0, zIndex: 30, pointerEvents: "none" }} />
      <CustomCursor />
      
      {effectiveProgress < 100 && <LoadingScreen progress={effectiveProgress} />}

      {/* LEADERBOARD & MUTE CONTROLS */}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-4 items-center">
        <MuteButton />
        
        {/* Leaderboard Shortcut */}
      {/* SIMPLE LEADERBOARD & MUTE CONTROLS */}
<div className="fixed top-24 right-6 z-[60] flex flex-col gap-3 items-center">
  <MuteButton />
  
    <button 
    onClick={() => router.push("/leaderboard")}
    className="w-12 h-12 flex items-center justify-center bg-black/60 border border-[#3fb4ff]/50 rounded-lg text-xl hover:bg-[#3fb4ff]/20 hover:border-[#3fb4ff] transition-all"
    title="Leaderboard"
  >
    LB
  </button>
</div>
      </div>

      <audio ref={audioRef} src="/sounds/waves.webm" autoPlay loop />

      <Navbar />
      <IslandScene />
      <BottomBar />
    </main>
  );
}