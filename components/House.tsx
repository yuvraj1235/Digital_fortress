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
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 1. Fetch User Progress from Backend
    const fetchProgress = async () => {
      try {
        const data = await apiRequest("quiz/getRound"); 
        if (data.status === 200) {
          // data.question.round_number indicates the round the player is currently on
          setCurrentRound(data.question.round_number); 
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();

    // 2. Setup Audio System
    bgMusicRef.current = new Audio("/sounds/house.mp3");
    bgMusicRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    const startAudio = () => {
      bgMusicRef.current?.play().catch(() => {});
      window.removeEventListener("click", startAudio);
    };
    window.addEventListener("click", startAudio);

    return () => {
      bgMusicRef.current?.pause();
      window.removeEventListener("click", startAudio);
    };
  }, []);

  const handleNavigate = (path: string, levelRequired: number) => {
    clickSoundRef.current?.play().catch(() => {});

    // Progression Check
    if (currentRound >= levelRequired) {
      router.push(path);
    } else {
      alert(`Level Locked! Complete Round ${levelRequired - 1} first.`);
    }
  };

  return (
    <Canvas
      camera={{ fov: 75, position: [0, 0, 1] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <PanoramaSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Level 1 Button -> Accesses Round 4 */}
      <ImageButton 
        position={[3, 0, 0]} 
        image="/level_buttons/1.png" 
        onClick={() => handleNavigate("/quiz", 4)}
        size={3}
        opacity={currentRound >= 4 ? 1 : 0.3}
      />

      {/* Level 2 Button -> Accesses Round 5 */}
      <ImageButton 
        position={[-10, 0, 0]} 
        image="/level_buttons/2.png"
        onClick={() => handleNavigate("/quiz", 5)}
        size={5}
        opacity={currentRound >= 5 ? 1 : 0.3}
      />

      {/* Level 3 Button -> Accesses Round 6 */}
      <ImageButton 
        position={[-2, -1, 4]} 
        image="/level_buttons/3.png" 
        onClick={() => handleNavigate("/quiz", 6)}
        size={3}
        opacity={currentRound >= 6 ? 1 : 0.3}
      />
    </Canvas>
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