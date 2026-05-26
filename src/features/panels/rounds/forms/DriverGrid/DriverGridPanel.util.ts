import type { LeagueSeasonDriverTable } from "@/types/league.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";

export type DriverGridRow = {
  assignmentId?: string;
  driver: string;
};

export type DriverGridFormValues = {
  assignments: DriverGridRow[];
};

export const toSeasonDriverOption = (driver: LeagueSeasonDriverTable) => ({
  label: driver.display_name ?? "Unknown Driver",
  value: driver.id,
  secondaryInfo: driver.game_type
    ? convertGameTypeToFullName(driver.game_type)
    : undefined,
  avatar: {
    avatarType: driver.avatar_type ?? "preset",
    avatarValue: driver.avatar_value ?? "profile1",
  },
});

