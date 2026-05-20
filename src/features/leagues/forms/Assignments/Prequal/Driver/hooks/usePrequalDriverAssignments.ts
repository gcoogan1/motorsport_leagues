import { useEffect, useMemo, useRef, useState } from "react";
import type { UseFormGetValues, UseFormReset } from "react-hook-form";
import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";
import type { LeagueSeasonTable } from "@/types/league.types";
import {
  buildDivisionOptions,
  buildDriverOptions,
  buildDriverParticipants,
  buildParticipantOptionsByProfileId,
  buildPersistedAssignmentMap,
  buildPersistedAssignments,
  type DriverAssignmentRow,
} from "../../../DriverAssignments/util/DriverAssignments.util";
import {
  buildDriversAssignedToLinkedDivisions,
  buildDriversAssignedToOtherDivisions,
  buildPreQualAssignedDriverIds,
  getPreQualDivisionId,
  isPreQualRestrictedDivision,
} from "../util/prequalDriverAssignments.util";
 
// -- Types -- //

type FormValues = {
  assignments: DriverAssignmentRow[];
};

type Props = {
  seasonData: LeagueSeasonTable;
  // RHF bindings — passed so the hook can drive resets without owning the form.
  reset: UseFormReset<FormValues>;
  getValues: UseFormGetValues<FormValues>;
  watchedAssignments: DriverAssignmentRow[];
  isDirty: boolean;
  // Propagates dirty state up to the parent sheet guard.
  onDirtyChange?: (value: boolean) => void;
};

 // -- Hook -- //

