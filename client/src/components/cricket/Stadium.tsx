import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Stadium() {
  const grassTexture = useTexture("/textures/grass.png");
  const woodTexture = useTexture("/textures/wood.jpg");

  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  // Configure wood texture
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(5, 2);

  return (
    <group>
      {/* Cricket Field */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[25, 25, 0.2, 32]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>

      {/* Cricket Pitch (rectangular in center) */}
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[1, 0.02, 20]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Stadium Stands */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 35;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
            {/* Stand structure */}
            <mesh position={[0, 3, 0]} castShadow>
              <boxGeometry args={[8, 6, 2]} />
              <meshLambertMaterial map={woodTexture} />
            </mesh>
            
            {/* Stand roof */}
            <mesh position={[0, 6.5, 0]} castShadow>
              <boxGeometry args={[10, 1, 3]} />
              <meshLambertMaterial color="#444444" />
            </mesh>
          </group>
        );
      })}

      {/* Stumps at both ends */}
      <group position={[0, 0.5, 8]}>
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
        ))}
        {/* Bails */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.7, 0.02, 0.02]} />
          <meshLambertMaterial color="#DEB887" />
        </mesh>
      </group>

      <group position={[0, 0.5, -8]}>
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
        ))}
        {/* Bails */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.7, 0.02, 0.02]} />
          <meshLambertMaterial color="#DEB887" />
        </mesh>
      </group>

      {/* Boundary rope */}
      <mesh position={[0, 0.1, 0]}>
        <ringGeometry args={[24, 24.5, 32]} />
        <meshLambertMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
