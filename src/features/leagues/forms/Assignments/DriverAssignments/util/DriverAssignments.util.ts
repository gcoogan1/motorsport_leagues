import type {
	LeagueParticipantProfile,
	LeagueSeasonDivisionTable,
	LeagueSeasonDriverTable,
} from "@/types/league.types";
import { convertGameTypeToFullName } from "@/utils/convertGameTypes";

// One form row: an optional server id (absent for unsaved rows) plus the profile id.
export type DriverAssignmentRow = {
	assignmentId?: string;
	driver: string;
};

// Caps the table at a readable width on wide screens while staying full-width on mobile.
export const DRIVER_TABLE_STYLE = {
	width: "min(100%, 360px)",
	marginInline: "auto",
} as const;

// Treats undefined query data the same as an empty array so callers never have to check for undefined.
const coerceArray = <T>(data: T[] | undefined): T[] => data ?? [];

// -- Participant helpers -- //

// Shapes a participant into the option format expected by ProfileSelectInput.
export const toProfileOption = (p: LeagueParticipantProfile) => ({
	label: p.username,
	value: p.profile_id,
	secondaryInfo: convertGameTypeToFullName(p.game_type),
	avatar: {
		avatarType: p.avatar_type,
		avatarValue: p.avatar_value,
	},
});

// Filters the full participant list down to those with the "driver" role.
export const buildDriverParticipants = (
	participants: LeagueParticipantProfile[] | undefined,
) => coerceArray(participants).filter((p) => p.roles.includes("driver"));


// Converts driver participants to the flat option list used in select inputs.
export const buildDriverOptions = (
	participants: LeagueParticipantProfile[] | undefined,
) => coerceArray(participants).map(toProfileOption);

// Indexes driver options by profile id so they can be quickly looked up and preserved in a row's option list.
export const buildParticipantOptionsByProfileId = (
	participants: LeagueParticipantProfile[] | undefined,
) =>
	new Map(
		coerceArray(participants).map((p) => [p.profile_id, toProfileOption(p)]),
	);

// -- Division helpers -- //

// Converts division records to the label/value pairs used by FilterBar.
export const buildDivisionOptions = (
	divisions: LeagueSeasonDivisionTable[] | undefined,
) =>
	coerceArray(divisions).map((d) => ({
		label: d.division_name,
		value: d.id,
	}));

// -- Assignment helpers -- //

// Returns the saved driver rows for the active division, shaped as form rows.
// Only drivers whose division_id matches are included — other divisions are ignored here.
export const buildPersistedAssignments = (
	seasonDrivers: LeagueSeasonDriverTable[] | undefined,
	selectedDivisionId: string,
): DriverAssignmentRow[] =>
	coerceArray(seasonDrivers)
		.filter((d) => d.division_id === selectedDivisionId)
		.map((d) => ({
			assignmentId: d.id,
			driver: d.profile_id,
		}));

// Maps assignmentId → profileId so the save handler can detect which rows changed.
// Rows without an assignmentId are new and not included.
export const buildPersistedAssignmentMap = (
	assignments: DriverAssignmentRow[],
) =>
	new Map(
		assignments
			.filter((a): a is DriverAssignmentRow & { assignmentId: string } =>
				Boolean(a.assignmentId),
			)
			.map((a) => [a.assignmentId, a.driver]),
	);

// Returns the set of profile ids already assigned to any division other than
// the active one. Used to block reusing a driver across divisions.
export const buildDriversAssignedToOtherDivisions = (
	seasonDrivers: LeagueSeasonDriverTable[] | undefined,
	selectedDivisionId: string,
) =>
	new Set(
		coerceArray(seasonDrivers)
			.filter((d) => d.division_id !== selectedDivisionId)
			.map((d) => d.profile_id),
	);