"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api"; 
import { useAudio } from "@/contexts/AudioContext"; // ✅ Added
import MuteButton from "@/components/MuteButton"; // ✅ Added
import { toast } from "sonner";
import ProceedButton from "@/components/Button";

export default function Panorama() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState<number>(1);
  const { isMuted } = useAudio(); // ✅ Access global mute state
  
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

    // Initialize Audio objects
    bgMusicRef.current = new Audio("/sounds/ruins.mp3");
    bgMusicRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    const startAudio = () => {
      if (!isMuted) {
        bgMusicRef.current?.play().catch(() => {});
      }
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      bgMusicRef.current?.pause();
      bgMusicRef.current = null; // Memory cleanup
      window.removeEventListener("click", startAudio);
    };
  }, []);

  // ✅ SYNC MUTE STATE
  // This ensures your custom Audio objects listen to the global Mute Button
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

  const handleNavigate = (path: string, levelRequired: number) => {
    if (!isMuted) {
      clickSoundRef.current?.play().catch(() => {});
    }

    if (currentRound >= levelRequired) {
      router.push(path);
    } else {
      toast.error("Level Access Denied", {
        description: `Complete current challenges to unlock Level ${levelRequired}.`,
        style: {
          background: "#1a100c",
          color: "#FFD700",
          border: "1px solid #5D4037",
        },
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* ✅ Mute Button Overlay: z-60 keeps it above Canvas (z-0) and Navbar (z-50) */}
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
  const texture = useLoader(THREE.TextureLoader, "/levels/workshop.avif");
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}