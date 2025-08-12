import React, { useState } from 'react';

export function BasicCricket() {
  const [gamePhase, setGamePhase] = useState<'setup' | 'playing' | 'end'>('setup');
  const [currentPage, setCurrentPage] = useState(2);
  const [isFlipping, setIsFlipping] = useState(false);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Wickets, setTeam1Wickets] = useState(0);
  const [team2Wickets, setTeam2Wickets] = useState(0);
  const [currentInnings, setCurrentInnings] = useState(1);
  const [overs, setOvers] = useState(5);
  const [ballsPlayed, setBallsPlayed] = useState(0);

  const startGame = () => {
    setGamePhase('playing');
  };

  const flipPage = () => {
    if (gamePhase !== 'playing') return;
    
    if (isFlipping) {
      // Stop flipping and calculate score
      setIsFlipping(false);
      
      if (currentPage % 2 === 0) {
        const lastDigit = currentPage % 10;
        
        if (lastDigit === 0) {
          // Wicket
          if (currentInnings === 1) {
            setTeam1Wickets(prev => prev + 1);
          } else {
            setTeam2Wickets(prev => prev + 1);
          }
        } else if (lastDigit >= 1 && lastDigit <= 7) {
          // Runs
          if (currentInnings === 1) {
            setTeam1Score(prev => prev + lastDigit);
          } else {
            setTeam2Score(prev => prev + lastDigit);
          }
        }
        
        setBallsPlayed(prev => prev + 1);
        
        // Check for end of innings
        const currentWickets = currentInnings === 1 ? team1Wickets : team2Wickets;
        if (currentWickets >= 4 || ballsPlayed >= overs * 6) {
          if (currentInnings === 1) {
            setCurrentInnings(2);
            setBallsPlayed(0);
            alert(`End of first innings! Team B needs ${(currentInnings === 1 ? team1Score : team2Score) + 1} runs to win.`);
          } else {
            setGamePhase('end');
          }
        }
      }
    } else {
      // Start flipping
      setIsFlipping(true);
      const interval = setInterval(() => {
        setCurrentPage(prev => prev === 999 ? 2 : prev + 1);
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
      }, 10000); // Auto stop after 10 seconds
    }
  };

  const restartGame = () => {
    setGamePhase('setup');
    setCurrentPage(2);
    setIsFlipping(false);
    setTeam1Score(0);
    setTeam2Score(0);
    setTeam1Wickets(0);
    setTeam2Wickets(0);
    setCurrentInnings(1);
    setBallsPlayed(0);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3rem', margin: '20px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        🏏 3D Cricket Championship
      </h1>

      {gamePhase === 'setup' && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h2>Game Setup</h2>
          <div style={{ margin: '20px 0' }}>
            <label>Overs: </label>
            <select 
              value={overs} 
              onChange={(e) => setOvers(Number(e.target.value))}
              style={{ 
                padding: '10px', 
                fontSize: '16px', 
                borderRadius: '5px',
                border: 'none',
                background: 'white',
                color: 'black'
              }}
            >
              <option value={2}>2 Overs</option>
              <option value={5}>5 Overs</option>
              <option value={10}>10 Overs</option>
              <option value={20}>20 Overs</option>
            </select>
          </div>
          <button 
            onClick={startGame}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '18px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Start Match
          </button>
          
          <div style={{ marginTop: '30px', fontSize: '14px', opacity: 0.8 }}>
            <h3>How to Play:</h3>
            <p>• Click "Flip Page" to start/stop page flipping</p>
            <p>• Only even page numbers count for scoring</p>
            <p>• Last digit 0 = Wicket, 1-7 = Runs</p>
            <p>• Each team has 4 wickets</p>
          </div>
        </div>
      )}

      {gamePhase === 'playing' && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px' }}>
          {/* Scoreboard */}
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            padding: '20px',
            borderRadius: '15px',
            margin: '20px 0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px'
          }}>
            <div>
              <h3>Team A {currentInnings === 1 ? '(Batting)' : ''}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {team1Score}/{team1Wickets}
              </div>
            </div>
            <div>
              <h3>Team B {currentInnings === 2 ? '(Batting)' : ''}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {team2Score}/{team2Wickets}
              </div>
            </div>
          </div>

          {/* Page Book */}
          <div style={{
            background: '#8B4513',
            padding: '30px',
            borderRadius: '20px',
            margin: '30px 0',
            border: '5px solid #654321'
          }}>
            <div style={{
              background: '#F5F5DC',
              color: 'black',
              padding: '40px',
              borderRadius: '10px',
              fontSize: '3rem',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Page: <span style={{ color: currentPage % 2 === 0 ? 'green' : 'red' }}>
                {currentPage}
              </span>
            </div>
            
            <button 
              onClick={flipPage}
              style={{
                background: isFlipping ? '#dc3545' : '#28a745',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '10px',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              {isFlipping ? 'STOP FLIPPING' : 'START FLIPPING'}
            </button>
          </div>

          {/* Game Info */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '10px',
            fontSize: '18px'
          }}>
            <p>Innings: {currentInnings}/2 | Balls: {ballsPlayed}/{overs * 6}</p>
            {currentInnings === 2 && (
              <p>Target: {team1Score + 1} | Need: {Math.max(0, team1Score + 1 - team2Score)} runs</p>
            )}
          </div>
        </div>
      )}

      {gamePhase === 'end' && (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <h2>🏆 Match Complete! 🏆</h2>
          <div style={{ margin: '20px 0', fontSize: '1.5rem' }}>
            {team1Score > team2Score 
              ? `Team A wins by ${team1Score - team2Score} runs!`
              : team2Score > team1Score
              ? `Team B wins by ${4 - team2Wickets} wickets!`
              : 'Match Tied!'
            }
          </div>
          
          <div style={{ margin: '20px 0' }}>
            <p>Team A: {team1Score}/{team1Wickets}</p>
            <p>Team B: {team2Score}/{team2Wickets}</p>
          </div>
          
          <button 
            onClick={restartGame}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '10px',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}