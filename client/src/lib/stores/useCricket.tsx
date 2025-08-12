import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// Cricket rules functions (inline to avoid import issues)
function calculateScore(lastDigit: number): { runs: number; isWicket: boolean } {
  if (lastDigit === 0) {
    return { runs: 0, isWicket: true };
  } else if (lastDigit >= 1 && lastDigit <= 7) {
    return { runs: lastDigit, isWicket: false };
  } else {
    return { runs: 0, isWicket: false };
  }
}

function checkInningsEnd(
  wickets: number,
  ballsFaced: number,
  totalBalls: number,
  target?: number | null,
  currentRuns?: number
): boolean {
  if (wickets >= 4) return true;
  if (ballsFaced >= totalBalls) return true;
  if (target && currentRuns && currentRuns >= target) return true;
  return false;
}

function checkMatchEnd(firstInnings: any, secondInnings: any) {
  const team1Runs = firstInnings.totalRuns;
  const team2Runs = secondInnings.totalRuns;
  
  if (team1Runs > team2Runs) {
    return {
      winner: `${firstInnings.name} wins!`,
      margin: `by ${team1Runs - team2Runs} runs`
    };
  } else if (team2Runs > team1Runs) {
    return {
      winner: `${secondInnings.name} wins!`,
      margin: `by ${4 - secondInnings.wickets} wickets`
    };
  } else {
    return {
      winner: "Match Tied!",
      margin: "Both teams scored equal runs"
    };
  }
}

export type GamePhase = 
  | "team_selection" 
  | "match_settings" 
  | "toss" 
  | "playing" 
  | "innings_break" 
  | "match_end";

export type GameMode = "two_player" | "vs_computer";

export interface Player {
  id: string;
  name: string;
  isOut: boolean;
  runs: number;
  ballsFaced: number;
}

export interface Team {
  name: string;
  players: Player[];
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
}

export interface Teams {
  team1: Team;
  team2: Team;
}

export interface MatchFormat {
  overs: 2 | 5 | 10 | 20;
  wickets: number;
}

export interface MatchResult {
  winner: string;
  margin: string;
}

interface CricketState {
  // Game state
  gamePhase: GamePhase;
  gameMode: GameMode | null;
  teams: Teams | null;
  matchFormat: MatchFormat | null;
  currentInnings: 1 | 2;
  battingFirst: 'team1' | 'team2' | null;
  target: number | null;
  matchResult: MatchResult | null;
  
  // Current game state
  battingTeam: Team | null;
  bowlingTeam: Team | null;
  currentBatsman: Player | null;
  isPlayerTurn: boolean;
  
  // Actions
  setGameMode: (mode: GameMode) => void;
  setTeams: (teams: Teams) => void;
  setMatchFormat: (format: MatchFormat) => void;
  proceedToMatchSettings: () => void;
  proceedToToss: () => void;
  startMatch: (battingFirst: 'team1' | 'team2') => void;
  processPageResult: (pageNumber: number, lastDigit: number) => void;
  nextBatsman: () => void;
  restartMatch: () => void;
}

