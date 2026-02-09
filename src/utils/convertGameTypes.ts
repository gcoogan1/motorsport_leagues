import { GAME_FULL_NAMES, type GameFullName, type GameType } from "@/types/profile.types";

export const convertGameTypeToFullName = (gameType: GameType): GameFullName => {
  const gameFullName = GAME_FULL_NAMES[gameType];

  if (!gameFullName) {
    throw new Error(`Invalid game type: ${gameType}`);
  }

  return gameFullName;
}