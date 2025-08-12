import React from 'react';
import { useCricket } from "../../lib/stores/useCricket.tsx";
import { Card, CardContent } from "../ui/card";

export function Scoreboard() {
  const { 
    teams, 
    currentInnings,
    battingTeam,
    bowlingTeam,
    currentBatsman,
    matchFormat,
    gamePhase,
    target
  } = useCricket();

  if (!teams || !battingTeam || !bowlingTeam) return null;

  const battingStats = battingTeam;
  const bowlingStats = bowlingTeam;
  
  const overs = Math.floor(battingStats.balls / 6);
  const remainingBalls = battingStats.balls % 6;
  const oversDisplay = `${overs}.${remainingBalls}`;

  const required = target ? target - battingStats.totalRuns : 0;
  const remainingOvers = matchFormat ? (matchFormat.overs * 6) - battingStats.balls : 0;
  const runRate = battingStats.balls > 0 ? (battingStats.totalRuns / battingStats.balls * 6).toFixed(2) : '0.00';
  const reqRunRate = remainingOvers > 0 && target ? (required / remainingOvers * 6).toFixed(2) : '0.00';

  return (
    <div className="flex justify-center">
      <Card className="bg-black/90 text-white backdrop-blur-sm min-w-96">
        <CardContent className="p-4">
          {/* Main Score */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">
              {battingStats.name}
            </h2>
            <div className="text-4xl font-bold">
              {battingStats.totalRuns}/{battingStats.wickets}
            </div>
            <div className="text-lg">
              ({oversDisplay} overs)
            </div>
          </div>

          {/* Current Batsman */}
          {currentBatsman && gamePhase === 'playing' && (
            <div className="mb-4 p-2 bg-white/10 rounded">
              <div className="text-center">
                <p className="font-semibold">Currently Batting</p>
                <p>{currentBatsman.name}</p>
                <p className="text-sm">
                  {currentBatsman.runs} runs ({currentBatsman.ballsFaced} balls)
                </p>
              </div>
            </div>
          )}

          {/* Target Information (2nd Innings) */}
          {currentInnings === 2 && target && (
            <div className="mb-4 p-2 bg-blue-900/50 rounded text-center">
              <p className="text-sm">Target: {target}</p>
              <p className="text-sm">
                Need {required} runs in {Math.floor(remainingOvers / 6)}.{remainingOvers % 6} overs
              </p>
              <p className="text-xs">
                RR: {runRate} | Req RR: {reqRunRate}
              </p>
            </div>
          )}

          {/* Match Progress */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Innings</p>
              <p>{currentInnings}/2</p>
            </div>
            <div>
              <p className="font-semibold">Format</p>
              <p>{matchFormat?.overs} overs</p>
            </div>
            <div>
              <p className="font-semibold">Wickets Left</p>
              <p>{4 - battingStats.wickets}</p>
            </div>
            <div>
              <p className="font-semibold">Run Rate</p>
              <p>{runRate}</p>
            </div>
          </div>

          {/* Opposition Score (if 2nd innings) */}
          {currentInnings === 2 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-center text-sm">
                {bowlingStats.name}: {bowlingStats.totalRuns}/{bowlingStats.wickets}
              </p>
            </div>
          )}

          {/* Game Phase Indicator */}
          <div className="mt-4 text-center">
            <div className="inline-block px-2 py-1 bg-green-600 rounded text-xs">
              {gamePhase === 'playing' ? 'LIVE' : 
               gamePhase === 'innings_break' ? 'INNINGS BREAK' :
               gamePhase === 'match_end' ? 'MATCH ENDED' : 'READY'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
