import type {
  LeagueParticipantProfile,
  LeagueSeasonDivisionTable,
  LeagueSeasonDriverTable,
  LeagueSeasonTeamTable,
} from "@/types/league.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";

export type TeamRow = {
  teamId?: string;
  localId: string;
  teamName: string;
};

export const ASSIGNMENT_TABS = [{ label: "Teams" }, { label: "Drivers" }];
export const TEAM_COLUMN_STYLE = { maxWidth: "none", flex: "1 1 0" } as const;

// Turns a participant into a select option.
export const toProfileOption = (participant: LeagueParticipantProfile) => ({
  label: participant.username,
  value: participant.profile_id,
  secondaryInfo: convertGameTypeToFullName(participant.game_type),
  avatar: {
    avatarType: participant.avatar_type,
    avatarValue: participant.avatar_value,
  },
});

// Gets the saved or local team id.
export const getTeamKey = (team: Pick<TeamRow, "teamId" | "localId">) =>
  team.teamId ?? team.localId;


// -- Helper functions to build form values from API data -- //

// Creates a blank local team row.
export const createEmptyTeamRow = (): TeamRow => ({
  localId: `team-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  teamName: "",
});

// Builds the division select options.
export const buildDivisionOptions = (
  divisions: LeagueSeasonDivisionTable[] | undefined,
) =>
  (divisions ?? []).map((division) => ({
    label: division.division_name,
    value: division.id,
  }));

// Keeps only participants with the driver role.
export const buildDriverParticipants = (
  participants: LeagueParticipantProfile[] | undefined,
) =>
  (participants ?? []).filter((participant) =>
    participant.roles.includes("driver")
  );

// Builds a lookup map for driver options by profile id.
export const buildParticipantOptionsByProfileId = (
  participants: LeagueParticipantProfile[] | undefined,
) =>
  new Map(
    (participants ?? []).map((participant) => [
      participant.profile_id,
      toProfileOption(participant),
    ]),
  );

// Builds the full driver option list.
export const buildDriverOptions = (participants: LeagueParticipantProfile[]) =>
  participants.map(toProfileOption);


// Gets the drivers for the active division.
export const buildCurrentDivisionDrivers = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  activeDivisionId: string,
) =>
  (seasonDrivers ?? []).filter(
    (assignment) => assignment.division_id === activeDivisionId,
  );

// Maps saved teams into form rows.
export const buildPersistedTeams = (
  teams: LeagueSeasonTeamTable[] | undefined,
): TeamRow[] =>
  (teams ?? []).map((team) => ({
    teamId: team.id,
    localId: team.id,
    teamName: team.team_name,
  }));

// Maps saved team assignments into form rows.
export const buildPersistedAssignments = (
  drivers: LeagueSeasonDriverTable[],
) =>
  drivers
    .filter((assignment) => !!assignment.team_id)
    .map((assignment) => ({
      driver: assignment.profile_id,
      teamKey: assignment.team_id ?? "",
    }));

// Gets drivers already used in other divisions.
export const buildDriversAssignedToOtherDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  activeDivisionId: string,
) =>
  new Set(
    (seasonDrivers ?? [])
      .filter((assignment) => assignment.division_id !== activeDivisionId)
      .map((assignment) => assignment.profile_id),
  );

// Builds the team select options from named teams.
export const buildTeamOptions = (teams: TeamRow[]) =>
  teams
    .filter((team) => team.teamName.trim())
    .map((team) => ({
      value: getTeamKey(team),
      label: team.teamName.trim(),
    }));
