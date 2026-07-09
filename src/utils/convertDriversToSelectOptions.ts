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
  drivers: (LeagueSeasonDriverTable & { team_name?: string })[] | null | undefined,
): ProfileSelectOption[] =>
  (drivers ?? []).map((driver) => ({
    label: driver.display_name ?? "",
    value: driver.id,
    secondaryInfo: driver.team_name || undefined,
    avatar: {
      avatarType: driver.avatar_type as "preset" | "upload",
      avatarValue: driver.avatar_value ?? "",
    },
  }));