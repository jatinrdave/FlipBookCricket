import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useCricket } from "../../lib/stores/useCricket.tsx";
import { useAudio } from "../../lib/stores/useAudio.tsx";

export function PageFlipBook() {
  const bookRef = useRef<THREE.Group>(null);
  const pageRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentPage, setCurrentPage] = useState(2); // Start with even number
  const [flipSpeed, setFlipSpeed] = useState(0);
  
  const { 
    gamePhase, 
    processPageResult, 
    currentBatsman, 
    isPlayerTurn 
  } = useCricket();
  
  const { playHit, playSuccess } = useAudio();
  
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    if (!bookRef.current || !pageRef.current) return;

    // Handle keyboard input
    const { start, stop } = getKeys();
    
    if (start && !isFlipping && gamePhase === 'playing' && isPlayerTurn) {
      setIsFlipping(true);
      setFlipSpeed(0.1 + Math.random() * 0.2); // Random flip speed
      playHit();
      console.log("Started page flipping");
    }
    
    if (stop && isFlipping && gamePhase === 'playing' && isPlayerTurn) {
      setIsFlipping(false);
      console.log("Stopped page flipping at page:", currentPage);
      
      // Process the result
      if (currentPage % 2 === 0) { // Only even pages count
        const lastDigit = currentPage % 10;
        processPageResult(currentPage, lastDigit);
        
        if (lastDigit > 0 && lastDigit < 8) {
          playSuccess();
        } else if (lastDigit === 0) {
          playHit(); // Different sound for wicket
        }
      } else {
        console.log("Odd page - no score");
      }
    }

    // Update page flipping animation
    if (isFlipping) {
      setCurrentPage(prev => {
        const next = prev + 1;
        return next > 999 ? 2 : next; // Keep cycling, ensure we start with even
      });

      // Animate page rotation
      if (pageRef.current) {
        pageRef.current.rotation.y += flipSpeed;
      }
    }

    // Position book relative to camera for consistent visibility
    if (bookRef.current) {
      const bookPosition = new THREE.Vector3();
      camera.getWorldPosition(bookPosition);
      bookPosition.add(new THREE.Vector3(0, -2, -5));
      bookRef.current.position.copy(bookPosition);
      bookRef.current.lookAt(camera.position);
    }
  });

  if (gamePhase !== 'playing' || !isPlayerTurn) return null;

  return (
    <group ref={bookRef}>
      {/* Book Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.2, 4]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Left Page (Fixed) */}
      <mesh position={[-0.75, 0.11, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.5, 3.8]} />
        <meshLambertMaterial color="#F5F5DC" />
      </mesh>

      {/* Right Page (Animated) */}
      <mesh 
        ref={pageRef} 
        position={[0.75, 0.11, 0]} 
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[1.5, 3.8]} />
        <meshLambertMaterial 
          color="#F5F5DC" 
          transparent 
          opacity={isFlipping ? 0.8 : 1}
        />
      </mesh>

      {/* Page Number Display */}
      <Text
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color={currentPage % 2 === 0 ? "#000000" : "#FF0000"}
        anchorX="center"
        anchorY="middle"
      >
        {currentPage}
      </Text>

      {/* Instructions */}
      <Text
        position={[0, -1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        {isFlipping ? "Press ENTER to stop" : "Press SPACE to start flipping"}
      </Text>

      {/* Current Batsman Info */}
      <Text
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Batsman: {currentBatsman?.name || "Unknown"}
      </Text>
    </group>
  );
}
