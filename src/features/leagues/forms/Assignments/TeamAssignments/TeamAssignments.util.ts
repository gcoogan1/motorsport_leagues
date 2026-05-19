import type {
  LeagueParticipantProfile,
  LeagueSeasonDivisionTable,
  LeagueSeasonDriverTable,
  LeagueSeasonTeamTable,
} from "@/types/league.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";

// Treats undefined query data the same as an empty array so builders are safe to call before data loads.
const coerceArray = <T>(data: T[] | undefined): T[] => data ?? [];

// One team row: teamId is absent for rows not yet persisted to the server.
export type TeamRow = {
  teamId?: string;
  localId: string;
  teamName: string;
};

// Tab definitions for the Teams / Drivers segmented tab control.
export const ASSIGNMENT_TABS = [{ label: "Teams" }, { label: "Drivers" }];

// Makes the team name column stretch to fill available space in the table.
export const TEAM_COLUMN_STYLE = { maxWidth: "none", flex: "1 1 0" } as const;

// Returns the server id when the team has been saved, or the local draft id otherwise.
export const getTeamKey = (team: Pick<TeamRow, "teamId" | "localId">) =>
  team.teamId ?? team.localId;

// Shapes a participant record into the option format expected by ProfileSelectInput.
export const toProfileOption = (participant: LeagueParticipantProfile) => ({
  label: participant.username,
  value: participant.profile_id,
  secondaryInfo: convertGameTypeToFullName(participant.game_type),
  avatar: {
    avatarType: participant.avatar_type,
    avatarValue: participant.avatar_value,
  },
});

// Creates a new unsaved team row with a unique local draft id.
export const createEmptyTeamRow = (): TeamRow => ({
  localId: `team-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  teamName: "",
});

// Converts division records to the label/value pairs used by FilterBar.
export const buildDivisionOptions = (
  divisions: LeagueSeasonDivisionTable[] | undefined,
) =>
  coerceArray(divisions).map((d) => ({
    label: d.division_name,
    value: d.id,
  }));

// Filters the full participant list to those with the "driver" role.
export const buildDriverParticipants = (
  participants: LeagueParticipantProfile[] | undefined,
) => coerceArray(participants).filter((p) => p.roles.includes("driver"));

// Converts driver participants to the flat option list used in select inputs.
export const buildDriverOptions = (participants: LeagueParticipantProfile[]) =>
  participants.map(toProfileOption);

// Indexes driver options by profile id for O(1) lookup of a row's current value.
export const buildParticipantOptionsByProfileId = (
  participants: LeagueParticipantProfile[] | undefined,
) =>
  new Map(
    coerceArray(participants).map((p) => [p.profile_id, toProfileOption(p)]),
  );

// Narrows season drivers to those belonging to the active division.
export const buildCurrentDivisionDrivers = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  activeDivisionId: string,
) =>
  coerceArray(seasonDrivers).filter((d) => d.division_id === activeDivisionId);

// Maps saved teams into form rows for the active division.
export const buildPersistedTeams = (
  teams: LeagueSeasonTeamTable[] | undefined,
): TeamRow[] =>
  coerceArray(teams).map((team) => ({
    teamId: team.id,
    localId: team.id,
    teamName: team.team_name,
  }));

// Converts persisted driver-team links into form rows.
// Only drivers already assigned to a team are included — unassigned drivers are omitted.
export const buildPersistedAssignments = (drivers: LeagueSeasonDriverTable[]) =>
  drivers
    .filter((d) => !!d.team_id)
    .map((d) => ({
      driver: d.profile_id,
      teamKey: d.team_id ?? "",
    }));

// Returns the set of profile ids assigned to any division other than the active one.
// Used to block a driver from appearing in multiple division selects at once.
export const buildDriversAssignedToOtherDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  activeDivisionId: string,
) =>
  new Set(
    coerceArray(seasonDrivers)
      .filter((d) => d.division_id !== activeDivisionId)
      .map((d) => d.profile_id),
  );

// Builds the team select options from named form rows.
// Rows with an empty teamName are excluded because they are still being typed.
export const buildTeamOptions = (teams: Array<TeamRow | undefined> | undefined) =>
  coerceArray(teams)
    .filter((team): team is TeamRow => !!(team?.teamName?.trim()))
    .map((team) => ({
      value: getTeamKey(team),
      label: team.teamName.trim(),
    }));

