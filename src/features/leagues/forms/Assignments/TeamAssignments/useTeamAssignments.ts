import { useEffect, useMemo, useRef, useState } from "react";
import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormReset,
} from "react-hook-form";
import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsByDivisionQuery,
} from "@/rtkQuery/API/leagueApi";
import type { LeagueSeasonTable } from "@/types/league.types";
import {
  buildCurrentDivisionDrivers,
  buildDivisionOptions,
  buildDriverOptions,
  buildDriverParticipants,
  buildDriversAssignedToOtherDivisions,
  buildParticipantOptionsByProfileId,
  buildPersistedAssignments,
  buildPersistedTeams,
  buildTeamOptions,
  getTeamKey,
  type TeamRow,
} from "./TeamAssignments.util";
import {
  TEAM_DELETE_BLOCKED_MESSAGE,
  type TeamAssignmentsFormValues,
} from "./teamAssignments.schema";


// -- Types -- //

type AssignmentRow = TeamAssignmentsFormValues["assignments"][number];

type Props = {
  seasonData: LeagueSeasonTable;
  // RHF bindings — passed so the hook can drive resets without owning the form.
  reset: UseFormReset<TeamAssignmentsFormValues>;
  getValues: UseFormGetValues<TeamAssignmentsFormValues>;
  clearErrors: UseFormClearErrors<TeamAssignmentsFormValues>;
  errors: FieldErrors<TeamAssignmentsFormValues>;
  watchedTeams: TeamRow[];
  watchedAssignments: AssignmentRow[];
  isDirty: boolean;
  // Propagates dirty state up to a parent that may show an unsaved-changes indicator.
  onDirtyChange?: (value: boolean) => void;
};

// -- Hook -- //

