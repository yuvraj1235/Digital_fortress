"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/api"; //
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
        const data = await apiRequest("quiz/getRound"); //
        if (data.status === 200) {
          setCurrentRound(data.question.round_number); //
        }
      } catch (err) {
        console.error("Failed to fetch progress", err);
      }
    };
    fetchProgress();

    // 2. Initialize Audio
    bgMusicRef.current = new Audio("/sounds/ruins.mp3");
    bgMusicRef.current.loop = true;
    clickSoundRef.current = new Audio("/sounds/click.wav");

    // Start background music on first interaction (browser policy)
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
    // Play click sound
    clickSoundRef.current?.play().catch(() => {});

    // 3. Progression Check Logic
    if (currentRound >= levelRequired) {
      router.push(path);
    } else {
      alert(`Level Locked! You must clear up to Level ${levelRequired - 1} first.`);
    }
  };

  return (
    <Canvas
      camera={{ fov: 75, position: [0, 0, 1] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <PanoramaSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Level 7 - Requires Round 7 */}
      <ImageButton 
        position={[2, -2, -2]} 
        image="/level_buttons/1.png" 
        onClick={() => handleNavigate("/quiz", 7)}
        size={3}
        opacity={currentRound >= 7 ? 1 : 0.3} // Visual lock feedback
      />

      {/* Level 9 - Requires Round 9 */}
      <ImageButton 
        position={[-4, 0, -2]} 
        image="/level_buttons/2.png"
        onClick={() => handleNavigate("/quiz", 9)}
        size={3}
        opacity={currentRound >= 9 ? 1 : 0.3}
      />

      {/* Level 10 - Requires Round 10 */}
      <ImageButton 
        position={[0, -1, 3]} 
        image="/level_buttons/3.png" 
        onClick={() => handleNavigate("/quiz", 10)}
        size={3}
        opacity={currentRound >= 10 ? 1 : 0.3}
      />
    </Canvas>
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