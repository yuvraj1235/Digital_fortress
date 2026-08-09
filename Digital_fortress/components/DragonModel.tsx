"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, Environment, Float, ContactShadows, OrbitControls ,Html} from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
// --- 1. The Dragon Model Component ---
function DragonModel({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  return (
    <group ref={group} dispose={null}>
      <Float speed={0.2} rotationIntensity={0.5} floatIntensity={1}>
        <primitive 
          object={scene} 
          scale={10} 
          position={[-2, 0, 0]} 
          rotation={[0, 0, 0]} 
        />

        {/* --- NEW: The Form lives HERE now --- */}
        {/* 'transform' makes it 3D. 'occlude="blending"' lets the dragon/ropes hide it. */}
        <Html
          transform
          occlude="blending" 
          position={[.5,-0.9,-.3]} 
          rotation={[0,-5.2,0]}// <--- ADJUST THIS to place it perfectly in the ropes
          scale={0.2}            // <--- Scale the form down to fit nicely
          style={{
            width: '400px',      // Fix width here for 3D rendering
            userSelect: 'none',  // Prevents highlighting text while rotating
          }}
        >
          {/* PASTE YOUR GLASS FORM CODE HERE */}
          <div 
            className="bg-black/30 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl text-white"
            onPointerDown={(e) => e.stopPropagation()} // Vital: Lets you click inputs without rotating the dragon
          >
            <h2 className="text-2xl font-serif mb-2 tracking-widest">CREATE YOUR ACCOUNT</h2>
            <p className="text-xs text-gray-300 mb-6">Join the ancient kingdom</p>
            
            <form className="flex flex-col gap-4">
              <input type="email" placeholder="Email" className="w-full bg-transparent border border-gray-400 rounded p-3" />
              <input type="password" placeholder="Password" className="w-full bg-transparent border border-gray-400 rounded p-3" />
              <button className="bg-[#6b705c] hover:bg-[#5a604b] text-white font-bold py-3 mt-4 rounded">
                REGISTER
              </button>
            </form>
          </div>
        </Html>

      </Float>
    </group>
  );
}

export default DragonModel