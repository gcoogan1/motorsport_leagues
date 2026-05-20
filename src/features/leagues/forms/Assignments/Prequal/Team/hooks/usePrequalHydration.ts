import { useEffect, useMemo, useRef } from "react";

import type {
  UseFormGetValues,
  UseFormReset,
} from "react-hook-form";

import {
  buildPersistedAssignments,
  getTeamKey,
  type TeamRow,
} from "../../../TeamAssignments/TeamAssignments.util";

import type { TeamAssignmentsFormValues } from "../prequalTeamAssignments.schema";

type Props = {
  activeDivisionId: string;
  reset: UseFormReset<TeamAssignmentsFormValues>;
  getValues: UseFormGetValues<TeamAssignmentsFormValues>;
  persistedTeams: TeamRow[];
  persistedAssignments: ReturnType<
    typeof buildPersistedAssignments
  >;
};

/**
 * Hydrates the react-hook-form with server data whenever the active division
 * or persisted data changes.
 *
 * Uses stable string keys derived from team ids and assignment pairs to avoid
 * unnecessary resets — the form is only re-initialised when the underlying
 * server data actually changes, not on every render.
 *
 * On division switch the form is first cleared so stale data from the previous
 * division doesn't bleed through before the new persisted data arrives.
 * Team key remapping preserves existing assignment rows when a save causes
 * a team to receive a server-generated id (localId → teamId transition).
 */
export const usePrequalHydration = ({
  activeDivisionId,
  reset,
  getValues,
  persistedTeams,
  persistedAssignments,
}: Props) => {
  const loadedTeamsKey = useRef("");
  const loadedAssignmentsKey = useRef("");

  const persistedTeamsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedTeams
        .map(
          (t) =>
            `${t.teamId ?? t.localId}:${t.teamName}`,
        )
        .join("|")}`,
    [activeDivisionId, persistedTeams],
  );

  const persistedAssignmentsKey = useMemo(
    () =>
      `${activeDivisionId}:${persistedAssignments
        .map(
          (a) => `${a.driver}:${a.teamKey}`,
        )
        .join("|")}`,
    [activeDivisionId, persistedAssignments],
  );

  useEffect(() => {
    if (!activeDivisionId) return;

    reset(
      {
        teams: [],
        assignments: [],
      },
      {
        keepDirty: false,
        keepTouched: false,
      },
    );

    loadedTeamsKey.current = "";
    loadedAssignmentsKey.current = "";
  }, [activeDivisionId, reset]);

  useEffect(() => {
    if (
      persistedTeamsKey ===
      loadedTeamsKey.current
    ) {
      return;
    }

    const oldTeams = getValues("teams");
    const oldAssignments =
      getValues("assignments");

    const nameToNewKey = new Map(
      persistedTeams.map((t) => [
        t.teamName?.trim() ?? "",
        getTeamKey(t),
      ]),
    );

    const oldKeyToNewKey = new Map<
      string,
      string
    >(
      oldTeams
        .filter((t) => t?.teamName)
        .map((t): [string, string] => [
          getTeamKey(t as TeamRow),
          nameToNewKey.get(
            t?.teamName?.trim() ?? "",
          ) ?? "",
        ])
        .filter(([, newKey]) => !!newKey),
    );

    const remappedAssignments =
      oldKeyToNewKey.size > 0
        ? oldAssignments.map((a) => ({
            ...a,
            teamKey:
              oldKeyToNewKey.get(
                a.teamKey ?? "",
              ) ??
              (a.teamKey ?? ""),
          }))
        : oldAssignments;

    reset(
      {
        teams: persistedTeams,
        assignments: remappedAssignments,
      },
      {
        keepDirty: false,
        keepTouched: false,
      },
    );

    loadedTeamsKey.current =
      persistedTeamsKey;
  }, [
    getValues,
    persistedTeams,
    persistedTeamsKey,
    reset,
  ]);

  useEffect(() => {
    if (
      persistedAssignmentsKey ===
      loadedAssignmentsKey.current
    ) {
      return;
    }

    reset(
      {
        ...getValues(),
        assignments: persistedAssignments,
      },
      {
        keepDirty: false,
        keepTouched: false,
      },
    );

    loadedAssignmentsKey.current =
      persistedAssignmentsKey;
  }, [
    getValues,
    persistedAssignments,
    persistedAssignmentsKey,
    reset,
  ]);
};