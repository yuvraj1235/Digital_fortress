"use client";

import { Canvas, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import ImageButton from "./ImageButton";
import { useRouter } from "next/navigation";

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
      
      {/* Image Buttons */}
      <ImageButton 
        position={[3, 0, -2]} 
        image="/level_buttons/1.png" 
        onClick={() => handleNavigate("/home")}
        size={2}
      />
      <ImageButton 
        position={[-3, 0, -2]} 
        image="/level_buttons/2.png"
        onClick={() => handleNavigate("/quiz")}
        size={2}
      />
      <ImageButton 
        position={[0, 2, -2]} 
        image="level_buttons/3.png" 
        onClick={() => handleNavigate("/")}
        size={2}
      />
    </Canvas>
  );
}

function PanoramaSphere() {
  const texture = useLoader(THREE.TextureLoader, "/levels/workshop.avif");

  // Fix upside-down textures
  texture.mapping = THREE.EquirectangularReflectionMapping;

  return (
    <mesh scale={[-1, 1, 1]}>
      {/* Inside-out sphere */}
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
