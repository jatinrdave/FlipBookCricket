import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Game state types
type GamePhase = 'setup' | 'playing' | 'match_end';
type GameMode = 'two_player' | 'vs_computer';

interface Player {
  name: string;
  runs: number;
  ballsFaced: number;
  isOut: boolean;
}

interface Team {
  name: string;
  players: Player[];
  totalRuns: number;
  wickets: number;
  balls: number;
}

// Cricket Stadium Component
function Stadium() {
  return (
    <group>
      {/* Ground */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[20, 20, 0.2, 32]} />
        <meshLambertMaterial color="#228B22" />
      </mesh>
      
      {/* Pitch */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[1, 0.02, 18]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Stumps */}
      <group position={[0, 0.5, 7]}>
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
        ))}
      </group>
      
      <group position={[0, 0.5, -7]}>
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1]} />
            <meshLambertMaterial color="#DEB887" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Page Flip Book Component
function PageFlipBook({ onPageFlip, isFlipping, currentPage }: {
  onPageFlip: (page: number) => void;
  isFlipping: boolean;
  currentPage: number;
}) {
  return (
    <group position={[0, 2, 0]}>
      {/* Book */}
      <mesh>
        <boxGeometry args={[2, 0.1, 3]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Page */}
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[1.8, 2.8]} />
        <meshLambertMaterial color="#F5F5DC" />
      </mesh>
      
      {/* Page Number */}
      <Text
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color={currentPage % 2 === 0 ? "#000000" : "#FF0000"}
      >
        {currentPage}
      </Text>
      
      {/* Instructions */}
      <Text
        position={[0, 0.12, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.15}
        color="#000000"
      >
        {isFlipping ? "Press STOP to stop flipping" : "Press START to flip pages"}
      </Text>
    </group>
  );
}