// Encapsulates all non-UI logic for the PrequalDriverAssignments component.
//
// Pre-qual driver rules enforced here:
//   - Division 0 is the pre-qual source pool; drivers in it can appear in any division.
//   - All non-prequal divisions are "restricted" — they may only draw from the pre-qual pool.
//   - Restricted divisions cannot share drivers with each other (only prequal can share).
//   - A pre-qual driver cannot be removed while a restricted division still references them.
export const usePrequalDriverAssignments = ({
  seasonData,
  reset,
  getValues,
  watchedAssignments,
  isDirty,
  onDirtyChange,
}: Props) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  // Ref (not state) so updating it inside an effect doesn't trigger extra re-renders.
  const loadedAssignmentKey = useRef("");

  // -- Queries -- //

  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const leagueParticipants = useGetLeagueParticipantsQuery(seasonData.league_id);
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(seasonData.id);

  // -- Division -- //

  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  // Division 0 (division_number === 0) is the pre-qual source pool for the season.
  const preQualDivisionId = useMemo(
    () => getPreQualDivisionId(seasonData.includes_pre_qual, seasonDivisions.data),
    [seasonData.includes_pre_qual, seasonDivisions.data],
  );

  // Clamps the selected id to a valid option; falls back to the first on load or if the
  // previously selected division is no longer in the list.
  const activeDivisionId = useMemo(() => {
    if (!selectedDivisionId) return divisionOptions[0]?.value ?? "";
    return divisionOptions.some((o) => o.value === selectedDivisionId)
      ? selectedDivisionId
      : (divisionOptions[0]?.value ?? "");
  }, [selectedDivisionId, divisionOptions]);

  // True when the active division is a restricted (non-prequal) division that can only
  // use drivers already in the pre-qual pool.
  const isRestrictedDivision = isPreQualRestrictedDivision(activeDivisionId, preQualDivisionId);

  // Clears the form before loading data for a different division.
  // Ref mutation avoids cascading re-renders from calling setState inside an effect.
  useEffect(() => {
    if (!activeDivisionId) return;
    reset({ assignments: [] }, { keepDirty: false, keepTouched: false });
    loadedAssignmentKey.current = "";
  }, [activeDivisionId, reset]);

  // -- Participant data -- //

  // Only participants with the "driver" role are eligible for assignment.
  const driverParticipants = useMemo(
    () => buildDriverParticipants(leagueParticipants.data),
    [leagueParticipants.data],
  );

  // Flat option list used in all driver select inputs.
  const driverOptions = useMemo(
    () => buildDriverOptions(driverParticipants),
    [driverParticipants],
  );

  // Keyed by profile id for O(1) option lookup when a row already has a value.
  const participantOptionsByProfileId = useMemo(
    () => buildParticipantOptionsByProfileId(leagueParticipants.data),
    [leagueParticipants.data],
  );

  // Full participant records used by the save handler to populate new driver rows.
  const participantDetailsByProfileId = useMemo(
    () =>
      new Map((leagueParticipants.data ?? []).map((p) => [p.profile_id, p])),
    [leagueParticipants.data],
  );

  // -- Persisted assignments -- //

  // Saved driver records for the active division only.
  const persistedAssignments = useMemo(
    () => buildPersistedAssignments(seasonDriversBySeason.data, activeDivisionId),
    [seasonDriversBySeason.data, activeDivisionId],
  );

  // Fingerprint that changes when the server-side assignments for this division change.
  const persistedAssignmentsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedAssignments
        .map((a) => `${a.assignmentId ?? "new"}:${a.driver}`)
        .join("|")}`,
    [activeDivisionId, persistedAssignments],
  );

  // Hydrates saved assignments into the form once per data snapshot.
  useEffect(() => {
    if (persistedAssignmentsKey === loadedAssignmentKey.current) return;
    reset({ assignments: persistedAssignments }, { keepDirty: false, keepTouched: false });
    loadedAssignmentKey.current = persistedAssignmentsKey;
  }, [persistedAssignments, persistedAssignmentsKey, reset]);

  // Maps assignmentId → profileId for save-time change detection.
  const persistedAssignmentMap = useMemo(
    () => buildPersistedAssignmentMap(persistedAssignments),
    [persistedAssignments],
  );

  // -- Division eligibility sets -- //

  // Profile ids already used in any other non-prequal division.
  // Pre-qual drivers are exempt — they can appear in multiple divisions.
  // Restricted divisions additionally cannot share drivers with each other.
  const driversAssignedToOtherDivisions = useMemo(
    () =>
      buildDriversAssignedToOtherDivisions(
        seasonDriversBySeason.data,
        activeDivisionId,
        preQualDivisionId,
      ),
    [activeDivisionId, preQualDivisionId, seasonDriversBySeason.data],
  );

  // Profile ids referenced by any restricted division.
  // Used to block pre-qual driver removal while a restricted division still needs them.
  const driversAssignedToLinkedDivisions = useMemo(
    () => buildDriversAssignedToLinkedDivisions(seasonDriversBySeason.data, preQualDivisionId),
    [preQualDivisionId, seasonDriversBySeason.data],
  );

  // Profile ids in the pre-qual pool — the only eligible set for restricted divisions.
  const preQualAssignedDriverIds = useMemo(
    () => buildPreQualAssignedDriverIds(seasonDriversBySeason.data, preQualDivisionId),
    [preQualDivisionId, seasonDriversBySeason.data],
  );

  // -- Effects -- //

  // Keeps the parent's unsaved-changes indicator in sync.
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Warns the user before they navigate away with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // -- Helpers -- //

  // Returns eligible driver options for one row:
  //   - Excludes drivers already used by other rows in this division.
  //   - Excludes drivers already assigned to other non-prequal divisions.
  //   - For restricted divisions: further limits to the pre-qual pool only.
  //   - Always keeps the row's current value visible even if it would otherwise be filtered.
  const getDriverOptionsForRow = (rowIndex: number) => {
    const selected = new Set(
      watchedAssignments
        .map((a, i) => (i === rowIndex ? "" : (a?.driver ?? "")))
        .filter(Boolean),
    );
    const current = watchedAssignments[rowIndex]?.driver;

    const filtered = driverOptions.filter(
      (o) =>
        o.value === current ||
        (!selected.has(o.value) &&
          !driversAssignedToOtherDivisions.has(o.value) &&
          (!isRestrictedDivision || preQualAssignedDriverIds.has(o.value))),
    );

    // Always include the current value even if the participant was removed from the league.
    const currentOpt = current ? participantOptionsByProfileId.get(current) : undefined;
    if (currentOpt && !filtered.some((o) => o.value === currentOpt.value)) {
      return [currentOpt, ...filtered];
    }

    return filtered;
  };

  // Returns the next driver that can be appended, or null when all eligible drivers
  // are already assigned. The caller decides what modal to show on null.
  const findNextAvailableDriver = (): string | null => {
    const selected = new Set(
      watchedAssignments.map((a) => a?.driver ?? "").filter(Boolean),
    );
    const next = driverOptions.find(
      (o) =>
        !selected.has(o.value) &&
        !driversAssignedToOtherDivisions.has(o.value) &&
        (!isRestrictedDivision || preQualAssignedDriverIds.has(o.value)),
    );
    return next?.value ?? null;
  };

  // Refetches after a successful save to resync the form with the latest server state.
  const refetchAfterSave = () => seasonDriversBySeason.refetch();

  return {
    // Division
    activeDivisionId,
    divisionOptions,
    setSelectedDivisionId,
    preQualDivisionId,
    isRestrictedDivision,
    // Assignment data needed by the save handler
    persistedAssignments,
    persistedAssignmentMap,
    participantDetailsByProfileId,
    // Pre-qual restriction sets
    preQualAssignedDriverIds,
    driversAssignedToLinkedDivisions,
    // Render helpers
    getDriverOptionsForRow,
    findNextAvailableDriver,
    // Post-save sync
    refetchAfterSave,
    // For accessing form values in the save handler
    getValues,
  };
};
