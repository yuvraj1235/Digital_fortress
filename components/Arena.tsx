"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api";
import ImageButton from "./ImageButton";

export default function Panorama() {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Fetch User Progress from Backend
    const fetchProgress = async () => {
      try {
        const data = await apiRequest("quiz/getRound");
        if (data.status === 200) {
          // Assuming round_number is returned in the question object
          setCurrentRound(data.question.round_number);
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };

    fetchProgress();

    // 2. Setup Background Music
    audioRef.current = new Audio("/sounds/arena.mp4");
    audioRef.current.loop = true;
    
    // 2b. Setup Click Sound
    clickSoundRef.current = new Audio("/sounds/click.wav");
    
    // Note: Most browsers require user interaction before playing audio
    const playMusic = () => {
      audioRef.current?.play().catch(() => {});
      window.removeEventListener("click", playMusic);
    };
    window.addEventListener("click", playMusic);

    return () => {
      audioRef.current?.pause();
      window.removeEventListener("click", playMusic);
    };
  }, []);

  const playClickSound = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const handleNavigate = (path: string, levelRequired: number) => {
    playClickSound();
    // 3. Lock Logic: Only navigate if user has reached this round
    if (currentRound >= levelRequired) {
      router.push(path);
    } else {
      alert(`Round ${levelRequired} is locked! Clear previous rounds first.`);
    }
  };

  return (
    <Canvas
      camera={{ fov: 75, position: [0, 0, 1] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <PanoramaSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Level 1 - Always Unlocked */}
      <ImageButton 
        position={[10, 0, 2]} 
        image="/level_buttons/1.png" 
        onClick={() => handleNavigate("/quiz", 1)}
        size={6}
        opacity={currentRound >= 1 ? 1 : 0.3} // Visual cue for locked status
      />

      {/* Level 2 - Unlocked if round >= 2 */}
      <ImageButton 
        position={[-5, -0.5, 5]} 
        image="/level_buttons/2.png"
        onClick={() => handleNavigate("/quiz", 2)}
        size={4}
        opacity={currentRound >= 2 ? 1 : 0.3}
      />

      {/* Level 3 - Unlocked if round >= 3 */}
      <ImageButton 
        position={[4.5, 0, -6]} 
        image="/level_buttons/3.png" 
        onClick={() => handleNavigate("/quiz", 3)}
        size={3}
        opacity={currentRound >= 3 ? 1 : 0.3}
      />
    </Canvas>
  );
}

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