import type {
  LeagueSeasonDivisionTable,
  LeagueSeasonDriverTable,
} from "@/types/league.types";

// Treats undefined query data the same as an empty array so builders are safe to call before data loads.
const coerceArray = <T>(data: T[] | undefined): T[] => data ?? [];

// Returns the id of division 0 — the pre-qual source pool.
// Returns an empty string when the season does not use pre-qual.
export const getPreQualDivisionId = (
  includesPreQual: boolean | undefined,
  divisions: LeagueSeasonDivisionTable[] | undefined,
) => {
  if (!includesPreQual) return "";
  return divisions?.find((d) => d.division_number === 0)?.id ?? "";
};

// A division is "restricted" when it is not the pre-qual source pool and pre-qual is active.
// Restricted divisions may only draw from the pre-qual pool and cannot share drivers with each other.
export const isPreQualRestrictedDivision = (
  selectedDivisionId: string,
  preQualDivisionId: string,
) =>
  !!preQualDivisionId &&
  selectedDivisionId !== "" &&
  selectedDivisionId !== preQualDivisionId;

// Returns the set of profile ids in the pre-qual source pool (division 0).
// Used to gate driver selection in restricted divisions.
export const buildPreQualAssignedDriverIds = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  preQualDivisionId: string,
) =>
  new Set(
    coerceArray(seasonDrivers)
      .filter((d) => d.division_id === preQualDivisionId)
      .map((d) => d.profile_id),
  );

// Returns the set of profile ids that should be blocked from selection in the active division.
//
// Rules:
//   - Pre-qual division: no restrictions (drivers can appear in any division).
//   - Restricted divisions: block drivers already placed in any other restricted division.
//     Pre-qual drivers are allowed even if they appear elsewhere.
export const buildDriversAssignedToOtherDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  selectedDivisionId: string,
  preQualDivisionId: string,
) =>
  new Set(
    coerceArray(seasonDrivers)
      .filter((d) => {
        // Never block a driver from their own division.
        if (d.division_id === selectedDivisionId) return false;
        // Pre-qual division has no exclusions — it is the shared pool.
        if (!preQualDivisionId) return true;
        if (selectedDivisionId === preQualDivisionId) return false;
        // For restricted divisions, only block other restricted divisions.
        return d.division_id !== preQualDivisionId;
      })
      .map((d) => d.profile_id),
  );

// Returns the set of profile ids referenced by any restricted (non-prequal) division.
// A pre-qual driver cannot be removed while any restricted division still needs them.
export const buildDriversAssignedToLinkedDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  preQualDivisionId: string,
) =>
  new Set(
    coerceArray(seasonDrivers)
      .filter((d) => d.division_id !== preQualDivisionId)
      .map((d) => d.profile_id),
  );

