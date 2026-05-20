import { useEffect, useMemo, useState } from "react";
import type { UseFormReset } from "react-hook-form";
import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";
import {
  buildDivisionOptions,
  buildDriverParticipants,
  buildDriverOptions,
  buildParticipantOptionsByProfileId,
  buildPersistedAssignments,
  buildPersistedAssignmentMap,
  buildDriversAssignedToOtherDivisions,
  type DriverAssignmentRow,
} from "./util/DriverAssignments.util";
import type { LeagueParticipantProfile } from "@/types/league.types";

// --Types-- //

// Infer query result types directly from the RTK Query hooks so callers
// don't have to import or construct these types manually.
type SeasonDivisionsQueryResult = ReturnType<typeof useGetLeagueSeasonDivisionsQuery>;
type LeagueParticipantsQueryResult = ReturnType<typeof useGetLeagueParticipantsQuery>;
type SeasonDriversBySeasonQueryResult = ReturnType<
  typeof useGetLeagueSeasonDriversBySeasonIdQuery
>;

type FormValues = {
  assignments: DriverAssignmentRow[];
};

type HookProps = {
  // RHF bindings — passed in so the hook can drive form resets without owning the form.
  reset: UseFormReset<FormValues>;
  watchedAssignments: DriverAssignmentRow[];
  isDirty: boolean;
  // Propagates dirty state up to a parent that may show an unsaved-changes indicator.
  onDirtyChange?: (value: boolean) => void;
  // RTK Query results — passed in so a single set of queries is shared with the component.
  seasonDivisions: SeasonDivisionsQueryResult;
  leagueParticipants: LeagueParticipantsQueryResult;
  seasonDriversBySeason: SeasonDriversBySeasonQueryResult;
};

// -- Hook -- //

// Encapsulates all non-UI logic for the DriverAssignments component, including:
// - Deriving driver options and division options from query results.
// - Loading persisted driver assignments into form rows for the active division.
// - Providing helpers to build the correct option list for each row, enforcing
//   unique drivers across divisions and within the same division.
// - Tracking which drivers are assigned to other divisions so they can be
//   excluded from the current division's options.
export const useDriverAssignments = ({
  reset,
  watchedAssignments,
  isDirty,
  onDirtyChange,
  seasonDivisions,
  leagueParticipants,
  seasonDriversBySeason,
}: HookProps) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");

  // -- Participant data -- //

  // Only participants with the "driver" role are eligible for assignment.
  const driverParticipants = useMemo(
    () => buildDriverParticipants(leagueParticipants.data),
    [leagueParticipants.data]
  );

  // Flat option list used to find the next available driver when appending a row.
  const driverOptions = useMemo(
    () => buildDriverOptions(driverParticipants),
    [driverParticipants]
  );

  // Lookup map for access to a row's current option, used to preserve the current value in the row's option list even if it's taken by another row or division.
  const participantOptionsByProfileId = useMemo(
    () => buildParticipantOptionsByProfileId(leagueParticipants.data),
    [leagueParticipants.data]
  );

  // Uses profile id to find the full participant record, 
  // which includes the name needed to display the option label when the current value is not in the main option list (e.g. the participant was removed from the league after being assigned).
  const participantMap = useMemo<Map<string, LeagueParticipantProfile>>(
    () =>
      new Map(
        (leagueParticipants.data ?? []).map((participant: LeagueParticipantProfile) => [
          participant.profile_id,
          participant,
        ])
      ),
    [leagueParticipants.data]
  );

  // -- Division options -- //

  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data]
  );

  // The currently active division determines which persisted assignments are loaded and which drivers are excluded as already assigned to other divisions. 
  // If the selected division id is not in the options (e.g. it was deleted), fall back to the first option to avoid leaving the UI in a broken state with no assignments shown.
  const effectiveDivisionId = useMemo(() => {
    const first = divisionOptions[0]?.value ?? "";

    if (!selectedDivisionId) return first;

    return divisionOptions.some(d => d.value === selectedDivisionId)
      ? selectedDivisionId
      : first;
  }, [selectedDivisionId, divisionOptions]);

  // -- Persisted assignments for the active division -- //

  // Rows already saved to the server for this division, loaded into the form.
  const persistedAssignments = useMemo(
    () => buildPersistedAssignments(seasonDriversBySeason.data, effectiveDivisionId),
    [seasonDriversBySeason.data, effectiveDivisionId]
  );

  // Map of assignmentId → profileId used by the save handler to detect changes.
  const persistedMap = useMemo(
    () => buildPersistedAssignmentMap(persistedAssignments),
    [persistedAssignments]
  );

  // Profile ids already assigned to a different division — excluded from all select options.
  const otherDivisionDrivers = useMemo(
    () => buildDriversAssignedToOtherDivisions(seasonDriversBySeason.data, effectiveDivisionId),
    [seasonDriversBySeason.data, effectiveDivisionId]
  );

  // -- Effects -- //

  // Keep the parent's unsaved-changes indicator in sync.
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Warn the user before they leave the page with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Re-load the form whenever the effective division or server data changes.
  // keepDirty/keepTouched false ensures the form is not marked dirty after hydration.
  useEffect(() => {
    if (!effectiveDivisionId) return;

    reset(
      { assignments: persistedAssignments },
      { keepDirty: false, keepTouched: false }
    );
  }, [effectiveDivisionId, persistedAssignments, reset]);

  // -- Helpers -- //

  // Returns the option list for a specific row, 
  // excluding drivers already taken by other rows or other divisions while preserving the row's current value even if it's taken. 
  // This ensures that once a driver is assigned to a row, it won't disappear from that row's options even if another row or division takes it.
  const selectedSet = (excludeIndex?: number) =>
    new Set(
      watchedAssignments
        .map((a, i) => (i === excludeIndex ? "" : a?.driver))
        .filter(Boolean)
    );

  // Builds the available driver options for a specific row, excluding drivers
  // taken by other rows or other divisions while preserving the row's current value.
  const getDriverOptionsForRow = (rowIndex: number) => {
    const selected = selectedSet(rowIndex);
    const current = watchedAssignments[rowIndex]?.driver;

    const filtered = driverOptions.filter(
      (o) =>
        o.value === current ||
        (!selected.has(o.value) && !otherDivisionDrivers.has(o.value))
    );

    // Always include the row's current value even if it was removed from the
    // main option list (e.g. the participant was removed from the league).
    const currentOpt = current ? participantOptionsByProfileId.get(current) : undefined;

    if (currentOpt && !filtered.some(o => o.value === currentOpt.value)) {
      return [currentOpt, ...filtered];
    }

    return filtered;
  };

  // Returns the profile id of the next driver that can be appended, or null
  // if every eligible driver is already assigned. The caller decides what to
  // show the user when null is returned (e.g. a NoDrivers modal).
  const findNextAvailableDriver = (): string | null => {
    const selected = selectedSet();
    const next = driverOptions.find(
      (o) => !selected.has(o.value) && !otherDivisionDrivers.has(o.value)
    );

    return next?.value ?? null;
  };

  return {
    setSelectedDivisionId,
    effectiveDivisionId,
    divisionOptions,
    participantMap,
    persistedAssignments,
    persistedMap,
    getDriverOptionsForRow,
    findNextAvailableDriver,
  };
};