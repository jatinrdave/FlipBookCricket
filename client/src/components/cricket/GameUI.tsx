import React from 'react';
import { useCricket } from "../../lib/stores/useCricket.tsx";
import { Scoreboard } from "./Scoreboard.tsx";
import { Button } from "../ui/button";

export function GameUI() {
  const { 
    gamePhase, 
    restartMatch,
    teams,
    currentInnings,
    matchResult 
  } = useCricket();

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top UI Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Game Title */}
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <h1 className="text-xl font-bold">3D Cricket Championship</h1>
          <p className="text-sm opacity-80">
            {gamePhase === 'playing' ? `${currentInnings === 1 ? '1st' : '2nd'} Innings` : 
             gamePhase === 'team_selection' ? 'Select Teams' :
             gamePhase === 'match_settings' ? 'Match Settings' :
             gamePhase === 'toss' ? 'Toss Time' :
             gamePhase === 'innings_break' ? 'Innings Break' :
             gamePhase === 'match_end' ? 'Match Ended' : 'Ready to Play'}
          </p>
        </div>

        {/* Restart Button */}
        {(gamePhase === 'playing' || gamePhase === 'match_end' || gamePhase === 'innings_break') && (
          <Button 
            onClick={restartMatch}
            variant="destructive"
            size="sm"
          >
            Restart Match
          </Button>
        )}
      </div>

      {/* Scoreboard */}
      {(gamePhase === 'playing' || gamePhase === 'innings_break' || gamePhase === 'match_end') && (
        <div className="absolute top-20 left-4 right-4">
          <Scoreboard />
        </div>
      )}

      {/* Match Result */}
      {gamePhase === 'match_end' && matchResult && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-lg p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              🏆 Match Complete! 🏆
            </h2>
            <p className="text-lg mb-2">{matchResult.winner}</p>
            <p className="text-sm text-gray-600 mb-4">{matchResult.margin}</p>
            <Button onClick={restartMatch} size="lg">
              Play Again
            </Button>
          </div>
        </div>
      )}

      {/* Controls Help */}
      {gamePhase === 'playing' && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm text-sm">
          <h3 className="font-semibold mb-2">Controls:</h3>
          <p>SPACE - Start page flipping</p>
          <p>ENTER - Stop page flipping</p>
          <p>R - Restart match</p>
          <div className="mt-2 pt-2 border-t border-white/20">
            <h4 className="font-medium">Scoring Rules:</h4>
            <p>• Only even page numbers count</p>
            <p>• Last digit 1-7: Add to score</p>
            <p>• Last digit 0: Wicket falls</p>
          </div>
        </div>
      )}
    </div>
  );
}
