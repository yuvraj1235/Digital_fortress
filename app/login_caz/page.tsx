"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Float, ContactShadows, OrbitControls ,Html} from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import DragonModel from "@/components/DragonModel";


// --- 2. The Main Page Component ---
export default function DragonLoginPage() {
  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">

     
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/sky_cloud.jpg')" }}
      />

      {/* LAYER 1: 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>

          {/* Controls to move/zoom the dragon for debugging */}
          <OrbitControls enableZoom={true} />

          {/* Lighting: Bright and Warm */}
          <ambientLight intensity={2} color="#a6b1c9" />

{/* 2. The "Sun" (Strong light from Top-Left) */}
<directionalLight 
  position={[20, -20,7]} // Moving light to the left side
  intensity={15} 
  color="#ffffff" 
/>

{/* 3. Reflections (Critical for shiny scales) */}
<Environment preset="city" />

          {/* The Dragon */}
          <Suspense fallback={null}>
            <DragonModel url="/models/dragon.glb" />
          </Suspense>

          <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={10} blur={2} far={4} />
        </Canvas>
      </div>

    
    </div>
  );
}