// IslandScene.tsx
"use client";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Loader, Environment } from "@react-three/drei";
import { Water } from "three/examples/jsm/objects/Water.js";
import gsap from "gsap";

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

function WaterPlane({
  preset = "emerald",
  size = 20000,
}: {
  preset?: keyof typeof PRESETS | string;
  size?: number;
}) {
  const { scene } = useThree();
  const waterRef = useRef<THREE.Object3D | null>(null);

  // Load normals (memoized)
  const waterNormals = useMemo(() => {
    const tex = new THREE.TextureLoader().load("/textures/waternormals.jpg");
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // Create water object only once (memoized)
  const waterObject = useMemo(() => {
    const geom = new THREE.PlaneGeometry(size, size);
    const cfg = PRESETS[preset] ?? PRESETS.cinematic;

    const water = new (Water as any)(geom, {
      textureWidth: cfg.textureWidth ?? 1024,
      textureHeight: cfg.textureHeight ?? 1024,
      waterNormals,
      sunDirection: new THREE.Vector3(1, 1, 1),
      sunColor: cfg.sunColor ?? 0xffffff,
      waterColor: cfg.waterColor,
      distortionScale: cfg.distortionScale ?? 1.8, // lowered for less plastic look
      fog: !!scene.fog,
    });

    water.rotation.x = -Math.PI / 2;
    water.receiveShadow = true;

    // push it slightly down so edges don't reveal background
    water.position.y = 3.04;

    return water as THREE.Object3D;
    // include scene so memo recreates if fog changes
  }, [waterNormals, preset, size, scene]);

  // cleanup on unmount
  useEffect(() => {
    const obj = waterObject as any;
    if (!obj) return;
    return () => {
      try {
        obj.geometry?.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => m.dispose?.());
          } else {
            obj.material.dispose?.();
          }
        }
        waterNormals?.dispose?.();
      } catch (e) {
        /* ignore disposal errors */
      }
    };
  }, [waterObject, waterNormals]);

  // update time uniform each frame
  useFrame((_, delta) => {
    const mat = (waterObject as any).material;
    if (mat?.uniforms?.time) mat.uniforms.time.value += delta;
  });

  return <primitive object={waterObject} ref={waterRef} />;
}

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

  return <primitive object={scene} />;
}

function CameraIntro({ enabled = true }: { enabled?: boolean }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!enabled) return;
    const from = { x: 200, y: 150, z: 300 };
    camera.position.set(from.x, from.y, from.z);

    const tl = gsap.timeline();
    tl.to(camera.position, {
      x: -40,
      y: 20,
      z: 20,
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

export default function IslandScene({
  preset = "shallow",
  showControls = true,
}: {
  preset?: keyof typeof PRESETS | string;
  showControls?: boolean;
}) {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [50, 40, 70], fov: 45 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* use your panorama webp as an environment (equirectangular) */}
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
        {/* sky-ish background fallback (used before env loads) */}
        <color attach="background" args={["#9fd3ff"]} />

        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[150, 300, 150]}
          intensity={1.5}
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={2000}
          shadow-camera-left={-800}
          shadow-camera-right={800}
          shadow-camera-top={800}
          shadow-camera-bottom={-800}
        />

        {/* Water plane (big) */}
        <WaterPlane preset={preset} />

        {/* Island model */}
        <IslandModel url="/models/island_1.glb" yOffset={3} scale={1} />

        {/* camera intro animation */}
        <CameraIntro enabled />

        {showControls && <OrbitControls
  enableDamping
  minPolarAngle={Math.PI * 0.2}   // look down limit
  maxPolarAngle={Math.PI * 0.45}  // look up limit
  minAzimuthAngle={-Math.PI}  // left turn limit
  maxAzimuthAngle={Math.PI / 4}   // right turn limit
   enablePan enableZoom
    minDistance={10}   // how close camera can go
  maxDistance={100}  // how far camera can go
   />}
      </Canvas>

      <Loader />
    </>
  );
}
