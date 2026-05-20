import { useEffect } from "react";

import type {
  FieldErrors,
  UseFormClearErrors,
} from "react-hook-form";

import {
  TEAM_DELETE_BLOCKED_MESSAGE,
  type TeamAssignmentsFormValues,
} from "../prequalTeamAssignments.schema";

import {
  getTeamKey,
  type TeamRow,
} from "../../../TeamAssignments/TeamAssignments.util";

type AssignmentRow =
  TeamAssignmentsFormValues["assignments"][number];

type Props = {
  isDirty: boolean;
  onDirtyChange?: (value: boolean) => void;
  clearErrors: UseFormClearErrors<TeamAssignmentsFormValues>;
  errors: FieldErrors<TeamAssignmentsFormValues>;
  watchedTeams: TeamRow[];
  watchedAssignments: AssignmentRow[];
};

/**
 * Registers form-level side effects for the prequal team assignments form.
 *
 * - Forwards `isDirty` state to the parent via `onDirtyChange`.
 * - Attaches a `beforeunload` warning when the form has unsaved changes.
 * - Auto-clears the TEAM_DELETE_BLOCKED_MESSAGE error from a team row once
 *   all drivers assigned to that team have been removed, unblocking deletion.
 */
export const usePrequalEffects = ({
  isDirty,
  onDirtyChange,
  clearErrors,
  errors,
  watchedTeams,
  watchedAssignments,
}: Props) => {
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!isDirty) return;

    const handler = (
      e: BeforeUnloadEvent,
    ) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handler,
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        handler,
      );
  }, [isDirty]);

  useEffect(() => {
    watchedTeams.forEach((team, index) => {
      if (!team) return;

      const teamKey = getTeamKey(team);

      const hasAssignedDrivers =
        watchedAssignments.some(
          (a) => a?.teamKey === teamKey,
        );

      const currentMessage =
        errors.teams?.[index]?.teamName
          ?.message;

      if (
        !hasAssignedDrivers &&
        currentMessage ===
          TEAM_DELETE_BLOCKED_MESSAGE
      ) {
        clearErrors(
          `teams.${index}.teamName`,
        );
      }
    });
  }, [
    clearErrors,
    errors.teams,
    watchedAssignments,
    watchedTeams,
  ]);
};