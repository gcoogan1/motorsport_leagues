import type { EventTrackDetailsTable, EventCarDetailsTable } from "@/types/event.types";
import type { EventAdvancedSettingsTable } from "@/types/eventAdvancedSettings";
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

export const formatActiveDivisionTabLabel = (label: string): string => {
  if (!label || label.toLowerCase() === "pre-q") {
    return label;
  }

  return `Division ${label}`;
};

export const normalizeDivisionTabLabel = (label: string): string =>
  label.replace(/\s+division$/i, "");

export const getTrackDetails = (
  trackDetails?: EventTrackDetailsTable | EventTrackDetailsTable[] | null,
): EventTrackDetailsTable | undefined => {
  if (!trackDetails) {
    return undefined;
  }

  return Array.isArray(trackDetails) ? trackDetails[0] : trackDetails;
};

export const getCarDetails = (
  carDetails?: EventCarDetailsTable[] | EventCarDetailsTable | null,
): EventCarDetailsTable[] => {
  if (!carDetails) {
    return [];
  }

  return Array.isArray(carDetails) ? carDetails : [carDetails];
};

export const getAdvancedSettings = (
  advancedSettings?: EventAdvancedSettingsTable | EventAdvancedSettingsTable[] | null,
): EventAdvancedSettingsTable | undefined => {
  if (!advancedSettings) {
    return undefined;
  }

  return Array.isArray(advancedSettings) ? advancedSettings[0] : advancedSettings;
};