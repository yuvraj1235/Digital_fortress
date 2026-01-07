import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export default function ImageButton({ position, image, onClick, size = 3 }: { position: [number, number, number]; image: string; onClick: () => void; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, image);
  const { camera } = useThree();

  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(camera.position);
    }
  });
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
  ref={ref}
  position={position}
  scale={hovered ? 1.2 : 1}
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
  onClick={onClick}
>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
