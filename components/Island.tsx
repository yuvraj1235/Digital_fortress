// IslandScene.tsx
"use client";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Loader,
  Environment,
  Cloud,
  Clouds,
  Html,
} from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import Snowfall from "react-snowfall";
// ---------------- WATER PRESETS ----------------
type WaterPreset = {
  waterColor: number;
  distortionScale?: number;
  sunColor?: number;
  textureWidth?: number;
  textureHeight?: number;
};

const PRESETS: Record<string, WaterPreset> = {
  tropical: { waterColor: 0x1ca3ec, distortionScale: 2.5 },
  deep: { waterColor: 0x003366, distortionScale: 3.7 },
  cinematic: { waterColor: 0x145f93, distortionScale: 4.0 },
  emerald: { waterColor: 0x0a6e55, distortionScale: 3.0 },
  shallow: { waterColor: 0x88ccee, distortionScale: 1.8 },
};

// ---------------- WATER PLANE ----------------
function WaterPlane({
  preset = "deep",
  size = 20000,
}: {
  preset?: keyof typeof PRESETS | string;
  size?: number;
}) {
  const { scene } = useThree();
  const waterRef = useRef<any>(null);

  const waterNormals = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/waternormals.webp");
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // Create the water object only once
  const waterObject = useMemo(() => {
    const geom = new THREE.PlaneGeometry(size, size);
    const water = new (Water as any)(geom, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1),
      sunColor: 0xffffff,
      waterColor: 0x1ca3ec, // default
      distortionScale: 1.8,
      fog: !!scene.fog,
    });
    water.rotation.x = -Math.PI / 2;
    water.position.y = 3.05;
    return water;
  }, [waterNormals, size, scene.fog]);

  // Update colors when preset changes
  useEffect(() => {
    if (waterObject) {
      const cfg = PRESETS[preset] ?? PRESETS.cinematic;
      waterObject.material.uniforms.waterColor.value.setHex(cfg.waterColor);
      if (cfg.distortionScale) {
        waterObject.material.uniforms.distortionScale.value = cfg.distortionScale;
      }
    }
  }, [preset, waterObject]);

  useFrame((_, delta) => {
    if (waterObject.material.uniforms.time) {
      waterObject.material.uniforms.time.value += delta;
    }
  });

  return <primitive object={waterObject} ref={waterRef} />;
}

// ---------------- ISLAND MODEL ----------------
function IslandModel({
  url = "/models/island.glb",
  yOffset = 4,
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
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene, yOffset, scale]);

  return (
    <primitive
      object={scene}
    />
  );
}

// ---------------- CAMERA INTRO ANIMATION ----------------
function CameraIntro({ enabled = true }: { enabled?: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!enabled) return;

    camera.position.set(200, 150, 300);

    const tl = gsap.timeline();
    tl.to(camera.position, {
      x: -20,
      y: 10,
      z: 10,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });

    return () => {
      tl.kill();
    };
  }, [camera, enabled]);

  return null;
}

// ---------------- MAIN SCENE ----------------
export default function IslandScene({
  preset = "deep",
  showControls = true,
}: {
  preset?: keyof typeof PRESETS | string;
  showControls?: boolean;

}) {const router = useRouter();
  
  return (
    <>

      <Canvas
        shadows
        camera={{ position: [50, 40, 70], fov: 45 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* 🌫️ CINEMATIC ATMOSPHERIC FOG */}
        <fog attach="fog" args={["#cbe5ff", 0.0008]} />
          
        {/* ☁️ VOLUMETRIC CLOUDS */}
        <Clouds material={THREE.MeshLambertMaterial}>
          <Cloud
            seed={1}
            scale={2}
            color="#ffffff"
            opacity={0.35}
            segments={20}
            position={[0, 120, -80]}
          />
          <Cloud
            seed={15}
            scale={2.5}
            color="#e6f5ff"
            opacity={0.4}
            segments={25}
            position={[80, 150, -150]}
          />
          <Cloud
            seed={9}
            scale={1.8}
            color="#ffffff"
            opacity={0.3}
            segments={18}
            position={[-90, 110, -100]}
          />
        </Clouds>

        {/* 🌄 SKYBOX */}
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

        <color attach="background" args={["#9fd3ff"]} />

        <ambientLight intensity={4} />
        <directionalLight
          castShadow
          position={[150, 300, 150]}
          intensity={0.5}
        />

        {/* 🌊 WATER */}
        <WaterPlane preset={preset} />

        {/* 🏝️ ISLAND */}
        <IslandModel url="/models/island_1.glb" yOffset={3} scale={1} />

        {/* 🎥 CAMERA ANIMATION */}
        <CameraIntro enabled />

        {/* 🎮 CONTROLS */}
        {showControls && (
          <OrbitControls
            enableDamping
            minPolarAngle={Math.PI * 0.2}
            maxPolarAngle={Math.PI * 0.45}
            minAzimuthAngle={-Math.PI}
            maxAzimuthAngle={Math.PI / 4}
            enablePan
            enableZoom
            minDistance={10}
            maxDistance={100}
          />
        )}

        {/* ---------------- INTERACTIVE BUTTONS ---------------- */}

        {/* 1. HOUSE / MAIN BASE */}
        {/* 1. HOUSE / MAIN BASE */}
        <Html
          position={[-8.17, 3.62, 0.48]}
          center
          distanceFactor={15}
          zIndexRange={[100, 0]}
        >
          <div
            data-level="ENTER HOUSE"
            className="
              relative flex items-center justify-center
              w-5 h-5
              bg-white/20 rounded-full
              border border-white/60
              shadow-[0_0_15px_rgba(255,255,255,0.5)]
              cursor-pointer
              transition-all duration-300
              hover:scale-125
              group
            "
            onClick={() => router.push("/house")}
          />
        </Html>

        {/* 2. THE STADIUM (Arena) */}
        <Html
          position={[-4.38, 4.92, -1.53]}
          center
          distanceFactor={20}
          zIndexRange={[100, 0]}
        >
          <div
            data-level="ENTER ARENA"
            className="
              relative flex items-center justify-center
              w-6 h-6
              bg-white/20 rounded-full
              border border-white/60
              shadow-[0_0_15px_rgba(255,255,255,0.5)]
              cursor-pointer
              transition-all duration-300
              hover:scale-125
              group
            "
            onClick={() => router.push("/arena")}
          />
        </Html>

        {/* 3. THE RUINS */}
        <Html
          position={[-6.63, 3.91, -1.54]}
          center
          distanceFactor={20}
          zIndexRange={[100, 0]}
        >
          <div
            data-level="EXPLORE RUINS"
            className="
              relative flex items-center justify-center
              w-5 h-5
              bg-white/20 rounded-full
              border border-white/60
              shadow-[0_0_15px_rgba(255,255,255,0.5)]
              cursor-pointer
              transition-all duration-300
              hover:scale-125
              group
            "
            onClick={() => window.location.href = "/ruins"}
          />
        </Html>
      </Canvas>

    </>
  );
}
