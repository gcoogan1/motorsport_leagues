import type {
	LeagueParticipantProfile,
	LeagueSeasonDivisionTable,
	LeagueSeasonDriverTable,
} from "@/types/league.types";

export type DriverAssignmentRow = {
	assignmentId?: string;
	driver: string;
};

export const DRIVER_TABLE_STYLE = {
	width: "min(100%, 360px)",
	marginInline: "auto",
} as const;

// -- Helper functions to build form values from API data -- //

// Turns a participant into a select option.
export const toProfileOption = (participant: LeagueParticipantProfile) => ({
	label: participant.username,
	value: participant.profile_id,
	secondaryInfo: participant.game_type,
	avatar: {
		avatarType: participant.avatar_type,
		avatarValue: participant.avatar_value,
	},
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
	(participants ?? []).filter((participant) => participant.roles.includes("driver"));

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

// Maps saved assignments into form rows.
export const buildPersistedAssignments = (
	seasonDrivers: LeagueSeasonDriverTable[] | undefined,
	selectedDivisionId: string,
): DriverAssignmentRow[] =>
	(seasonDrivers ?? [])
		.filter((assignment) => assignment.division_id === selectedDivisionId)
		.map((assignment) => ({
			assignmentId: assignment.id,
			driver: assignment.profile_id,
		}));

// Builds a lookup map for saved assignment ids.
export const buildPersistedAssignmentMap = (
	assignments: DriverAssignmentRow[],
) =>
	new Map(
		assignments
			.filter((assignment) => assignment.assignmentId)
			.map((assignment) => [assignment.assignmentId as string, assignment.driver]),
	);

// Gets drivers already used in other divisions.
export const buildDriversAssignedToOtherDivisions = (
	seasonDrivers: LeagueSeasonDriverTable[] | undefined,
	selectedDivisionId: string,
) =>
	new Set(
		(seasonDrivers ?? [])
			.filter((assignment) => assignment.division_id !== selectedDivisionId)
			.map((assignment) => assignment.profile_id),
	);