export const useCricket = create<CricketState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gamePhase: "team_selection",
    gameMode: null,
    teams: null,
    matchFormat: null,
    currentInnings: 1,
    battingFirst: null,
    target: null,
    matchResult: null,
    battingTeam: null,
    bowlingTeam: null,
    currentBatsman: null,
    isPlayerTurn: true,

    setGameMode: (mode) => set({ gameMode: mode }),
    
    setTeams: (teams) => set({ teams }),
    
    setMatchFormat: (format) => set({ matchFormat: format }),
    
    proceedToMatchSettings: () => set({ gamePhase: "match_settings" }),
    
    proceedToToss: () => set({ gamePhase: "toss" }),
    
    startMatch: (battingFirst) => {
      const { teams, gameMode } = get();
      if (!teams) return;
      
      const battingTeam = battingFirst === 'team1' ? teams.team1 : teams.team2;
      const bowlingTeam = battingFirst === 'team1' ? teams.team2 : teams.team1;
      const currentBatsman = battingTeam.players.find(p => !p.isOut) || null;
      
      const isPlayerTeamBatting = (battingFirst === 'team1' && teams.team1.name !== 'Computer Team') ||
                                  (battingFirst === 'team2' && teams.team2.name !== 'Computer Team');

      set({
        gamePhase: "playing",
        battingFirst,
        battingTeam,
        bowlingTeam,
        currentBatsman,
        currentInnings: 1,
        isPlayerTurn: isPlayerTeamBatting
      });
      
      console.log(`Match started! ${battingTeam.name} batting first`);

      if (!isPlayerTeamBatting && gameMode === 'vs_computer') {
        get().computerTurn();
      }
    },
    
    processPageResult: (pageNumber, lastDigit) => {
      const state = get();
      if (!state.battingTeam || !state.bowlingTeam || !state.currentBatsman || !state.matchFormat) return;
      
      console.log(`Processing page ${pageNumber}, last digit: ${lastDigit}`);
      
      // Only even pages count
      if (pageNumber % 2 !== 0) {
        console.log("Odd page - no scoring");
        // If it's the computer's turn and it landed on an odd page, it should try again
        if (!state.isPlayerTurn && state.gameMode === 'vs_computer') {
          setTimeout(() => get().computerTurn(), 1000); // Retry after 1 second
        }
        return;
      }
      
      const { runs, isWicket } = calculateScore(lastDigit);
      
      // Update current batsman
      const updatedBatsman = {
        ...state.currentBatsman,
        ballsFaced: state.currentBatsman.ballsFaced + 1,
        runs: isWicket ? state.currentBatsman.runs : state.currentBatsman.runs + runs,
        isOut: isWicket
      };
      
      // Update batting team
      const updatedBattingTeam = {
        ...state.battingTeam,
        players: state.battingTeam.players.map(p => 
          p.id === updatedBatsman.id ? updatedBatsman : p
        ),
        totalRuns: isWicket ? state.battingTeam.totalRuns : state.battingTeam.totalRuns + runs,
        wickets: isWicket ? state.battingTeam.wickets + 1 : state.battingTeam.wickets,
        balls: state.battingTeam.balls + 1
      };
      
      console.log(`Result: ${isWicket ? 'WICKET!' : `${runs} runs`}`);
      
      // Check if innings should end
      const inningsEnded = checkInningsEnd(
        updatedBattingTeam.wickets, 
        updatedBattingTeam.balls, 
        state.matchFormat.overs * 6,
        state.target,
        updatedBattingTeam.totalRuns
      );
      
      if (inningsEnded) {
        if (state.currentInnings === 1) {
          // End of first innings
          const updatedTeams = {
            ...state.teams!,
            [state.battingFirst === 'team1' ? 'team1' : 'team2']: updatedBattingTeam
          };
          
          set({
            gamePhase: "innings_break",
            teams: updatedTeams,
            battingTeam: updatedBattingTeam,
            target: updatedBattingTeam.totalRuns + 1,
            isPlayerTurn: true // Reset for next innings
          });
          
          // Auto-start second innings after 3 seconds
          setTimeout(() => {
            const { teams, battingFirst, gameMode } = get();
            if (!teams) return;
            
            const newBattingTeam = battingFirst === 'team1' ? teams.team2 : teams.team1;
            const newBowlingTeam = battingFirst === 'team1' ? teams.team1 : teams.team2;
            const newCurrentBatsman = newBattingTeam.players.find(p => !p.isOut) || null;

            const isPlayerTeamBattingNext = (newBattingTeam.name !== 'Computer Team');
            
            set({
              gamePhase: "playing",
              currentInnings: 2,
              battingTeam: newBattingTeam,
              bowlingTeam: newBowlingTeam,
              currentBatsman: newCurrentBatsman,
              isPlayerTurn: isPlayerTeamBattingNext
            });

            if (!isPlayerTeamBattingNext && gameMode === 'vs_computer') {
              get().computerTurn();
            }
          }, 3000);
        } else {
          // End of match
          const updatedTeams = {
            ...state.teams!,
            [state.battingFirst === 'team1' ? 'team2' : 'team1']: updatedBattingTeam
          };
          
          const matchResult = checkMatchEnd(
            state.battingFirst === 'team1' ? updatedTeams.team1 : updatedTeams.team2,
            state.battingFirst === 'team1' ? updatedTeams.team2 : updatedTeams.team1
          );
          
          set({
            gamePhase: "match_end",
            teams: updatedTeams,
            battingTeam: updatedBattingTeam,
            matchResult,
            isPlayerTurn: true // Reset for match end
          });
        }
      } else {
        // Continue game
        const nextBatsman = isWicket ? updatedBattingTeam.players.find(p => !p.isOut) || null : updatedBatsman;
        const isPlayerTeamBattingNow = (updatedBattingTeam.name !== 'Computer Team');

        set({
          battingTeam: updatedBattingTeam,
          currentBatsman: nextBatsman,
          teams: {
            ...state.teams!,
            [state.battingFirst === 'team1' ? 'team1' : 'team2']: updatedBattingTeam
          },
          isPlayerTurn: isPlayerTeamBattingNow // Ensure player turn is correctly set
        });

        // If it's now the computer's turn, trigger it
        if (!isPlayerTeamBattingNow && state.gameMode === 'vs_computer' && nextBatsman) {
          setTimeout(() => get().computerTurn(), 1000); // Simulate computer thinking time
        }
      }
    },
    
    nextBatsman: () => {
      const { battingTeam } = get();
      if (!battingTeam) return;
      
      const nextBatsman = battingTeam.players.find(p => !p.isOut) || null;
      set({ currentBatsman: nextBatsman });
    },

    computerTurn: () => {
      const state = get();
      if (state.gameMode !== 'vs_computer' || state.isPlayerTurn || state.gamePhase !== 'playing') {
        return;
      }

      console.log("Computer's turn...");
      // Simulate page flip
      const randomPage = Math.floor(Math.random() * 998) + 2; // Random page between 2 and 999
      const lastDigit = randomPage % 10;

      // Simulate a delay for the computer's "action"
      setTimeout(() => {
        get().processPageResult(randomPage, lastDigit);
      }, 1500); // Simulate 1.5 seconds of "thinking"
    },
    
    restartMatch: () => set({
      gamePhase: "team_selection",
      gameMode: null,
      teams: null,
      matchFormat: null,
      currentInnings: 1,
      battingFirst: null,
      target: null,
      matchResult: null,
      battingTeam: null,
      bowlingTeam: null,
      currentBatsman: null,
      isPlayerTurn: true
    })
  }))
);
