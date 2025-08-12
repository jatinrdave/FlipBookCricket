import { useCricket } from "../../lib/stores/useCricket.tsx";
import { Stadium } from "./Stadium.tsx";
import { PageFlipBook } from "./PageFlipBook.tsx";

export function CricketGame() {
  const { gamePhase } = useCricket();

  return (
    <>
      {/* 3D Stadium Environment */}
      <Stadium />
      
      {/* Page Flipping Book - Always present but controlled by game phase */}
      {(gamePhase === 'playing' || gamePhase === 'innings_break' || gamePhase === 'match_end') && (
        <PageFlipBook />
      )}
    </>
  );
}
