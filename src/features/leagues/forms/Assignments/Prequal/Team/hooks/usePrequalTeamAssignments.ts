import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormReset,
} from "react-hook-form";
import type { LeagueSeasonTable } from "@/types/league.types";

import { usePrequalQueries } from "./usePrequalQueries";
import { usePrequalDivision } from "./usePrequalDivision";
import { usePrequalParticipants } from "./usePrequalParticipants";
import { usePrequalTeams } from "./usePrequalTeams";
import { usePrequalAssignments } from "./usePrequalAssignments";
import { usePrequalHydration } from "./usePrequalHydration";
import { usePrequalEffects } from "./usePrequalEffects";

import type { TeamRow } from "../../../TeamAssignments/TeamAssignments.util";
import type { TeamAssignmentsFormValues } from "../prequalTeamAssignments.schema";

type AssignmentRow = TeamAssignmentsFormValues["assignments"][number];

type Props = {
  seasonData: LeagueSeasonTable;
  reset: UseFormReset<TeamAssignmentsFormValues>;
  getValues: UseFormGetValues<TeamAssignmentsFormValues>;
  clearErrors: UseFormClearErrors<TeamAssignmentsFormValues>;
  errors: FieldErrors<TeamAssignmentsFormValues>;
  watchedTeams: TeamRow[];
  watchedAssignments: AssignmentRow[];
  isDirty: boolean;
  onDirtyChange?: (value: boolean) => void;
};

/**
 * Main orchestrator hook for the pre-qualifying team assignments form.
 *
 * Composes the focused sub-hooks into a single unified API consumed by
 * `PrequalTeamAssignments.tsx`. Each sub-hook owns a distinct concern:
 *
 * - `usePrequalQueries`    — RTK Query data fetching (divisions, participants, season teams/drivers).
 * - `usePrequalDivision`   — Division selector state + pre-qual vs. linked flags.
 * - `usePrequalParticipants` — Driver option lists derived from league participants.
 * - `usePrequalTeams`      — Division team query, pre-qual pool, and team option helpers.
 * - `usePrequalAssignments` — Persisted assignments, read-only driver lists, per-row driver options.
 * - `usePrequalHydration`  — Form reset / hydration when division or server data changes.
 * - `usePrequalEffects`    — Dirty tracking, beforeunload warning, auto-clear blocked-delete errors.
 */
export const usePrequalTeamAssignments = ({
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
  const queries = usePrequalQueries(seasonData);

  const division = usePrequalDivision(
    queries.seasonDivisions.data,
  );

  const participants = usePrequalParticipants(
    queries.leagueParticipants.data,
  );

  const teams = usePrequalTeams({
    activeDivisionId: division.activeDivisionId,
    preQualDivisionId: division.preQualDivisionId,
    watchedTeams,
    seasonTeams: queries.seasonTeams,
  });

  const assignments = usePrequalAssignments({
    activeDivisionId: division.activeDivisionId,
    preQualDivisionId: division.preQualDivisionId,
    isLinkedDivision: division.isLinkedDivision,
    watchedTeams,
    watchedAssignments,
    divisionTeams: teams.divisionTeams,
    seasonDrivers: queries.seasonDrivers,
    preQualTeams: teams.preQualTeams,
    preQualTeamByName: teams.preQualTeamByName,
    teamNamesAssignedToOtherDivisions:
      teams.teamNamesAssignedToOtherDivisions,
    participantOptionsByProfileId:
      participants.participantOptionsByProfileId,
    driverOptions: participants.driverOptions,
  });

  usePrequalHydration({
    activeDivisionId: division.activeDivisionId,
    reset,
    getValues,
    persistedTeams: teams.persistedTeams,
    persistedAssignments: assignments.persistedAssignments,
  });

  usePrequalEffects({
    isDirty,
    onDirtyChange,
    clearErrors,
    errors,
    watchedTeams,
    watchedAssignments,
  });

  const refetchAfterSave = async () => {
    await Promise.all([
      queries.seasonDriversBySeason.refetch(),
      teams.seasonTeamsByDivision.refetch(),
      queries.seasonTeamsBySeason.refetch(),
    ]);
  };

  return {
    activeDivisionId: division.activeDivisionId,
    divisionOptions: division.divisionOptions,
    setSelectedDivisionId:
      division.setSelectedDivisionId,
    preQualDivisionId: division.preQualDivisionId,
    isPreQualDivision: division.isPreQualDivision,
    isLinkedDivision: division.isLinkedDivision,

    ...teams,
    ...assignments,
    ...participants,

    refetchAfterSave,
  };
};