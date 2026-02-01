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

// ---------------- WATER PRESETS ----------------
const PRESETS: Record<string, { waterColor: number; distortionScale: number }> = {
  deep: { waterColor: 0x003366, distortionScale: 3.7 },
  tropical: { waterColor: 0x1ca3ec, distortionScale: 2.5 },
};

// ---------------- INDICATOR ----------------
function Indicator({
  pos,
  requiredLevel,
  currentLevel,
  onClick,
}: {
  pos: [number, number, number];
  requiredLevel: number;
  currentLevel: number;
  onClick: () => void;
}) {
  const isLocked = currentLevel < requiredLevel;
  const isCurrent = currentLevel === requiredLevel;
  const isCompleted = currentLevel > requiredLevel;

  // Determine appearance based on state
  let bgColor = "rgba(34,197,94,0.8)"; // Green for current
  let opacity = 1;
  
  if (isLocked) {
    bgColor = "rgba(220,38,38,0.6)"; // Red for locked
  } else if (isCompleted) {
    bgColor = "rgba(100,116,139,0.5)"; // Grey for completed
    opacity = 0.6;
  }

  return (
    <Html position={pos} center distanceFactor={15} zIndexRange={[0, 100]}>
      <div className="flex flex-col items-center select-none" style={{ pointerEvents: "auto" }}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`w-6 h-6 rounded-full border-2 border-white/50 transition-all duration-300 
            ${isCurrent ? "animate-pulse scale-125 shadow-[0_0_15px_rgba(34,197,94,0.8)]" : "hover:scale-110"}`}
          style={{
            backgroundColor: bgColor,
            opacity: opacity,
            cursor: "pointer",
          }}
        />
        {isCompleted && (
          <span className="text-[10px] text-white font-bold mt-1 drop-shadow-md">Done</span>
        )}
      </div>
    </Html>
  );
}

// ---------------- WATER ----------------
function WaterPlane({ preset = "deep" }) {
  const { scene } = useThree();
  const waterNormals = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/waternormals.webp");
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(20000, 20000);
    const w = new (Water as any)(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1),
      sunColor: 0xffffff,
      waterColor: PRESETS[preset].waterColor,
      distortionScale: PRESETS[preset].distortionScale,
      fog: !!scene.fog,
    });
    w.rotation.x = -Math.PI / 2;
    w.position.y = 3.05;
    return w;
  }, [preset, waterNormals, scene.fog]);

  useFrame((_, delta) => {
    water.material.uniforms.time.value += delta;
  });

  return <primitive object={water} />;
}

// ---------------- ISLAND ----------------
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

// ---------------- CAMERA INTRO ----------------
function CameraIntro() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(200, 150, 300);
    gsap.to(camera.position, {
      x: -20, y: 10, z: 10,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [camera]);
  return null;
}

// ---------------- MAIN SCENE ----------------
export default function IslandScene({ preset = "deep" }) {
  const router = useRouter();
  const [currentRound, setCurrentRound] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await authService.getUserProfile();
      if (data?.roundNo !== undefined) {
        setCurrentRound(Number(data.roundNo));
      }
    } catch (e) {
      console.error("Profile fetch failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleNavigate = (path: string, required: number) => {
    // 1. Block access to completed levels
    if (currentRound > required) {
      toast.info("Access Restricted", {
        description: "You have already completed this level. Back-tracking is not permitted.",
        style: { background: "#0f172a", color: "#94a3b8", border: "1px solid #334155" },
      });
      return;
    }

    // 2. Allow access to current active level
    if (currentRound === required) {
      router.push(path);
    } 
    
    // 3. Block access to future levels
    else {
      toast.error("Sector Locked", {
        description: `Complete Round ${currentRound} to unlock this sector.`,
        style: { background: "#1a0000", color: "#ff4d4d", border: "1px solid #ff0000" },
      });
    }
  };

  return (
    <div className="w-screen h-screen">
      <Canvas shadows camera={{ position: [50, 40, 70], fov: 45 }}>
        <Environment
          files={["/sky/px.webp", "/sky/nx.webp", "/sky/py.webp", "/sky/ny.webp", "/sky/pz.webp", "/sky/nz.webp"]}
          background
        />
        <ambientLight intensity={1.5} />
        <directionalLight position={[150, 300, 150]} intensity={0.8} />

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
            <Indicator pos={[-8.17, 3.62, 0.48]} requiredLevel={1} currentLevel={currentRound} onClick={() => handleNavigate("/house", 1)} />
            <Indicator pos={[-8.17, 3.62, -1.5]} requiredLevel={2} currentLevel={currentRound} onClick={() => handleNavigate("/house2", 2)} />
            <Indicator pos={[-6.63, 3.91, -1.54]} requiredLevel={3} currentLevel={currentRound} onClick={() => handleNavigate("/ruins", 3)} />
            <Indicator pos={[-5.0, 4.0, -1.2]} requiredLevel={4} currentLevel={currentRound} onClick={() => handleNavigate("/village", 4)} />
            <Indicator pos={[-4.38, 4.92, -1.53]} requiredLevel={5} currentLevel={currentRound} onClick={() => handleNavigate("/arena", 5)} />
          </>
        )}
      </Canvas>
    </div>
  );
}