"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { authService } from "@/lib/services/authService"; // ✅ Use the central service
import { useAudio } from "@/contexts/AudioContext"; 
import MuteButton from "@/components/MuteButton"; 
import { toast } from "sonner";
import ProceedButton from "@/components/Button";

export default function Panorama() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [isFetching, setIsFetching] = useState(true); 
  const { isMuted } = useAudio(); 
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const syncProgress = async () => {
      try {
        setIsFetching(true);
        
        /**
         * 🛠️ THE FINAL FIX:
         * We call getUserProfile() because it specifically maps 'roundNo' 
         * and sets the 'df_round' cookie for the middleware.
         */
        const userData = await authService.getUserProfile();
        
        if (userData && userData.roundNo !== undefined) {
          const numericRound = Number(userData.roundNo);
          setCurrentRound(numericRound);
          console.log("📍 Panorama Progress Synced:", numericRound);
        }
      } catch (err) {
        console.error("❌ Sync failed", err);
      } finally {
        setIsFetching(false);
      }
    };

    syncProgress();

    // Audio setup
    bgMusicRef.current = new Audio("/sounds/house2.mp3");
    bgMusicRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    const startAudio = () => {
      if (!isMuted) bgMusicRef.current?.play().catch(() => {});
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      bgMusicRef.current?.pause();
      bgMusicRef.current = null;
      window.removeEventListener("click", startAudio);
    };
  }, []);

  // Audio Sync Effect
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted;
      if (!isMuted && !isFetching) {
        bgMusicRef.current.play().catch(() => {});
      }
    }
    if (clickSoundRef.current) {
      clickSoundRef.current.muted = isMuted;
    }
  }, [isMuted, isFetching]);

  return (
    <div className="relative w-full h-screen bg-black">
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      <Canvas
        camera={{ fov: 75, position: [0, 0, 1] }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <PanoramaSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        {!isFetching ? (
          <ProceedButton round={currentRound} />
        ) : (
          <div className="px-8 py-3 bg-[#2D1B13] text-[#C6AD8B] rounded-lg animate-pulse border border-[#8B735B] font-serif">
            Syncing Progress...
          </div>
        )}
      </div>
    </div>
  );
}

function PanoramaSphere() {
  const texture = useLoader(THREE.TextureLoader, "/levels/house.avif");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}