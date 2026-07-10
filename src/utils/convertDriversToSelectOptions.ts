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

type LeagueSeasonTeam = {
  id: string;
  team_name: string;
};

export const convertDriversToSelectOptions = (
  drivers: LeagueSeasonDriverTable[] | null | undefined,
  seasonTeams?: LeagueSeasonTeam[] | null,
): ProfileSelectOption[] => {
  const teamMap = new Map(
    (seasonTeams ?? []).map((team) => [team.id, team.team_name])
  );

  return (drivers ?? []).map((driver) => ({
    label: driver.display_name ?? "",
    value: driver.id,
    secondaryInfo: driver.team_id ? teamMap.get(driver.team_id) : undefined,
    avatar: {
      avatarType: driver.avatar_type as "preset" | "upload",
      avatarValue: driver.avatar_value ?? "",
    },
  }));
};