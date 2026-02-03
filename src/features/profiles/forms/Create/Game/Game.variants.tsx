import type { GameType } from "@/types/profile.types";

import Game_GT7 from "@assets/Graphics/Game_GT7.svg?react"
import Game_iRacing from "@assets/Graphics/Game_iRacing.svg?react"
import Game_ACEvo from "@assets/Graphics/Game_ACEvo.svg?react"
import Game_LMU from "@assets/Graphics/Game_LMU.svg?react"

type Option = {
  label: string;
  value: GameType;
  helperMessage: string;
  icon: React.ReactNode;
};

export const gameOptions: Option[] = [
  { label: "Gran Turismo 7", value: "gt7", helperMessage: "Playstation 5.", icon: <Game_GT7 /> },
  { label: "iRacing", value: "iRacing", helperMessage: "Online racing simulation.", icon: <Game_iRacing /> },
  { label: "Assetto Corsa Evo", value: "assetoCorsaEvo", helperMessage: "Realistic racing simulator.", icon: <Game_ACEvo /> },
  { label: "Le Mans Ultimate", value: "leMansUltimate", helperMessage: "Endurance racing experience.", icon: <Game_LMU /> },
];
