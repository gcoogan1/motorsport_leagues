import type {
  LeagueSeasonDivisionTable,
  LeagueSeasonDriverTable,
  LeagueSeasonTeamTable,
} from "@/types/league.types";
import type { TeamRow } from "../../../TeamAssignments/util/TeamAssignments.util";

// Convenience helper — avoids repeating `?? []` at every call site.
const coerceArray = <T>(data: T[] | undefined): T[] => data ?? [];

// Trims a team name for consistent map keys across both pre-qual and linked divisions.
export const normalizeTeamName = (teamName?: string) => teamName?.trim() ?? "";

export type ReadOnlyDivisionDriver = {
  id: string;
  username: string;
  avatarType: "preset" | "upload";
  avatarValue: string;
  teamName: string;
  addedToTeam: string;
};

// Creates a new unsaved team row with a unique local draft id.
export const createEmptyTeamRow = (): TeamRow => ({
  localId: `team-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  teamName: "",
});

// Finds the division with division_number === 0 — the source of truth for team creation.
export const getPreQualDivisionId = (
  includesPreQual: boolean | undefined,
  divisions: LeagueSeasonDivisionTable[] | undefined,
) => {
  if (!includesPreQual) return "";
  return divisions?.find((d) => d.division_number === 0)?.id ?? "";
};

// Filters season-wide teams down to those belonging to the pre-qual division.
export const buildPreQualTeams = (
  seasonTeams: LeagueSeasonTeamTable[] | undefined,
  preQualDivisionId: string,
) => coerceArray(seasonTeams).filter((t) => t.division_id === preQualDivisionId);

// Builds a name → team record lookup; linked-division save logic uses names as stable keys
// because linked divisions reference pre-qual teams by name, not by id.
export const buildPreQualTeamByName = (preQualTeams: LeagueSeasonTeamTable[]) =>
  new Map(preQualTeams.map((t) => [normalizeTeamName(t.team_name), t]));

// Filters season-wide drivers down to those assigned to the pre-qual division.
export const buildPreQualDrivers = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  preQualDivisionId: string,
) => coerceArray(seasonDrivers).filter((d) => d.division_id === preQualDivisionId);

// Groups pre-qual drivers by team id so linked divisions can inherit their roster in one pass.
export const buildPreQualDriversByTeamId = (preQualDrivers: LeagueSeasonDriverTable[]) => {
  const map = new Map<string, LeagueSeasonDriverTable[]>();
  preQualDrivers.forEach((driver) => {
    if (!driver.team_id) return;
    const existing = map.get(driver.team_id) ?? [];
    map.set(driver.team_id, [...existing, driver]);
  });
  return map;
};

// Profile id → driver record; used during linked-division saves to copy pre-qual metadata.
export const buildPreQualDriverDetailsByProfileId = (
  preQualDrivers: LeagueSeasonDriverTable[],
) => new Map(preQualDrivers.map((d) => [d.profile_id, d]));

// Builds the set of team names already claimed by other linked divisions.
// Pre-qual itself is excluded — its teams are always the source set, never blocked.
// A given pre-qual team may only be assigned to one linked division at a time.
export const buildTeamNamesAssignedToOtherDivisions = (
  seasonTeams: LeagueSeasonTeamTable[] | undefined,
  activeDivisionId: string,
  preQualDivisionId: string,
) =>
  new Set(
    coerceArray(seasonTeams)
      .filter(
        (t) =>
          preQualDivisionId &&
          t.division_id !== preQualDivisionId &&
          t.division_id !== activeDivisionId,
      )
      .map((t) => normalizeTeamName(t.team_name)),
  );

// Builds the set of profile ids already used in divisions other than the active one.
// When managing pre-qual (division 0) directly, other pre-qual rows in the same division
// still block reuse within the same form, handled separately by the driver select per-row logic.
export const buildDriversAssignedToOtherDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  activeDivisionId: string,
  preQualDivisionId: string,
) =>
  new Set(
    coerceArray(seasonDrivers)
      .filter((d) => {
        if (d.division_id === activeDivisionId) return false;
        if (!preQualDivisionId) return true;
        if (activeDivisionId === preQualDivisionId) return false;
        return d.division_id !== preQualDivisionId;
      })
      .map((d) => d.profile_id),
  );

// Builds the read-only driver list for the pre-qual division's Drivers tab.
// Sorted by assignment time so the list matches the order drivers were added.
export const buildReadOnlyDivisionDrivers = (
  currentDivisionDrivers: LeagueSeasonDriverTable[],
  currentDivisionTeamsById: Map<string, LeagueSeasonTeamTable>,
): ReadOnlyDivisionDriver[] =>
  currentDivisionDrivers
    .filter((d) => d.team_id && currentDivisionTeamsById.has(d.team_id))
    .map((d) => ({
      id: d.id,
      username: d.display_name ?? "Unknown Driver",
      avatarType: d.avatar_type ?? "preset",
      avatarValue: d.avatar_value ?? "profile1",
      teamName: currentDivisionTeamsById.get(d.team_id as string)?.team_name ?? "",
      addedToTeam: d.added_to_team ?? d.created_at,
    }))
    .sort((a, b) => {
      const timeDiff = new Date(a.addedToTeam).getTime() - new Date(b.addedToTeam).getTime();
      if (timeDiff !== 0) return timeDiff;
      const teamDiff = a.teamName.localeCompare(b.teamName);
      if (teamDiff !== 0) return teamDiff;
      return a.username.localeCompare(b.username);
    });

// Builds the read-only driver list for a linked division by resolving drivers from the
// pre-qual teams the user has selected. Drivers are always inherited — never edited here.
export const buildLinkedDivisionReadOnlyDrivers = (
  watchedTeams: Array<{ teamName?: string } | undefined> | undefined,
  preQualTeamByName: Map<string, LeagueSeasonTeamTable>,
  preQualDriversByTeamId: Map<string, LeagueSeasonDriverTable[]>,
): ReadOnlyDivisionDriver[] => {
  const drivers: ReadOnlyDivisionDriver[] = [];

  coerceArray(watchedTeams as Array<{ teamName?: string } | undefined>).forEach((team) => {
    const name = normalizeTeamName(team?.teamName);
    if (!name) return;
    const preQualTeam = preQualTeamByName.get(name);
    if (!preQualTeam) return;
    (preQualDriversByTeamId.get(preQualTeam.id) ?? []).forEach((driver) => {
      drivers.push({
        id: `${preQualTeam.id}:${driver.profile_id}`,
        username: driver.display_name ?? "Unknown Driver",
        avatarType: driver.avatar_type ?? "preset",
        avatarValue: driver.avatar_value ?? "profile1",
        teamName: preQualTeam.team_name,
        addedToTeam: driver.added_to_team ?? driver.created_at,
      });
    });
  });

  return drivers.sort((a, b) => {
    const timeDiff = new Date(a.addedToTeam).getTime() - new Date(b.addedToTeam).getTime();
    if (timeDiff !== 0) return timeDiff;
    const teamDiff = a.teamName.localeCompare(b.teamName);
    if (teamDiff !== 0) return teamDiff;
    return a.username.localeCompare(b.username);
  });
};

// Driver assignment rows need team options derived from the watched team rows so
// newly typed names appear in the select before the form is saved.
export const buildSelectedTeamOptions = (
  teams: Array<{ teamId?: string; localId: string; teamName?: string } | undefined> | undefined,
) =>
  coerceArray(teams as Array<{ teamId?: string; localId: string; teamName?: string } | undefined>)
    .filter((t) => t?.teamName?.trim() ?? "")
    .map((t) => ({
      value: t?.teamId ?? t?.localId ?? "",
      label: t?.teamName?.trim() ?? "",
    }));

// Returns available pre-qual team options for one row in a linked division.
// Preserves the current row's selection while excluding teams already taken by other rows
// or claimed by other linked divisions.
export const buildPreQualTeamOptionsForRow = (
  watchedTeamNames: string[],
  rowIndex: number,
  preQualTeams: LeagueSeasonTeamTable[],
  teamNamesAssignedToOtherDivisions: Set<string>,
) => {
  const selectedNames = new Set(
    watchedTeamNames
      .map((name, i) => (i === rowIndex ? "" : normalizeTeamName(name)))
      .filter(Boolean),
  );
  const currentValue = normalizeTeamName(watchedTeamNames[rowIndex]);

  const filtered = preQualTeams
    .filter((t) => {
      const name = normalizeTeamName(t.team_name);
      return (
        name === currentValue ||
        (!selectedNames.has(name) && !teamNamesAssignedToOtherDivisions.has(name))
      );
    })
    .map((t) => ({ value: t.team_name, label: t.team_name }));

  if (currentValue && !filtered.some((o) => o.value === currentValue)) {
    return [{ value: currentValue, label: currentValue }, ...filtered];
  }

  return filtered;
};

// Returns the next pre-qual team not yet claimed by any row or other linked division,
// or undefined when no options remain (the caller should show a NoTeams modal).
export const findNextAvailablePreQualTeam = (
  watchedTeamNames: string[],
  preQualTeams: LeagueSeasonTeamTable[],
  teamNamesAssignedToOtherDivisions: Set<string>,
) => {
  const selected = new Set(watchedTeamNames.map(normalizeTeamName).filter(Boolean));
  return preQualTeams.find((t) => {
    const name = normalizeTeamName(t.team_name);
    return !selected.has(name) && !teamNamesAssignedToOtherDivisions.has(name);
  });
};

// Resolves the active division's drivers by matching season-wide driver records to the
// teams that have been assigned into that division. This works for both pre-qual and linked
// divisions because team membership (team_id) is the authoritative link.
export const buildCurrentDivisionDrivers = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  divisionTeams: LeagueSeasonTeamTable[] | undefined,
) => {
  const teamIds = new Set(coerceArray(divisionTeams).map((t) => t.id));
  return coerceArray(seasonDrivers).filter((d) => d.team_id && teamIds.has(d.team_id));
};
