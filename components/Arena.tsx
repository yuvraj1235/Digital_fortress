"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";
import ImageButton from "./ImageButton";

export default function Panorama() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Canvas
      camera={{ fov: 75, position: [0, 0, 1] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <PanoramaSphere />
      <OrbitControls enableZoom={false} enablePan={false} />
      
      {/* Navigation Buttons */}
      <ImageButton 
        position={[10, 0, 2]} 
        image="/level_buttons/1.png" 
        onClick={() => handleNavigate("/home")}
        size={6}
      />
      <ImageButton 
        position={[-5, -0.5, 5]} 
        image="/level_buttons/2.png"
        onClick={() => handleNavigate("/quiz")}
        size={4}
      />
      <ImageButton 
        position={[4.5, 0, -6]} 
        image="/level_buttons/3.png" 
        onClick={() => handleNavigate("/")}
        size={3}
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