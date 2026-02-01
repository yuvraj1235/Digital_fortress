"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Panorama from "@/components/House";
import BottomBar from "@/components/ShareIcon";
import LoadingScreen from "@/components/LoadingPage";
import MuteButton from "@/components/MuteButton"; // ✅ Import Button
import { useAudio } from "@/contexts/AudioContext"; // ✅ Import Context

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { isMuted } = useAudio(); // ✅ Get global mute state
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

  // ✅ Handle Audio Playback and Mute Sync
  useEffect(() => {
    if (!audioRef.current) return;

    // Keep the element in sync with the global context
    audioRef.current.muted = isMuted;

    const playAudio = () => {
      audioRef.current?.play().catch(() => {
        console.log("Autoplay blocked, waiting for user interaction.");
      });
    };

    if (!loading) {
      playAudio();
    }

    // Unblock audio on first click if autoplay was blocked
    window.addEventListener("click", playAudio);
    return () => window.removeEventListener("click", playAudio);
  }, [loading, isMuted]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {loading && <LoadingScreen progress={progress} />}

      {/* ✅ Persistent Mute Button (Fixed Position) */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      {/* ✅ Hidden Audio Element */}
      <audio 
        ref={audioRef} 
        src="/sounds/waves.webm" // Replace with your house/panorama sound
        loop 
      />

      <Navbar />
      <Panorama />
      <BottomBar />
    </main>
  );
}