// Encapsulates all non-UI logic for the TeamAssignments component, including:
// - Deriving driver and division options from query results.
// - Loading persisted teams and driver assignments into form rows for the active division.
// - Providing helpers to build the correct option list for each row, enforcing
//   unique drivers across divisions and within the same division.
// - Tracking which drivers are assigned to other divisions so they can be
//   excluded from the current division's options.
export const useTeamAssignments = ({
  seasonData,
  reset,
  getValues,
  clearErrors,
  errors,
  watchedTeams,
  watchedAssignments,
  isDirty,
  onDirtyChange,
}: Props) => {
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  // Refs (not state) so updating them inside effects does not trigger extra re-renders.
  const loadedTeamsKey = useRef("");
  const loadedAssignmentsKey = useRef("");

  // -- Queries -- //

  const seasonDivisions = useGetLeagueSeasonDivisionsQuery(seasonData.id);
  const leagueParticipants = useGetLeagueParticipantsQuery(seasonData.league_id);
  const seasonDriversBySeason = useGetLeagueSeasonDriversBySeasonIdQuery(seasonData.id);

  // -- Division -- //

  const divisionOptions = useMemo(
    () => buildDivisionOptions(seasonDivisions.data),
    [seasonDivisions.data],
  );

  // Clamps the active division to a valid option; falls back to the first available.
  const activeDivisionId = useMemo(() => {
    if (!selectedDivisionId) return divisionOptions[0]?.value ?? "";
    return divisionOptions.some((o) => o.value === selectedDivisionId)
      ? selectedDivisionId
      : (divisionOptions[0]?.value ?? "");
  }, [selectedDivisionId, divisionOptions]);

  // Division-dependent query — runs after activeDivisionId is resolved.
  const seasonTeamsByDivision = useGetLeagueSeasonTeamsByDivisionQuery(activeDivisionId, {
    skip: !activeDivisionId,
  });

  // Resets both form sections when the active division changes so stale rows from the
  // previous division are never shown while the new division's data loads.
  // Using ref mutation (not setState) avoids cascading renders.
  useEffect(() => {
    if (!activeDivisionId) return;
    reset({ teams: [], assignments: [] }, { keepDirty: false, keepTouched: false });
    loadedTeamsKey.current = "";
    loadedAssignmentsKey.current = "";
  }, [activeDivisionId, reset]);

  // -- Participant data --

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

  // -- Team data -- //

  // Server teams for the active division, shaped as form rows.
  const persistedTeams = useMemo(
    () => buildPersistedTeams(seasonTeamsByDivision.currentData),
    [seasonTeamsByDivision.currentData],
  );

  // Fingerprint that changes whenever a team is added, renamed, or removed.
  const persistedTeamsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedTeams
        .map((t) => `${t.teamId ?? t.localId}:${t.teamName}`)
        .join("|")}`,
    [activeDivisionId, persistedTeams],
  );

  // Hydrates saved teams into the form once per data snapshot.
  // Also remaps assignment teamKey values from old draft localIds to new server ids so the
  // schema superRefine never sees a mismatch between the teams and assignments arrays.
  useEffect(() => {
    if (persistedTeamsKey === loadedTeamsKey.current) return;

    const oldTeams = getValues("teams");
    const oldAssignments = getValues("assignments");

    // Build oldKey → newKey by matching team names after a save gives teams real server ids.
    const nameToNewKey = new Map(
      persistedTeams.map((t) => [t.teamName?.trim() ?? "", getTeamKey(t)]),
    );
    const oldKeyToNewKey = new Map<string, string>(
      oldTeams
        .filter((t) => t?.teamName)
        .map((t): [string, string] => [
          getTeamKey(t as TeamRow),
          nameToNewKey.get(t?.teamName?.trim() ?? "") ?? "",
        ])
        .filter(([, newKey]) => !!newKey),
    );

    const remappedAssignments =
      oldKeyToNewKey.size > 0
        ? oldAssignments.map((a) => ({
            ...a,
            teamKey: oldKeyToNewKey.get(a.teamKey ?? "") ?? (a.teamKey ?? ""),
          }))
        : oldAssignments;

    reset(
      { teams: persistedTeams, assignments: remappedAssignments },
      { keepDirty: false, keepTouched: false },
    );
    loadedTeamsKey.current = persistedTeamsKey;
  }, [getValues, persistedTeams, persistedTeamsKey, reset]);

  // -- Assignment data -- //

  // Season drivers narrowed to the active division, used for save-time diffing.
  const currentDivisionDrivers = useMemo(
    () => buildCurrentDivisionDrivers(seasonDriversBySeason.data, activeDivisionId),
    [activeDivisionId, seasonDriversBySeason.data],
  );

  // Saved driver-team links for this division, shaped as form rows.
  const persistedAssignments = useMemo(
    () => buildPersistedAssignments(currentDivisionDrivers),
    [currentDivisionDrivers],
  );

  // Fingerprint that changes when the server-side driver assignments change.
  const persistedAssignmentsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedAssignments
        .map((a) => `${a.driver}:${a.teamKey}`)
        .join("|")}`,
    [activeDivisionId, persistedAssignments],
  );

  // Hydrates saved driver assignments into the form once per data snapshot.
  useEffect(() => {
    if (persistedAssignmentsKey === loadedAssignmentsKey.current) return;
    reset(
      { ...getValues(), assignments: persistedAssignments },
      { keepDirty: false, keepTouched: false },
    );
    loadedAssignmentsKey.current = persistedAssignmentsKey;
  }, [getValues, persistedAssignments, persistedAssignmentsKey, reset]);

  // Maps profile id → driver record for save-time update/create decisions.
  const persistedAssignmentMap = useMemo(
    () => new Map(currentDivisionDrivers.map((d) => [d.profile_id, d])),
    [currentDivisionDrivers],
  );

  // Profile ids already placed in any other division — excluded from all selects.
  const driversAssignedToOtherDivisions = useMemo(
    () =>
      buildDriversAssignedToOtherDivisions(seasonDriversBySeason.data, activeDivisionId),
    [activeDivisionId, seasonDriversBySeason.data],
  );

  // Team select options derived from the current watched team rows.
  const teamOptions = useMemo(() => buildTeamOptions(watchedTeams), [watchedTeams]);

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

  // Clears the delete-blocking error from a team row as soon as it no longer has
  // any assigned drivers, making the delete button usable again.
  useEffect(() => {
    watchedTeams.forEach((team, index) => {
      const teamKey = getTeamKey(team);
      const hasAssignedDrivers = watchedAssignments.some((a) => a?.teamKey === teamKey);
      const currentMessage = errors.teams?.[index]?.teamName?.message;
      if (!hasAssignedDrivers && currentMessage === TEAM_DELETE_BLOCKED_MESSAGE) {
        clearErrors(`teams.${index}.teamName`);
      }
    });
  }, [clearErrors, errors.teams, watchedAssignments, watchedTeams]);

  // -- Helpers -- //

  // Builds the available driver options for one row, excluding drivers used in other
  // rows or other divisions while always keeping the row's current selection visible.
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
        (!selected.has(o.value) && !driversAssignedToOtherDivisions.has(o.value)),
    );

    // Always include the current value even if the participant was removed from the league.
    const currentOpt = current ? participantOptionsByProfileId.get(current) : undefined;
    if (currentOpt && !filtered.some((o) => o.value === currentOpt.value)) {
      return [currentOpt, ...filtered];
    }

    return filtered;
  };

  // Returns the next driver that can be appended, or null when all eligible drivers
  // are already assigned. The caller decides what to do on null (e.g. show NoDrivers modal).
  const findNextAvailableDriver = (): string | null => {
    const selected = new Set(
      watchedAssignments.map((a) => a?.driver ?? "").filter(Boolean),
    );
    const next = driverOptions.find(
      (o) => !selected.has(o.value) && !driversAssignedToOtherDivisions.has(o.value),
    );
    return next?.value ?? null;
  };

  // Refetches both driver and team data after a successful save to resync the form.
  const refetchAfterSave = async () => {
    await Promise.all([
      seasonDriversBySeason.refetch(),
      seasonTeamsByDivision.refetch(),
    ]);
  };

  return {
    // Division
    activeDivisionId,
    divisionOptions,
    setSelectedDivisionId,
    // Team data
    persistedTeams,
    teamOptions,
    // Assignment data needed by the save handler
    currentDivisionDrivers,
    persistedAssignments,
    persistedAssignmentMap,
    participantDetailsByProfileId,
    // Render helpers
    getDriverOptionsForRow,
    findNextAvailableDriver,
    // Post-save sync
    refetchAfterSave,
  };
};
