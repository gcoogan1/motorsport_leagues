import type { LeagueSeasonDivisionTable } from "@/types/league.types";

// Treats undefined query data the same as an empty array so callers never have to check for undefined.
const coerceArray = <T>(data: T[] | undefined): T[] => data ?? [];

// Converts division records to the label/value pairs used by FilterBar.
export const buildDivisionOptions = (
  divisions: LeagueSeasonDivisionTable[] | undefined,
) =>
  coerceArray(divisions).map((d) => ({
    label: renameDivisionLabel(d.division_number),
    value: d.id,
  }));

const renameDivisionLabel = ( divisionNum: number ): string => {
  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  if (divisionNum === 0) {
    return "Pre-q";
  }

  return `${romanNumerals[divisionNum - 1]}`;
}