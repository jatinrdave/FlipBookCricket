import React, { useState, useEffect } from 'react';
import { useCricket } from "../../lib/stores/useCricket.tsx";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function TossScreen() {
  const { teams, startMatch } = useCricket();
  const [isFlipping, setIsFlipping] = useState(false);
  const [tossResult, setTossResult] = useState<'team1' | 'team2' | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleToss = () => {
    setIsFlipping(true);
    setTossResult(null);
    setShowResult(false);

    // Simulate coin flip animation
    setTimeout(() => {
      const winner = Math.random() < 0.5 ? 'team1' : 'team2';
      setTossResult(winner);
      setIsFlipping(false);
      setShowResult(true);
    }, 2000);
  };

  const handleStartMatch = () => {
    if (tossResult) {
      // Toss winner always bats first as per requirements
      startMatch(tossResult === 'team1' ? 'team1' : 'team2');
    }
  };

  if (!teams) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Toss Time! 🪙</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-lg">{teams.team1.name} vs {teams.team2.name}</p>
            <p className="text-sm text-gray-600">
              The winning team will bat first
            </p>
          </div>

          {/* Coin Animation */}
          <div className="flex justify-center">
            <div 
              className={`w-20 h-20 rounded-full bg-yellow-400 border-4 border-yellow-600 
                         flex items-center justify-center text-2xl font-bold
                         ${isFlipping ? 'animate-spin' : ''} transition-all duration-500`}
            >
              🪙
            </div>
          </div>

          {!showResult && !isFlipping && (
            <Button onClick={handleToss} size="lg">
              Flip the Coin!
            </Button>
          )}

          {isFlipping && (
            <p className="text-lg text-blue-600">Flipping the coin...</p>
          )}

          {showResult && tossResult && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  🎉 Toss Winner! 🎉
                </h3>
                <p className="text-lg">
                  {tossResult === 'team1' ? teams.team1.name : teams.team2.name}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Will bat first in this match
                </p>
              </div>
              
              <Button onClick={handleStartMatch} size="lg">
                Start Match
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500">
            <p>Cricket tradition: Toss winner decides batting order</p>
            <p>In this game, winner always chooses to bat first!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
