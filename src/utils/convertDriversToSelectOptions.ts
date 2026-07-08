import { GAME_FULL_NAMES } from "@/types/profile.types";
import type { LeagueSeasonDriverTable } from "@/types/league.types";

export type ProfileSelectOption = {
  label: string;
  value: string;
  secondaryInfo?: string;
  avatar: {
    avatarType: "preset" | "upload";
    avatarValue: string;
  };
};

export const convertDriversToSelectOptions = (
  drivers: LeagueSeasonDriverTable[] | null | undefined,
): ProfileSelectOption[] =>
  (drivers ?? []).map((driver) => ({
    label: driver.display_name ?? "",
    value: driver.id,
    secondaryInfo: driver.game_type
      ? GAME_FULL_NAMES[driver.game_type]
      : undefined,
    avatar: {
      avatarType: driver.avatar_type as "preset" | "upload",
      avatarValue: driver.avatar_value ?? "",
    },
  }));