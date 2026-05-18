import type {
  LeagueSeasonDivisionTable,
  LeagueSeasonDriverTable,
} from "@/types/league.types";

export const getPreQualDivisionId = (
  includesPreQual: boolean | undefined,
  divisions: LeagueSeasonDivisionTable[] | undefined,
) => {
  if (!includesPreQual) {
    return "";
  }

  return divisions?.find((division) => division.division_number === 0)?.id ?? "";
};

// Linked divisions cannot freely choose drivers; they inherit from the pre-qual source set.
export const isPreQualRestrictedDivision = (
  selectedDivisionId: string,
  preQualDivisionId: string,
) =>
  !!preQualDivisionId &&
  selectedDivisionId !== "" &&
  selectedDivisionId !== preQualDivisionId;

// Build a quick lookup of the drivers already assigned to division 0.
export const buildPreQualAssignedDriverIds = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  preQualDivisionId: string,
) =>
  new Set(
    (seasonDrivers ?? [])
      .filter((assignment) => assignment.division_id === preQualDivisionId)
      .map((assignment) => assignment.profile_id),
  );

// Exclude drivers already used in another linked division while allowing the active row to keep its value.
export const buildDriversAssignedToOtherDivisions = (
  seasonDrivers: LeagueSeasonDriverTable[] | undefined,
  selectedDivisionId: string,
  preQualDivisionId: string,
) =>
  new Set(
    (seasonDrivers ?? [])
      .filter((assignment) => {
        if (assignment.division_id === selectedDivisionId) {
          return false;
        }

        if (!preQualDivisionId) {
          return true;
        }

        if (selectedDivisionId === preQualDivisionId) {
          return false;
        }

        return assignment.division_id !== preQualDivisionId;
      })
      .map((assignment) => assignment.profile_id),
  );
