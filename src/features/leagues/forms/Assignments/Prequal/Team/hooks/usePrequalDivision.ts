import { useState, useMemo } from "react";
import { buildDivisionOptions } from "../../../DriverAssignments/DriverAssignments.util";

type Division = {
  id: string;
  division_number: number;
  division_name: string;
  created_at: string;
  season_id: string;
};

/**
 * Manages division selection state and derives division-type flags.
 *
 * Tracks which division the user has selected and computes:
 * - `activeDivisionId`: resolves to the first option when no selection exists.
 * - `preQualDivisionId`: the id of the division with `division_number === 0`.
 * - `isPreQualDivision`: true when the active division is the pre-qual division.
 * - `isLinkedDivision`: true when the active division is any non-zero division
 *   (i.e. it selects teams from pre-qual rather than creating its own).
 */
export const usePrequalDivision = (
  divisions?: Division[],
) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  const divisionOptions = useMemo(
    () => buildDivisionOptions(divisions),
    [divisions],
  );

  const activeDivisionId = useMemo(() => {
    if (!selectedDivisionId) {
      return divisionOptions[0]?.value ?? "";
    }

    return divisionOptions.some(
      (o) => o.value === selectedDivisionId,
    )
      ? selectedDivisionId
      : (divisionOptions[0]?.value ?? "");
  }, [selectedDivisionId, divisionOptions]);

  const preQualDivision = useMemo(
    () => divisions?.find((d) => d.division_number === 0),
    [divisions],
  );

  const currentDivision = useMemo(
    () => divisions?.find((d) => d.id === activeDivisionId),
    [activeDivisionId, divisions],
  );

  return {
    selectedDivisionId,
    setSelectedDivisionId,
    activeDivisionId,
    preQualDivision,
    currentDivision,
    preQualDivisionId: preQualDivision?.id ?? "",
    isPreQualDivision:
      currentDivision?.division_number === 0,
    isLinkedDivision:
      !!currentDivision &&
      currentDivision.division_number !== 0,
    divisionOptions,
  };
};