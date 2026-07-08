import type { LeagueSeasonDriverTable } from "@/types/league.types";

export type DriverGridRow = {
  assignmentId?: string;
  driver: string;
};

export type DriverGridFormValues = {
  assignments: DriverGridRow[];
};

export const toSeasonDriverOption = (driver: LeagueSeasonDriverTable & { team_name?: string }) => ({
  label: driver.display_name ?? "Unknown Driver",
  value: driver.id,
  secondaryInfo: driver.team_name || undefined,
  avatar: {
    avatarType: driver.avatar_type ?? "preset",
    avatarValue: driver.avatar_value ?? "profile1",
  },
});

