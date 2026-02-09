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
  isDisabled?: boolean;
};

export const gameOptions: Option[] = [
  { label: "Gran Turismo 7", value: "gt7", helperMessage: "Playstation 5", icon: <Game_GT7 /> },
  { label: "iRacing", value: "iRacing", helperMessage: "Coming Soon", icon: <Game_iRacing />, isDisabled: true },
  { label: "Assetto Corsa EVO", value: "assetoCorsaEvo", helperMessage: "Coming Soon", icon: <Game_ACEvo />, isDisabled: true },
  { label: "Le Mans Ultimate", value: "leMansUltimate", helperMessage: "Coming Soon", icon: <Game_LMU />, isDisabled: true },
];
