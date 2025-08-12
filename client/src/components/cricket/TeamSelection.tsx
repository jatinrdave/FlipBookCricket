import React, { useState } from 'react';
import { useCricket } from "../../lib/stores/useCricket.tsx";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function TeamSelection() {
  const { setGameMode, setTeams, proceedToMatchSettings } = useCricket();
  const [gameMode, setLocalGameMode] = useState<'two_player' | 'vs_computer'>('two_player');
  const [team1Name, setTeam1Name] = useState('Team A');
  const [team2Name, setTeam2Name] = useState('Team B');
  const [team1Players, setTeam1Players] = useState([
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'
  ]);
  const [team2Players, setTeam2Players] = useState([
    'Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5'
  ]);

  const handleProceed = () => {
    // Set game mode
    setGameMode(gameMode);
    
    // Create teams
    const teams = {
      team1: {
        name: team1Name,
        players: team1Players.map((name, index) => ({
          id: `t1_p${index + 1}`,
          name,
          isOut: false,
          runs: 0,
          ballsFaced: 0
        })),
        totalRuns: 0,
        wickets: 0,
        overs: 0,
        balls: 0
      },
      team2: {
        name: team2Name,
        players: team2Players.map((name, index) => ({
          id: `t2_p${index + 1}`,
          name,
          isOut: false,
          runs: 0,
          ballsFaced: 0
        })),
        totalRuns: 0,
        wickets: 0,
        overs: 0,
        balls: 0
      }
    };
    
    setTeams(teams);
    proceedToMatchSettings();
  };

  const updatePlayerName = (teamIndex: number, playerIndex: number, name: string) => {
    if (teamIndex === 1) {
      const newPlayers = [...team1Players];
      newPlayers[playerIndex] = name;
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[playerIndex] = name;
      setTeam2Players(newPlayers);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Team Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Game Mode Selection */}
          <div>
            <Label className="text-lg font-semibold">Game Mode</Label>
            <div className="flex gap-4 mt-2">
              <Button
                variant={gameMode === 'two_player' ? 'default' : 'outline'}
                onClick={() => setLocalGameMode('two_player')}
              >
                Two Team Match
              </Button>
              <Button
                variant={gameMode === 'vs_computer' ? 'default' : 'outline'}
                onClick={() => setLocalGameMode('vs_computer')}
              >
                Play vs Computer
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 */}
            <Card>
              <CardHeader>
                <CardTitle>Team 1</CardTitle>
                <Input
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Team Name"
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <Label>Players (5 batting players, 4 wickets)</Label>
                {team1Players.map((player, index) => (
                  <div key={index}>
                    <Label className="text-sm">Player {index + 1}</Label>
                    <Input
                      value={player}
                      onChange={(e) => updatePlayerName(1, index, e.target.value)}
                      placeholder={`Player ${index + 1}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Team 2 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {gameMode === 'vs_computer' ? 'Computer Team' : 'Team 2'}
                </CardTitle>
                <Input
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Team Name"
                  disabled={gameMode === 'vs_computer'}
                />
              </CardHeader>
              <CardContent className="space-y-3">
                <Label>Players (5 batting players, 4 wickets)</Label>
                {team2Players.map((player, index) => (
                  <div key={index}>
                    <Label className="text-sm">Player {index + 1}</Label>
                    <Input
                      value={gameMode === 'vs_computer' ? `CPU Player ${index + 1}` : player}
                      onChange={(e) => updatePlayerName(2, index, e.target.value)}
                      placeholder={`Player ${index + 1}`}
                      disabled={gameMode === 'vs_computer'}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleProceed} size="lg">
              Proceed to Match Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
