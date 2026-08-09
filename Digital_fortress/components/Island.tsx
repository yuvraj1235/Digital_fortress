"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/authService";
import { toast } from "sonner";

// ---------------- 1. REFINED COLOR PALETTE (Frozen Tech) ----------------
const THEME = {
  completed: "#64748b", // Muted Frost Blue/Slate
  current: "#10b981",   // Neon Emerald
  locked: "#991b1b",    // Deep Crimson
  path: "#34d399",      // Vibrant Mint
};

// Includes 'isHelper' points to act as anchors so the path hugs the mountain
const LEVEL_DATA = [
  { pos: [-8.17, 3.92, 0.48], path: "/house", label: "LEVEL", num: "1" },
  { pos: [-8.5, 3.5, -0.5], isHelper: true }, 
  { pos: [-8.17, 3.9, -1], path: "/house2", label: "LEVEL", num: "2" },
  { pos: [-6.9, 3.7, -1.6], isHelper: true },  
  { pos: [-6.83, 4.1, -1.54], path: "/ruins", label: "LEVEL", num: "3" },
  { pos: [-5.8, 4, -1], isHelper: true },  
  { pos: [-5.5, 4.7, -1], path: "/village", label: "LEVEL", num: "4" },
  { pos: [-5, 5, -1.4], isHelper: true },  
  { pos: [-4.5, 5.7, -1.4], path: "/arena", label: "LEVEL", num: "5" },
];

// ---------------- 2. PATH COMPONENT (Digital Circuit) ----------------
function LevelPath() {
  const points = useMemo(() => 
    LEVEL_DATA.map(d => new THREE.Vector3(d.pos[0], d.pos[1], d.pos[2])), 
  []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points]);

  return (
    <mesh position={[0, 0.08, 0]}>
      {/* args: [curve, segments, radius, radialSegments, closed] */}
      <tubeGeometry args={[curve, 100, 0.025, 8, false]} />
      <meshStandardMaterial 
        color={THEME.path} 
        emissive={THEME.path}
        emissiveIntensity={2}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// ---------------- 3. GOOGLE MAP PIN INDICATOR ----------------
function Indicator({
  pos,
  requiredLevel,
  currentLevel,
  label,
  num,
  onClick,
}: {
  pos: [number, number, number];
  requiredLevel: number;
  currentLevel: number;
  label: string;
  num: string;
  onClick: () => void;
}) {
  const isLocked = currentLevel < requiredLevel;
  const isCurrent = currentLevel === requiredLevel;
  const isCompleted = currentLevel > requiredLevel;

  const pinBg = isCurrent ? THEME.current : isLocked ? THEME.locked : THEME.completed;

  return (
    <Html position={pos} center distanceFactor={15} zIndexRange={[0, 100]}>
      <div className="flex flex-col items-center select-none pointer-events-none group">
        
        {/* HUD-style Label: Controlled font size and gap */}
        <div className="mb-2 transition-opacity duration-500" style={{ opacity: isCurrent ? 0.8 : 0.3 }}>
           <span className="text-[7px] text-white font-bold tracking-[0.2em] uppercase">
             {label}
           </span>
        </div>

        {/* The Map Pin */}
        <div 
          className="relative flex flex-col items-center pointer-events-auto cursor-pointer"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          {/* Teardrop Pin Shape */}
          <div 
            className={`w-7 h-7 rounded-full rounded-bl-none rotate-[-45deg] flex items-center justify-center border-[1.5px] border-white/20 transition-all duration-500 shadow-2xl
              ${isCurrent ? 'scale-110 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-bounce' : 'scale-90'}`}
            style={{ backgroundColor: pinBg }}
          >
            {/* Level Number */}
            <span className="rotate-[45deg] text-white text-[10px] font-black">
              {num}
            </span>
          </div>

          {/* Locked Status Overlay */}
          {isLocked && (
            <div className="absolute -bottom-1 text-white/80 scale-75">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
               </svg>
            </div>
          )}
        </div>
      </div>
    </Html>
  );
}

// ---------------- 4. WATER & ENVIRONMENT ----------------
const PRESETS: Record<string, { waterColor: number; distortionScale: number }> = {
  deep: { waterColor: 0x003366, distortionScale: 3.7 },
  tropical: { waterColor: 0x1ca3ec, distortionScale: 2.5 },
};

function WaterPlane({ preset = "deep" }: { preset?: string }) {
  const { scene } = useThree();
  const waterNormals = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/waternormals.webp");
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(20000, 20000);
    const w = new (Water as any)(geometry, {
      textureWidth: 1024, textureHeight: 1024, waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1), sunColor: 0xffffff,
      waterColor: PRESETS[preset as string].waterColor,
      distortionScale: PRESETS[preset as string].distortionScale,
      fog: !!scene.fog,
    });
    w.rotation.x = -Math.PI / 2;
    w.position.y = 3.05;
    return w;
  }, [preset, waterNormals, scene.fog]);

  useFrame((_, delta) => { water.material.uniforms.time.value += delta; });
  return <primitive object={water} />;
}

function IslandModel() {
  const { scene } = useGLTF("/models/island_1.glb") as any;
  useEffect(() => {
    if (scene) {
      scene.position.set(0, 3, 0);
      scene.scale.set(1, 1, 1);
    }
  }, [scene]);
  return <primitive object={scene} />;
}

function CameraIntro() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(200, 150, 300);
    gsap.to(camera.position, {
      x: -20, y: 10, z: 10, duration: 2.2, ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [camera]);
  return null;
}

// ---------------- 5. MAIN SCENE ----------------
export default function IslandScene({ preset = "deep" }) {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getUserProfile();
        if (data?.roundNo !== undefined) setCurrentRound(Number(data.roundNo));
      } catch (e) {
        console.error("Profile fetch failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleNavigate = (path: string, required: number) => {
    if (currentRound > required) {
      toast.info("Completed", { description: "Sector secured." });
      return;
    }
    if (currentRound === required) router.push(path);
    else toast.error("Locked", { description: `Secure Round ${currentRound} first.` });
  };

  return (
    <div className="w-screen h-screen bg-[#050505]">
      <Canvas shadows camera={{ position: [50, 40, 70], fov: 45 }}>
        <Environment
          files={["/sky/px.webp", "/sky/nx.webp", "/sky/py.webp", "/sky/ny.webp", "/sky/pz.webp", "/sky/nz.webp"]}
          background
        />
        <ambientLight intensity={1.2} />
        <directionalLight position={[150, 300, 150]} intensity={0.6} />

        <WaterPlane preset={preset} />
        <IslandModel />
        <CameraIntro />

        <OrbitControls
          enableDamping
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.45}
          minDistance={10}
          maxDistance={80}
        />

        {!isLoading && (
          <>
            <LevelPath />
            {LEVEL_DATA.filter(d => !d.isHelper).map((level, index) => (
              <Indicator 
                key={index}
                pos={level.pos as [number, number, number]}
                requiredLevel={index + 1}
                currentLevel={currentRound}
                label={level.label || ""}
                num={level.num || ""}
                onClick={() => handleNavigate(level.path || "", index + 1)}
              />
            ))}
          </>
        )}
      </Canvas>
    </div>
  );
}