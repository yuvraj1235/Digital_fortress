"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";
import ProceedButton from "@/components/Button";
import MuteButton from "@/components/MuteButton"; // Ensure this is imported
import { useAudio } from "@/contexts/AudioContext"; 
import { toast } from "sonner";

export default function Panorama() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState<number>(1);
  const { isMuted } = useAudio(); 
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  // 1. Initial Data & Audio Setup
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await apiRequest("quiz/getRound");
        if (data.status === 200) {
          setCurrentRound(data.question.round_number);
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();

    bgMusicRef.current = new Audio("/sounds/house.mp3");
    bgMusicRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    const startAudio = () => {
      if (!isMuted) {
        bgMusicRef.current?.play().catch(() => { });
      }
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      bgMusicRef.current?.pause();
      bgMusicRef.current = null;
      window.removeEventListener("click", startAudio);
    };
  }, []);

  // 2. Mute State Sync
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted;
      if (!isMuted && bgMusicRef.current.paused) {
        bgMusicRef.current.play().catch(() => {});
      }
    }
    if (clickSoundRef.current) {
      clickSoundRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div className="relative w-full h-screen bg-black">
        {/* MUTE BUTTON CONTAINER 
          We place it here so it sits ABOVE the Canvas.
          z-60 is higher than Navbar (50) and Canvas (0) 
        */}
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
      
      {/* Bottom Button */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        <ProceedButton round={currentRound} />
      </div>
    </div>
  );
}

function PanoramaSphere() {
  const texture = useLoader(THREE.TextureLoader, "/levels/house_1.avif");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}