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
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { progress: realProgress, active } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [effectiveProgress, setEffectiveProgress] = useState(0);
  const { isMuted } = useAudio();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => (prev >= 100 ? 100 : prev + 1));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!active && realProgress >= 100) {
      setEffectiveProgress(100);
    } else {
      setEffectiveProgress(Math.max(realProgress, simulatedProgress));
    }
  }, [active, realProgress, simulatedProgress]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.muted = isMuted;

    const playAudio = () => {
      audioRef.current?.play().catch(() => { });
    };

    if (effectiveProgress === 100) {
      playAudio();
    }

    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, [effectiveProgress, isMuted]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      <Snowfall snowflakeCount={200} style={{ position: "fixed", inset: 0, zIndex: 30, pointerEvents: "none" }} />


      {effectiveProgress < 100 && <LoadingScreen progress={effectiveProgress} />}




      <audio ref={audioRef} src="/sounds/waves.webm" autoPlay loop />

      <Navbar />
      <IslandScene />
      <BottomBar />
    </main>
  );
}