"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { authService } from "@/lib/services/authService"; // Using central service
import { toast } from "sonner";
import { useAudio } from "@/contexts/AudioContext"; 
import MuteButton from "@/components/MuteButton"; 
import ProceedButton from "@/components/Button";

function PanoramaSphere() {
  const texture = useLoader(THREE.TextureLoader, "/levels/arena.avif");
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

export default function Panorama() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isFetching, setIsFetching] = useState(true); // Track loading state
  const { isMuted } = useAudio(); 
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const syncProgress = async () => {
      try {
        setIsFetching(true);
        /**
         * THE FIX:
         * Using getUserProfile ensures we get the flat 'roundNo' key
         * and automatically updates the 'df_round' cookie for middleware.
         */
        const userData = await authService.getUserProfile();
        
        if (userData && userData.roundNo !== undefined) {
          const numericRound = Number(userData.roundNo);
          setCurrentRound(numericRound);
          console.log("Arena Progress Synced:", numericRound);
        }
      } catch (err) {
        console.error("Failed to sync progress", err);
      } finally {
        setIsFetching(false);
      }
    };

    syncProgress();

    // Initialize Audio
    audioRef.current = new Audio("/sounds/arena.mp3");
    audioRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    const startAudio = () => {
      if (!isMuted) {
        audioRef.current?.play().catch(() => {});
      }
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      window.removeEventListener("click", startAudio);
    };
  }, []);

  // Sync Mute State
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && audioRef.current.paused && !isFetching) {
        audioRef.current.play().catch(() => {});
      }
    }
    if (clickSoundRef.current) {
      clickSoundRef.current.muted = isMuted;
    }
  }, [isMuted, isFetching]);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Mute Button Overlay */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
        <PanoramaSphere />
        <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      </Canvas>

      {/* Action Button: Validates against currentRound */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        {!isFetching ? (
          <ProceedButton round={currentRound} />
        ) : (
          <div className="px-8 py-3 bg-[#2D1B13] text-[#C6AD8B] rounded-lg animate-pulse border border-[#8B735B] font-serif">
            Preparing for Battle...
          </div>
        )}
      </div>
    </div>
  );
}