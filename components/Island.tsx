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
type WaterPreset = {
  waterColor: number;
  distortionScale?: number;
};

const PRESETS: Record<string, WaterPreset> = {
  tropical: { waterColor: 0x1ca3ec, distortionScale: 2.5 },
  deep: { waterColor: 0x003366, distortionScale: 3.7 },
  cinematic: { waterColor: 0x145f93, distortionScale: 4.0 },
  emerald: { waterColor: 0x0a6e55, distortionScale: 3.0 },
  shallow: { waterColor: 0x88ccee, distortionScale: 1.8 },
};

// ---------------- INDICATOR ----------------
function Indicator({
  pos,
  label,
  onClick,
  requiredLevel,
  currentLevel,
}: {
  pos: [number, number, number];
  label: string;
  onClick: () => void;
  requiredLevel: number;
  currentLevel: number;
}) {
  const isLocked = currentLevel < requiredLevel;
  const isCurrent = currentLevel === requiredLevel;

  let baseColor = "rgba(234,179,8,0.6)";
  if (isLocked) baseColor = "rgba(220,38,38,0.6)";
  if (isCurrent) baseColor = "rgba(34,197,94,0.6)";

  return (
    <Html
      position={pos}
      center
      distanceFactor={15}
      zIndexRange={[0, 100]} // ✅ FIXED
    >
      <div
        className="flex flex-col items-center"
        style={{ pointerEvents: "auto" }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick(); // ✅ ALWAYS CALL — toast logic handled outside
          }}
          className={`w-6 h-6 rounded-full border-2 border-white/40 transition-all duration-300 hover:scale-125 ${
            isCurrent ? "animate-pulse" : ""
          }`}
          style={{
            backgroundColor: baseColor,
            cursor: "pointer",
          }}
        />
      </div>
    </Html>
  );
}

// ---------------- WATER ----------------
function WaterPlane({
  preset = "deep",
  size = 20000,
}: {
  preset?: string;
  size?: number;
}) {
  const { scene } = useThree();

  const waterNormals = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/waternormals.webp");
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size, size);
    const w = new (Water as any)(geometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1),
      sunColor: 0xffffff,
      waterColor: PRESETS[preset]?.waterColor ?? 0x1ca3ec,
      distortionScale: PRESETS[preset]?.distortionScale ?? 1.8,
      fog: !!scene.fog,
    });
    w.rotation.x = -Math.PI / 2;
    w.position.y = 3.05;
    return w;
  }, [preset, size, waterNormals, scene.fog]);

  useFrame((_, delta) => {
    if (water?.material?.uniforms?.time) {
      water.material.uniforms.time.value += delta;
    }
  });

  return <primitive object={water} />;
}

// ---------------- ISLAND ----------------
function IslandModel({
  url = "/models/island_1.glb",
  yOffset = 3,
  scale = 1,
}: {
  url?: string;
  yOffset?: number;
  scale?: number;
}) {
  const { scene } = useGLTF(url) as any;

  useEffect(() => {
    if (!scene) return;
    scene.position.set(0, yOffset, 0);
    scene.scale.set(scale, scale, scale);
  }, [scene, yOffset, scale]);

  return <primitive object={scene} />;
}

// ---------------- CAMERA INTRO ----------------
function CameraIntro() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(200, 150, 300);
    gsap.to(camera.position, {
      x: -20,
      y: 10,
      z: 10,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [camera]);

  return null;
}

// ---------------- MAIN SCENE ----------------
export default function IslandScene({
  preset = "deep",
  showControls = true,
}: {
  preset?: string;
  showControls?: boolean;
}) {
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
    window.addEventListener("focus", fetchUser);
    return () => window.removeEventListener("focus", fetchUser);
  }, []);

  const handleNavigate = (path: string, required: number) => {
    if (currentRound >= required) {
      router.push(path);
    } else {
      toast.error("Level Locked", {
        description: `You are on Round ${currentRound}. Complete previous rounds to unlock this.`,
        style: {
          background: "#1a0000",
          color: "#ff4d4d",
          border: "1px solid #ff0000",
        },
      });
    }
  };

  return (
    <div className="w-screen h-screen pointer-events-auto">
      <Canvas
        shadows
        camera={{ position: [50, 40, 70], fov: 45 }}
        style={{ width: "100vw", height: "100vh", pointerEvents: "auto" }}
      >
        <Environment
          files={[
            "/sky/px.webp",
            "/sky/nx.webp",
            "/sky/py.webp",
            "/sky/ny.webp",
            "/sky/pz.webp",
            "/sky/nz.webp",
          ]}
          background
        />

        <ambientLight intensity={4} />
        <directionalLight castShadow position={[150, 300, 150]} intensity={0.5} />

        <WaterPlane preset={preset} />
        <IslandModel />
        <CameraIntro />

        {showControls && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.45}
            minDistance={10}
            maxDistance={100}
          />
        )}

        {!isLoading && (
          <>
            <Indicator pos={[-8.17, 3.62, 0.48]} label="House Dreadhelm" requiredLevel={1} currentLevel={currentRound} onClick={() => handleNavigate("/house", 1)} />
            <Indicator pos={[-8.17, 3.62, -1.5]} label="House Blackwyrm" requiredLevel={2} currentLevel={currentRound} onClick={() => handleNavigate("/house2", 2)} />
            <Indicator pos={[-6.63, 3.91, -1.54]} label="The Ruins" requiredLevel={3} currentLevel={currentRound} onClick={() => handleNavigate("/ruins", 3)} />
            <Indicator pos={[-5, 4, -1.2]} label="Moonveil Glade" requiredLevel={4} currentLevel={currentRound} onClick={() => handleNavigate("/village", 4)} />
            <Indicator pos={[-4.38, 4.92, -1.53]} label="The Arena" requiredLevel={5} currentLevel={currentRound} onClick={() => handleNavigate("/arena", 5)} />
            <Indicator pos={[-8.17, 4, -0.5]} label="Ironshade Peak" requiredLevel={6} currentLevel={currentRound} onClick={() => handleNavigate("/mountain", 6)} />
          </>
        )}
      </Canvas>
    </div>
  );
}
