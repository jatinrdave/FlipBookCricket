import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { CricketGame } from "./components/cricket/CricketGame";
import { GameUI } from "./components/cricket/GameUI";
import { TeamSelection } from "./components/cricket/TeamSelection";
import { MatchSettings } from "./components/cricket/MatchSettings";
import { TossScreen } from "./components/cricket/TossScreen";
import { useCricket } from "./lib/stores/useCricket.tsx";

// Define control keys for the game
const controls = [
  { name: "start", keys: ["Space"] },
  { name: "stop", keys: ["Enter"] },
  { name: "restart", keys: ["KeyR"] },
];

// Main App component
function App() {
  const { gamePhase } = useCricket();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {showCanvas && (
        <>
          <KeyboardControls map={controls}>
            <Canvas
              shadows
              camera={{
                position: [0, 8, 15],
                fov: 45,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "default"
              }}
            >
              <color attach="background" args={["#87CEEB"]} />
              
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <directionalLight
                position={[10, 20, 10]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-10, 10, -10]} intensity={0.5} />

              <Suspense fallback={null}>
                <CricketGame />
              </Suspense>
            </Canvas>
          </KeyboardControls>
          
          {/* UI Overlays outside Canvas */}
          <GameUI />
          
          {/* Different screens based on game phase */}
          {gamePhase === 'team_selection' && <TeamSelection />}
          {gamePhase === 'match_settings' && <MatchSettings />}
          {gamePhase === 'toss' && <TossScreen />}
        </>
      )}
    </div>
  );
}

export default App;
