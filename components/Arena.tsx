"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useAudio } from "@/contexts/AudioContext"; // ✅ Added
import MuteButton from "@/components/MuteButton"; // ✅ Added

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
  const { isMuted } = useAudio(); // ✅ Access global mute state
  
  const [showKnight, setShowKnight] = useState(true); 
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await apiRequest("quiz/getRound");
        if (data.status === 200) {
          setCurrentRound(data.question.round_number);
          setShowKnight(true); 
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();

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

  // ✅ SYNC MUTE STATE
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (!isMuted && audioRef.current.paused && !showKnight) {
        audioRef.current.play().catch(() => {});
      }
    }
    if (clickSoundRef.current) {
      clickSoundRef.current.muted = isMuted;
    }
  }, [isMuted, showKnight]);

  const playClickSound = () => {
    if (clickSoundRef.current && !isMuted) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const handleNavigate = (path: string, levelRequired: number) => {
    playClickSound();
    if (currentRound >= levelRequired) {
      router.push(path);
    } else {
      toast.error("Access Denied", {
        description: `Round ${levelRequired} is locked!`,
        style: { background: "#2D1B13", color: "#FFD700", border: "1px solid #8B735B" },
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* ✅ Mute Button Overlay: Fixed at z-60 to stay above the 3D Canvas */}
      <div className="fixed top-24 right-6 z-[60]">
        <MuteButton />
      </div>

      <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
        <PanoramaSphere />
        <OrbitControls enableZoom={false} enablePan={false} makeDefault />
      </Canvas>
      {/* Bottom Button */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
              <ProceedButton round={currentRound} />
            </div>
    </div>
  );
}