export function SimpleCricketGame() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [gameMode, setGameMode] = useState<GameMode>('two_player');
  const [overs, setOvers] = useState<2 | 5 | 10 | 20>(5);
  const [currentPage, setCurrentPage] = useState(2);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [battingFirst, setBattingFirst] = useState<'team1' | 'team2'>('team1');
  
  // Initialize teams
  const [team1, setTeam1] = useState<Team>({
    name: 'Team A',
    players: Array.from({ length: 5 }, (_, i) => ({
      name: `Player ${i + 1}`,
      runs: 0,
      ballsFaced: 0,
      isOut: false
    })),
    totalRuns: 0,
    wickets: 0,
    balls: 0
  });
  
  const [team2, setTeam2] = useState<Team>({
    name: 'Team B',
    players: Array.from({ length: 5 }, (_, i) => ({
      name: `Player ${i + 1}`,
      runs: 0,
      ballsFaced: 0,
      isOut: false
    })),
    totalRuns: 0,
    wickets: 0,
    balls: 0
  });

  const [winner, setWinner] = useState<string>('');

  // Get current batting team
  const battingTeam = currentInnings === 1 
    ? (battingFirst === 'team1' ? team1 : team2)
    : (battingFirst === 'team1' ? team2 : team1);
  
  const bowlingTeam = currentInnings === 1 
    ? (battingFirst === 'team1' ? team2 : team1)
    : (battingFirst === 'team1' ? team1 : team2);

  // Page flipping logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFlipping) {
      interval = setInterval(() => {
        setCurrentPage(prev => prev === 999 ? 2 : prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isFlipping]);

  // Start flipping
  const startFlipping = () => {
    if (gamePhase === 'playing') {
      setIsFlipping(true);
    }
  };

  // Stop flipping and process score
  const stopFlipping = () => {
    if (!isFlipping || gamePhase !== 'playing') return;
    
    setIsFlipping(false);
    
    // Only even pages count
    if (currentPage % 2 !== 0) return;
    
    const lastDigit = currentPage % 10;
    let runs = 0;
    let isWicket = false;
    
    // Scoring rules
    if (lastDigit === 0) {
      isWicket = true;
    } else if (lastDigit >= 1 && lastDigit <= 7) {
      runs = lastDigit;
    }
    
    // Update batting team
    const newBattingTeam = { ...battingTeam };
    newBattingTeam.balls++;
    
    if (isWicket) {
      newBattingTeam.wickets++;
      // Mark current batsman as out
      const currentBatsman = newBattingTeam.players.find(p => !p.isOut);
      if (currentBatsman) {
        currentBatsman.isOut = true;
        currentBatsman.ballsFaced++;
      }
    } else {
      newBattingTeam.totalRuns += runs;
      // Update current batsman
      const currentBatsman = newBattingTeam.players.find(p => !p.isOut);
      if (currentBatsman) {
        currentBatsman.runs += runs;
        currentBatsman.ballsFaced++;
      }
    }
    
    // Update state
    if (currentInnings === 1) {
      if (battingFirst === 'team1') {
        setTeam1(newBattingTeam);
      } else {
        setTeam2(newBattingTeam);
      }
    } else {
      if (battingFirst === 'team1') {
        setTeam2(newBattingTeam);
      } else {
        setTeam1(newBattingTeam);
      }
    }
    
    // Check for innings end
    const totalBalls = overs * 6;
    const target = currentInnings === 2 ? bowlingTeam.totalRuns + 1 : null;
    
    if (newBattingTeam.wickets >= 4 || 
        newBattingTeam.balls >= totalBalls ||
        (target && newBattingTeam.totalRuns >= target)) {
      
      if (currentInnings === 1) {
        // End of first innings
        setCurrentInnings(2);
        alert(`End of first innings! ${bowlingTeam.name} needs ${newBattingTeam.totalRuns + 1} runs to win.`);
      } else {
        // End of match
        const team1Final = battingFirst === 'team1' ? team1 : team2;
        const team2Final = battingFirst === 'team1' ? team2 : team1;
        
        if (team1Final.totalRuns > team2Final.totalRuns) {
          setWinner(`${team1Final.name} wins by ${team1Final.totalRuns - team2Final.totalRuns} runs!`);
        } else if (team2Final.totalRuns > team1Final.totalRuns) {
          setWinner(`${team2Final.name} wins by ${4 - team2Final.wickets} wickets!`);
        } else {
          setWinner("Match Tied!");
        }
        setGamePhase('match_end');
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        startFlipping();
      } else if (e.code === 'Enter') {
        e.preventDefault();
        stopFlipping();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        restartGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipping, gamePhase]);

  const startGame = () => {
    // Random toss
    const tossWinner = Math.random() < 0.5 ? 'team1' : 'team2';
    setBattingFirst(tossWinner);
    setGamePhase('playing');
    alert(`${tossWinner === 'team1' ? team1.name : team2.name} wins the toss and will bat first!`);
  };

  const restartGame = () => {
    setGamePhase('setup');
    setCurrentInnings(1);
    setCurrentPage(2);
    setIsFlipping(false);
    setWinner('');
    
    // Reset teams
    const resetTeam = (team: Team) => ({
      ...team,
      totalRuns: 0,
      wickets: 0,
      balls: 0,
      players: team.players.map(p => ({
        ...p,
        runs: 0,
        ballsFaced: 0,
        isOut: false
      }))
    });
    
    setTeam1(resetTeam(team1));
    setTeam2(resetTeam(team2));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 10, 20], fov: 45 }}
        style={{ background: '#87CEEB' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />
        
        <Stadium />
        
        {gamePhase === 'playing' && (
          <PageFlipBook 
            onPageFlip={stopFlipping}
            isFlipping={isFlipping}
            currentPage={currentPage}
          />
        )}
        
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        {/* Title */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px',
          pointerEvents: 'auto'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>3D Cricket Championship</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
            {gamePhase === 'setup' ? 'Ready to Start' : 
             gamePhase === 'playing' ? `${currentInnings === 1 ? '1st' : '2nd'} Innings` :
             'Match Ended'}
          </p>
        </div>

        {/* Setup Screen */}
        {gamePhase === 'setup' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            textAlign: 'center',
            pointerEvents: 'auto',
            minWidth: '400px'
          }}>
            <h2>Game Setup</h2>
            
            <div style={{ margin: '20px 0' }}>
              <label>Game Mode: </label>
              <select 
                value={gameMode} 
                onChange={(e) => setGameMode(e.target.value as GameMode)}
                style={{ margin: '0 10px', padding: '5px' }}
              >
                <option value="two_player">Two Team Match</option>
                <option value="vs_computer">Play vs Computer</option>
              </select>
            </div>
            
            <div style={{ margin: '20px 0' }}>
              <label>Overs: </label>
              <select 
                value={overs} 
                onChange={(e) => setOvers(Number(e.target.value) as 2 | 5 | 10 | 20)}
                style={{ margin: '0 10px', padding: '5px' }}
              >
                <option value={2}>2 Overs</option>
                <option value={5}>5 Overs</option>
                <option value={10}>10 Overs</option>
                <option value={20}>20 Overs</option>
              </select>
            </div>
            
            <div style={{ margin: '20px 0' }}>
              <input 
                type="text" 
                value={team1.name}
                onChange={(e) => setTeam1({ ...team1, name: e.target.value })}
                placeholder="Team 1 Name"
                style={{ margin: '5px', padding: '8px', width: '150px' }}
              />
              <br />
              <input 
                type="text" 
                value={team2.name}
                onChange={(e) => setTeam2({ ...team2, name: e.target.value })}
                placeholder="Team 2 Name"
                style={{ margin: '5px', padding: '8px', width: '150px' }}
              />
            </div>
            
            <button 
              onClick={startGame}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Start Match
            </button>
          </div>
        )}

        {/* Game UI */}
        {gamePhase === 'playing' && (
          <>
            {/* Scoreboard */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.9)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              minWidth: '300px'
            }}>
              <h3 style={{ margin: '0 0 15px 0' }}>{battingTeam.name}</h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
                {battingTeam.totalRuns}/{battingTeam.wickets}
              </div>
              <div style={{ fontSize: '18px', margin: '10px 0' }}>
                ({Math.floor(battingTeam.balls / 6)}.{battingTeam.balls % 6} overs)
              </div>
              
              {currentInnings === 2 && (
                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,100,200,0.3)', borderRadius: '5px' }}>
                  Target: {bowlingTeam.totalRuns + 1}<br />
                  Need: {Math.max(0, bowlingTeam.totalRuns + 1 - battingTeam.totalRuns)} runs
                </div>
              )}
              
              <div style={{ marginTop: '15px', fontSize: '14px', opacity: 0.8 }}>
                {bowlingTeam.name}: {bowlingTeam.totalRuns}/{bowlingTeam.wickets}
              </div>
            </div>

            {/* Controls */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Controls:</h4>
              <p style={{ margin: '5px 0' }}>SPACE - Start page flipping</p>
              <p style={{ margin: '5px 0' }}>ENTER - Stop page flipping</p>
              <p style={{ margin: '5px 0' }}>R - Restart match</p>
              
              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.3)' }}>
                <strong>Scoring Rules:</strong>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>• Only even page numbers count</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>• Last digit 1-7: Add to score</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>• Last digit 0: Wicket falls</p>
              </div>
            </div>

            {/* Current Action */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0,150,0,0.9)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              pointerEvents: 'auto'
            }}>
              <button
                onClick={startFlipping}
                disabled={isFlipping}
                style={{
                  background: isFlipping ? '#666' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: isFlipping ? 'not-allowed' : 'pointer',
                  margin: '5px'
                }}
              >
                START
              </button>
              <button
                onClick={stopFlipping}
                disabled={!isFlipping}
                style={{
                  background: !isFlipping ? '#666' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: !isFlipping ? 'not-allowed' : 'pointer',
                  margin: '5px'
                }}
              >
                STOP
              </button>
            </div>
          </>
        )}

        {/* Match End */}
        {gamePhase === 'match_end' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
            pointerEvents: 'auto',
            border: '3px solid #28a745'
          }}>
            <h2 style={{ color: '#28a745', margin: '0 0 20px 0' }}>🏆 Match Complete! 🏆</h2>
            <h3 style={{ margin: '20px 0' }}>{winner}</h3>
            
            <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'space-around' }}>
              <div>
                <strong>{team1.name}</strong><br />
                {team1.totalRuns}/{team1.wickets}
              </div>
              <div>
                <strong>{team2.name}</strong><br />
                {team2.totalRuns}/{team2.wickets}
              </div>
            </div>
            
            <button 
              onClick={restartGame}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}