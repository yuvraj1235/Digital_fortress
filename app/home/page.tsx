"use client";
import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingPage";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import BottomBar from "@/components/ShareIcon";
import CustomCursor from "@/components/CustomCursor";
import Snowfall from "react-snowfall";
import { useAudio } from "@/contexts/AudioContext"; // ✅ Import the hook
import MuteButton from "@/components/MuteButton"; // ✅ Import the button

export default function Home() {
  const { progress: realProgress, active } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [effectiveProgress, setEffectiveProgress] = useState(0);
  
  const { isMuted } = useAudio(); // ✅ Get mute state

  // ... (Keep your existing Progress Logic)

  // 3. Audio Logic
  useEffect(() => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement;
    if (!audio) return;

    // ✅ Sync the audio element with the global mute state
    audio.muted = isMuted;

    const playAudio = () => {
      // Don't force unmuted here, respect the global state
      if (audio.paused) {
        audio.play().catch((e) => {
          console.warn("Autoplay blocked", e);
        });
      }
    };

    if (effectiveProgress === 100) {
      playAudio();
    }

    const enableSound = () => {
      playAudio();
      window.removeEventListener("click", enableSound);
    };
    window.addEventListener("click", enableSound);
    return () => window.removeEventListener("click", enableSound);
  }, [effectiveProgress, isMuted]); // ✅ Add isMuted to dependency array

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Snowfall snowflakeCount={700} style={{ position: "fixed", inset: 0, zIndex: 30, pointerEvents: "none" }} />
      <CustomCursor />
      
      <LoadingScreen progress={effectiveProgress} />

      {/* ✅ Add Mute Button to the UI */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      <audio id="bg-audio" src="/sounds/waves.webm" autoPlay loop muted={isMuted} />

      <Navbar />
      <IslandScene />
      <BottomBar />
    </main>
  );
}