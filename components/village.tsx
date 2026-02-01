"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api"; 
import { useAudio } from "@/contexts/AudioContext"; 
import MuteButton from "@/components/MuteButton"; // ✅ Added Import
import { toast } from "sonner";
import ProceedButton from "@/components/Button"; // ✅ Added Import
export default function Panorama() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState<number>(1);
  const { isMuted } = useAudio(); 
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

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

    bgMusicRef.current = new Audio("/sounds/village.mp3");
    bgMusicRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    // Optional: Auto-start audio on first click if not muted
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

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted;
      if (!isMuted) {
        bgMusicRef.current.play().catch(() => {});
      }
    }
    if (clickSoundRef.current) {
      clickSoundRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleNavigate = (path: string, levelRequired: number) => {
    if (!isMuted) {
      clickSoundRef.current?.play().catch(() => {});
    }

    if (currentRound >= levelRequired) {
      router.push(path);
    } else {
      toast.error("Sector Locked", {
        description: `Round ${levelRequired} unavailable.`,
        style: { background: "#2D1B13", color: "#FFD700", border: "1px solid #8B735B" },
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* ✅ MUTE BUTTON OVERLAY 
          Positioned top-right, z-60 ensures it's above the 3D Canvas
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
  const texture = useLoader(THREE.TextureLoader, "/levels/village.avif");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}