"use client";
import IslandScene from "@/components/Island";
import Navbar from "@/components/Navbar";

import LoadingScreen from "@/components/LoadingPage";
import { useEffect, useState } from "react";
import { Loader } from "@react-three/drei";

import BottomBar from "@/components/ShareIcon";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = document.getElementById("bg-audio") as HTMLAudioElement;

    if (!audio) return;

    // Force audio to play when the user interacts once
    const enableSound = () => {
      audio.muted = false;
      audio.play().catch(() => {});
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
      <LoadingScreen progress={progress} />

      {/* Audio MUST start muted or browser will block it */}
      <audio id="bg-audio" src="/sounds/waves.webm" autoPlay loop muted />

      <Navbar />
      <IslandScene />
      
      <Loader
        dataInterpolation={(p) => {
          const val = Math.floor(p);
          setProgress(val);
          return val.toString();
        }}
      />

      <BottomBar />
    </main>
  );
}
