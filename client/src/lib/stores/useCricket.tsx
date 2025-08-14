import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  calculateScore,
  checkInningsEnd,
  checkMatchEnd,
  generateComputerAction,
  getNextBatsman,
  isValidScoringPage,
} from "../cricketRules";

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
  battingFirst: "team1" | "team2" | null;
  target: number | null;
  matchResult: MatchResult | null;

  // Current game state
  battingTeam: Team | null;
  bowlingTeam: Team | null;
  currentBatsman: Player | null;
  isPlayerTurn: boolean;
  stoppedPage: number | null;
  needsVerification: boolean;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setTeams: (teams: Teams) => void;
  setMatchFormat: (format: MatchFormat) => void;
  proceedToMatchSettings: () => void;
  proceedToToss: () => void;
  startMatch: (battingFirst: "team1" | "team2") => void;
  processPageResult: (pageNumber: number, lastDigit: number) => void;
  nextBatsman: () => void;
  restartMatch: () => void;
  computerTurn: () => void;
  setStoppedPage: (page: number | null) => void;
  setNeedsVerification: (needs: boolean) => void;
  confirmPageResult: () => void;
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
    stoppedPage: null,
    needsVerification: false,

    setGameMode: (mode) => set({ gameMode: mode }),

    setTeams: (teams) => set({ teams }),

    setMatchFormat: (format) => set({ matchFormat: format }),

    proceedToMatchSettings: () => set({ gamePhase: "match_settings" }),

    proceedToToss: () => set({ gamePhase: "toss" }),

    startMatch: (battingFirst) => {
      const { teams, gameMode } = get();
      if (!teams) return;

      const battingTeam = battingFirst === "team1" ? teams.team1 : teams.team2;
      const bowlingTeam = battingFirst === "team1" ? teams.team2 : teams.team1;
      const currentBatsman = getNextBatsman(battingTeam.players);

      const isPlayerTeamBatting =
        (battingFirst === "team1" && teams.team1.name !== "Computer Team") ||
        (battingFirst === "team2" && teams.team2.name !== "Computer Team");

      set({
        gamePhase: "playing",
        battingFirst,
        battingTeam,
        bowlingTeam,
        currentBatsman,
        currentInnings: 1,
        isPlayerTurn: isPlayerTeamBatting,
      });

      console.log(`Match started! ${battingTeam.name} batting first`);

      if (!isPlayerTeamBatting && gameMode === "vs_computer") {
        get().computerTurn();
      }
    },

    processPageResult: (pageNumber, lastDigit) => {
      const state = get();
      if (
        !state.battingTeam ||
        !state.bowlingTeam ||
        !state.currentBatsman ||
        !state.matchFormat
      )
        return;

      console.log(`Processing page ${pageNumber}, last digit: ${lastDigit}`);

      if (!isValidScoringPage(pageNumber)) {
        console.log("Odd page - no scoring");
        if (!state.isPlayerTurn && state.gameMode === "vs_computer") {
          setTimeout(() => get().computerTurn(), 1000);
        }
        return;
      }

      const { runs, isWicket } = calculateScore(lastDigit);

      const updatedBatsman = {
        ...state.currentBatsman,
        ballsFaced: state.currentBatsman.ballsFaced + 1,
        runs: isWicket
          ? state.currentBatsman.runs
          : state.currentBatsman.runs + runs,
        isOut: isWicket,
      };

      const updatedBattingTeam = {
        ...state.battingTeam,
        players: state.battingTeam.players.map((p) =>
          p.id === updatedBatsman.id ? updatedBatsman : p
        ),
        totalRuns: isWicket
          ? state.battingTeam.totalRuns
          : state.battingTeam.totalRuns + runs,
        wickets: isWicket
          ? state.battingTeam.wickets + 1
          : state.battingTeam.wickets,
        balls: state.battingTeam.balls + 1,
      };

      console.log(`Result: ${isWicket ? "WICKET!" : `${runs} runs`}`);

      const inningsEnded = checkInningsEnd(
        updatedBattingTeam.wickets,
        updatedBattingTeam.balls,
        state.matchFormat.overs * 6,
        state.target,
        updatedBattingTeam.totalRuns
      );

      if (inningsEnded) {
        if (state.currentInnings === 1) {
          const updatedTeams = {
            ...state.teams!,
            [state.battingFirst === "team1" ? "team1" : "team2"]:
              updatedBattingTeam,
          };

          set({
            gamePhase: "innings_break",
            teams: updatedTeams,
            battingTeam: updatedBattingTeam,
            target: updatedBattingTeam.totalRuns + 1,
            isPlayerTurn: true,
          });

          setTimeout(() => {
            const { teams, battingFirst, gameMode } = get();
            if (!teams) return;

            const newBattingTeam =
              battingFirst === "team1" ? teams.team2 : teams.team1;
            const newBowlingTeam =
              battingFirst === "team1" ? teams.team1 : teams.team2;
            const newCurrentBatsman = getNextBatsman(newBattingTeam.players);

            const isPlayerTeamBattingNext =
              newBattingTeam.name !== "Computer Team";

            set({
              gamePhase: "playing",
              currentInnings: 2,
              battingTeam: newBattingTeam,
              bowlingTeam: newBowlingTeam,
              currentBatsman: newCurrentBatsman,
              isPlayerTurn: isPlayerTeamBattingNext,
            });

            if (!isPlayerTeamBattingNext && gameMode === "vs_computer") {
              get().computerTurn();
            }
          }, 3000);
        } else {
          const updatedTeams = {
            ...state.teams!,
            [state.battingFirst === "team1" ? "team2" : "team1"]:
              updatedBattingTeam,
          };

          const matchResult = checkMatchEnd(
            state.battingFirst === "team1"
              ? updatedTeams.team1
              : updatedTeams.team2,
            state.battingFirst === "team1"
              ? updatedTeams.team2
              : updatedTeams.team1
          );

          set({
            gamePhase: "match_end",
            teams: updatedTeams,
            battingTeam: updatedBattingTeam,
            matchResult,
            isPlayerTurn: true,
          });
        }
      } else {
        const nextBatsman = isWicket
          ? getNextBatsman(updatedBattingTeam.players)
          : updatedBatsman;
        const isPlayerTeamBattingNow =
          updatedBattingTeam.name !== "Computer Team";

        set({
          battingTeam: updatedBattingTeam,
          currentBatsman: nextBatsman,
          teams: {
            ...state.teams!,
            [state.battingFirst === "team1"
              ? "team1"
              : "team2"]: updatedBattingTeam,
          },
          isPlayerTurn: isPlayerTeamBattingNow,
        });

        if (
          !isPlayerTeamBattingNow &&
          state.gameMode === "vs_computer" &&
          nextBatsman
        ) {
          setTimeout(() => get().computerTurn(), 1000);
        }
      }
    },

    nextBatsman: () => {
      const { battingTeam } = get();
      if (!battingTeam) return;

      const nextBatsman = getNextBatsman(battingTeam.players);
      set({ currentBatsman: nextBatsman });
    },

    computerTurn: () => {
      const state = get();
      if (
        state.gameMode !== "vs_computer" ||
        state.isPlayerTurn ||
        state.gamePhase !== "playing"
      ) {
        return;
      }

      console.log("Computer's turn...");
      const { pageNumber, lastDigit } = generateComputerAction();

      setTimeout(() => {
        get().processPageResult(pageNumber, lastDigit);
      }, 1500);
    },

    restartMatch: () =>
      set({
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
        stoppedPage: null,
        needsVerification: false,
      }),

    setStoppedPage: (page) => set({ stoppedPage: page }),

    setNeedsVerification: (needs) => set({ needsVerification: needs }),

    confirmPageResult: () => {
      const { stoppedPage } = get();
      if (stoppedPage === null) return;

      const lastDigit = stoppedPage % 10;
      get().processPageResult(stoppedPage, lastDigit);
      set({ needsVerification: false, stoppedPage: null });
    },
  }))
);
