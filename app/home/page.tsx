"use client";
import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";

import LoadingScreen from "@/components/LoadingPage";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

import BottomBar from "@/components/ShareIcon";
import CustomCursor from "@/components/CustomCursor";
import Snowfall from "react-snowfall";

export default function Home() {
  /* 
     Use standard useProgress hook to track loading. 
     If active is false (no loading happening) we default to 100 so the screen clears.
  */
  /* 
     Use standard useProgress hook to track actual asset loading.
  */
  const { progress: realProgress, active } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [effectiveProgress, setEffectiveProgress] = useState(0);

  // 1. Simulate fast loading to satisfy "animation doesnt take too long"
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Increments to 100 in roughly 2-3 seconds
      });
    }, 50); // 50ms * 50 steps = 2500ms + overhead

    return () => clearInterval(interval);
  }, []);

  // 2. Combine real and simulated progress
  useEffect(() => {
    // If real loading is done (active=false), forcing 100%
    if (!active && realProgress === 0) {
      setEffectiveProgress(100);
    } else {
      // Show whichever is higher: real or simulated
      setEffectiveProgress(Math.max(realProgress, simulatedProgress));
    }
  }, [active, realProgress, simulatedProgress]);

  // 3. Audio Logic - Attempt to play immediately and continuously check
  useEffect(() => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement;
    if (!audio) return;

    const playAudio = () => {
      if (audio.paused || audio.muted) {
        audio.muted = false;
        // set volume to max just in case
        audio.volume = 1.0;
        audio.play().catch((e) => {
          console.warn("Autoplay blocked, waiting for interaction", e);
        });
      }
    };

    // Try to play immediately
    playAudio();

    // Also retry when progress moves (as a backup trigger)
    if (effectiveProgress > 0) {
      playAudio();
    }

    // Fallback: User interaction listener
    const enableSound = () => {
      playAudio();
      window.removeEventListener("click", enableSound);
    };
    window.addEventListener("click", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
    };
  }, [effectiveProgress]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* ❄️ SNOWFALL OVERLAY */}
      <Snowfall
        snowflakeCount={700}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,          // above canvas & UI
          pointerEvents: "none" // clicks pass through
        }}
      />

      <CustomCursor />
      <LoadingScreen progress={effectiveProgress} />
      {/* 🔊 Background Audio */}
      <audio id="bg-audio" src="/sounds/waves.webm" autoPlay loop muted />

      <Navbar />
      <IslandScene />
      <BottomBar />
    </main>
  );
}
