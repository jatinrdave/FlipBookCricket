export interface ScoreResult {
  runs: number;
  isWicket: boolean;
}

/**
 * Calculate score based on the last digit of the page number
 * Rules:
 * - Last digit 0: Player is out (wicket)
 * - Last digit 1-7: Add to score
 * - Last digit 8-9: No score (but not out)
 */
export function calculateScore(lastDigit: number): ScoreResult {
  console.log(`Calculating score for last digit: ${lastDigit}`);
  
  if (lastDigit === 0) {
    return { runs: 0, isWicket: true };
  } else if (lastDigit >= 1 && lastDigit <= 7) {
    return { runs: lastDigit, isWicket: false };
  } else {
    // Last digit 8 or 9 - no score, no wicket
    return { runs: 0, isWicket: false };
  }
}

/**
 * Check if the current innings should end
 */
export function checkInningsEnd(
  wickets: number,
  ballsFaced: number,
  totalBalls: number,
  target?: number | null,
  currentRuns?: number
): boolean {
  // Innings ends if:
  // 1. All wickets are down (4 wickets in this game)
  // 2. All overs are completed
  // 3. Target is achieved (in 2nd innings)
  
  if (wickets >= 4) {
    console.log("Innings ended: All wickets down");
    return true;
  }
  
  if (ballsFaced >= totalBalls) {
    console.log("Innings ended: All overs completed");
    return true;
  }
  
  if (target && currentRuns && currentRuns >= target) {
    console.log("Innings ended: Target achieved");
    return true;
  }
  
  return false;
}

/**
 * Check match result at the end of the match
 */
export function checkMatchEnd(firstInnings: any, secondInnings: any) {
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

/**
 * Get the next batsman from the team
 */
export function getNextBatsman(players: any[]) {
  return players.find(player => !player.isOut) || null;
}

/**
 * Calculate current run rate
 */
export function calculateRunRate(runs: number, balls: number): number {
  if (balls === 0) return 0;
  return (runs / balls) * 6; // Convert to runs per over
}

/**
 * Calculate required run rate (for chasing team)
 */
export function calculateRequiredRunRate(
  runsNeeded: number, 
  ballsRemaining: number
): number {
  if (ballsRemaining === 0) return 0;
  return (runsNeeded / ballsRemaining) * 6; // Convert to runs per over
}

/**
 * Format overs display (e.g., 3.4 for 3 overs and 4 balls)
 */
export function formatOvers(balls: number): string {
  const overs = Math.floor(balls / 6);
  const remainingBalls = balls % 6;
  return `${overs}.${remainingBalls}`;
}

/**
 * Check if it's a valid page number for scoring (even numbers only)
 */
export function isValidScoringPage(pageNumber: number): boolean {
  return pageNumber % 2 === 0;
}

/**
 * Generate computer player action (for vs computer mode)
 */
export function generateComputerAction(): { pageNumber: number; lastDigit: number } {
  // Generate a random even page number between 2 and 998
  const randomPage = Math.floor(Math.random() * 499) * 2 + 2;
  const lastDigit = randomPage % 10;
  
  return {
    pageNumber: randomPage,
    lastDigit
  };
}
