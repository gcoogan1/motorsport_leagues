import type {
  LeagueSeasonDivisionTable,
  LeagueSeasonDriverTable,
  LeagueSeasonTeamTable,
} from "@/types/league.types";

const normalizeTeamName = (teamName?: string) => teamName?.trim() ?? "";

export type ReadOnlyDivisionDriver = {
  id: string;
  username: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
  teamName: string;
  addedToTeam: string;
};

export const getPreQualDivisionId = (
  includesPreQual: boolean | undefined,
  divisions: LeagueSeasonDivisionTable[] | undefined,
) => {
  if (!includesPreQual) {
    return "";
  }

  return divisions?.find((division) => division.division_number === 0)?.id ?? "";
};

export const usesPreQualTeamAssignments = (
  isTeamChampionship: boolean,
  activeDivisionId: string,
  preQualDivisionId: string,
) =>
  isTeamChampionship &&
  !!preQualDivisionId &&
  activeDivisionId !== "" &&
  activeDivisionId !== preQualDivisionId;

export const buildPreQualTeams = (
  seasonTeams: LeagueSeasonTeamTable[] | undefined,
  preQualDivisionId: string,
) =>
  (seasonTeams ?? []).filter((team) => team.division_id === preQualDivisionId);

export const buildPreQualTeamByName = (preQualTeams: LeagueSeasonTeamTable[]) =>
  // Name lookups keep linked-division save logic simple and stable.
  new Map(preQualTeams.map((team) => [normalizeTeamName(team.team_name), team]));

export const buildPreQualDrivers = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  preQualDivisionId: string,
) =>
  (seasonDrivers ?? []).filter((driver) => driver.division_id === preQualDivisionId);

export const buildPreQualDriversByTeamId = (
  preQualDrivers: LeagueSeasonDriverTable[],
) => {
  // Group pre-qual drivers by team so linked divisions can inherit them in one pass.
  const driversByTeamId = new Map<string, LeagueSeasonDriverTable[]>();

  preQualDrivers.forEach((driver) => {
    if (!driver.team_id) {
      return;
    }

    const currentDrivers = driversByTeamId.get(driver.team_id) ?? [];
    driversByTeamId.set(driver.team_id, [...currentDrivers, driver]);
  });

  return driversByTeamId;
};

export const buildPreQualDriverDetailsByProfileId = (
  preQualDrivers: LeagueSeasonDriverTable[],
) => new Map(preQualDrivers.map((driver) => [driver.profile_id, driver]));

export const buildTeamNamesAssignedToOtherDivisions = (
  seasonTeams: LeagueSeasonTeamTable[] | undefined,
  activeDivisionId: string,
  preQualDivisionId: string,
) =>
  // Only linked divisions block reuse; pre-qual itself stays available as the source set.
  new Set(
    (seasonTeams ?? [])
      .filter((team) => {
        if (!preQualDivisionId) {
          return false;
        }

        if (team.division_id === preQualDivisionId) {
          return false;
        }

        return team.division_id !== activeDivisionId;
      })
      .map((team) => normalizeTeamName(team.team_name)),
  );

export const buildDriversAssignedToOtherDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  activeDivisionId: string,
  preQualDivisionId: string,
) =>
  // Linked divisions cannot reuse drivers already assigned to another linked division.
  new Set(
    (seasonDrivers ?? [])
      .filter((assignment) => {
        if (assignment.division_id === activeDivisionId) {
          return false;
        }

        if (!preQualDivisionId) {
          return true;
        }

        if (activeDivisionId === preQualDivisionId) {
          return false;
        }

        return assignment.division_id !== preQualDivisionId;
      })
      .map((assignment) => assignment.profile_id),
  );

export const buildReadOnlyDivisionDrivers = (
  currentDivisionDrivers: LeagueSeasonDriverTable[],
  currentDivisionTeamsById: Map<string, LeagueSeasonTeamTable>,
): ReadOnlyDivisionDriver[] =>
  // Sort by team assignment time first so the read-only list matches assignment order.
  currentDivisionDrivers
    .filter((driver) => driver.team_id && currentDivisionTeamsById.has(driver.team_id))
    .map((driver) => ({
      id: driver.id,
      username: driver.display_name ?? "Unknown Driver",
      avatarType: driver.avatar_type ?? "preset",
      avatarValue: driver.avatar_value ?? "profile1",
      teamName: currentDivisionTeamsById.get(driver.team_id as string)?.team_name ?? "",
      addedToTeam: driver.added_to_team ?? driver.created_at,
    }))
    .sort((left, right) => {
      const addedDiff =
        new Date(left.addedToTeam).getTime() - new Date(right.addedToTeam).getTime();

      if (addedDiff !== 0) {
        return addedDiff;
      }

      const teamDiff = left.teamName.localeCompare(right.teamName);

      if (teamDiff !== 0) {
        return teamDiff;
      }

      return left.username.localeCompare(right.username);
    });

export const buildSelectedTeamOptions = (
  teams:
    | Array<{ teamId?: string; localId: string; teamName?: string } | undefined>
    | undefined,
) =>
  // Driver rows only need teams that already have a visible name.
  (teams ?? [])
    .filter((team) => (team?.teamName?.trim() ?? ""))
    .map((team) => ({
      value: team?.teamId ?? team?.localId ?? "",
      label: team?.teamName?.trim() ?? "",
    }));

export const buildPreQualTeamOptionsForRow = (
  watchedTeamNames: string[],
  rowIndex: number,
  preQualTeams: LeagueSeasonTeamTable[],
  teamNamesAssignedToOtherDivisions: Set<string>,
) => {
  // Preserve the current row's choice while filtering out teams already taken elsewhere.
  const selectedTeamNames = new Set(
    watchedTeamNames
      .map((teamName, index) => (index === rowIndex ? "" : normalizeTeamName(teamName)))
      .filter(Boolean),
  );
  const currentValue = normalizeTeamName(watchedTeamNames[rowIndex]);

  const filteredOptions = preQualTeams
    .filter((team) => {
      const teamName = normalizeTeamName(team.team_name);

      return (
        teamName === currentValue ||
        (!selectedTeamNames.has(teamName) &&
          !teamNamesAssignedToOtherDivisions.has(teamName))
      );
    })
    .map((team) => ({
      value: team.team_name,
      label: team.team_name,
    }));

  if (
    currentValue &&
    !filteredOptions.some((option) => option.value === currentValue)
  ) {
    return [{ value: currentValue, label: currentValue }, ...filteredOptions];
  }

  return filteredOptions;
};

export const findNextAvailablePreQualTeam = (
  watchedTeamNames: string[],
  preQualTeams: LeagueSeasonTeamTable[],
  teamNamesAssignedToOtherDivisions: Set<string>,
) => {
  // Auto-fill the next unused pre-qual team when a division adds a row.
  const selectedTeamNames = new Set(
    watchedTeamNames.map((teamName) => normalizeTeamName(teamName)).filter(Boolean),
  );

  return preQualTeams.find((team) => {
    const teamName = normalizeTeamName(team.team_name);

    return (
      !selectedTeamNames.has(teamName) &&
      !teamNamesAssignedToOtherDivisions.has(teamName)
    );
  });
};
