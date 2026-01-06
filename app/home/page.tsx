"use client";
import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";

import LoadingScreen from "@/components/LoadingPage";
import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

import BottomBar from "@/components/ShareIcon";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  /* 
     Use standard useProgress hook to track loading. 
     If active is false (no loading happening) we default to 100 so the screen clears.
  */
  const { progress, active } = useProgress();
  const [effectiveProgress, setEffectiveProgress] = useState(0);

  useEffect(() => {
    // If active, use real progress. If not active (creation done), allow it to finish.
    // Sometimes progress stays 0 if everything is cached. 
    if (!active && progress === 0) {
      setEffectiveProgress(100);
    } else {
      setEffectiveProgress(progress);
    }
  }, [active, progress]);

  useEffect(() => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement;

    if (!audio) return;

    // Force audio to play when the user interacts once
    const enableSound = () => {
      audio.muted = false;
      audio.play().catch(() => { });
      window.removeEventListener("click", enableSound);
    };

    window.addEventListener("click", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <CustomCursor></CustomCursor>
      <LoadingScreen progress={effectiveProgress} />

      {/* Audio MUST start muted or browser will block it */}
      <audio id="bg-audio" src="/sounds/waves.webm" autoPlay loop muted />

      <Navbar />
      <IslandScene />

      {/* 
         Removed <Loader /> component as we are using useProgress hook 
         driven LoadingScreen above 
      */}

      <BottomBar />
    </main>
  );
}
