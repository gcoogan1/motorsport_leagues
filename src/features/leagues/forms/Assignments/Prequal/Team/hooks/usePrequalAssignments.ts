import { useMemo } from "react";

import type { LeagueSeasonDriverTable, LeagueSeasonTeamTable } from "@/types/league.types";
import type { toProfileOption } from "../../../DriverAssignments/DriverAssignments.util";

import type { TeamRow } from "../../../TeamAssignments/TeamAssignments.util";

import {
  buildPersistedAssignments,
} from "../../../TeamAssignments/TeamAssignments.util";

import {
  buildCurrentDivisionDrivers,
  buildDriversAssignedToOtherDivisions,
  buildLinkedDivisionReadOnlyDrivers,
  buildPreQualDriverDetailsByProfileId,
  buildPreQualDrivers,
  buildPreQualDriversByTeamId,
  buildReadOnlyDivisionDrivers,
} from "../util/prequalTeamAssignments.util";

import type { TeamAssignmentsFormValues } from "../prequalTeamAssignments.schema";

/** Inferred shape of a single driver assignment form row. */
type AssignmentRow = TeamAssignmentsFormValues["assignments"][number];

/** Inferred option shape returned by `toProfileOption` / `buildDriverOptions`. */
type ProfileOption = ReturnType<typeof toProfileOption>;

/**
 * Derives all driver-assignment-related state for the prequal team assignments form.
 *
 * Builds persisted assignment rows for form hydration, read-only driver lists
 * for the Drivers tab, and per-row driver option helpers that exclude already-
 * selected or cross-division drivers.
 *
 * Division rules:
 * - Pre-qual (division_number === 0): drivers are assigned directly via form rows;
 *   persisted assignments and editable selects are derived here.
 * - Linked (division_number !== 0): drivers are inherited read-only from the
 *   pre-qual teams; `persistedAssignments` is always empty for linked divisions.
 */

type Props = {
  activeDivisionId: string;
  preQualDivisionId: string;
  isLinkedDivision: boolean;
  watchedTeams: TeamRow[];
  watchedAssignments: AssignmentRow[];
  divisionTeams: LeagueSeasonTeamTable[];
  seasonDrivers?: LeagueSeasonDriverTable[];
  /** Pre-qual teams for the season — kept in props for potential future use. */
  preQualTeams: LeagueSeasonTeamTable[];
  /** Map from normalised team name → pre-qual team record. */
  preQualTeamByName: Map<string, LeagueSeasonTeamTable>;
  teamNamesAssignedToOtherDivisions: Set<string>;
  /** Map from profile_id → formatted select option (for preserving current row values). */
  participantOptionsByProfileId: Map<string, ProfileOption>;
  driverOptions: ProfileOption[];
};

export const usePrequalAssignments = ({
  activeDivisionId,
  preQualDivisionId,
  isLinkedDivision,
  watchedTeams,
  watchedAssignments,
  divisionTeams,
  seasonDrivers,
  preQualTeamByName,
  participantOptionsByProfileId,
  driverOptions,
}: Props) => {
  const preQualDrivers = useMemo(
    () =>
      buildPreQualDrivers(
        seasonDrivers,
        preQualDivisionId,
      ),
    [
      preQualDivisionId,
      seasonDrivers,
    ],
  );

  const preQualDriversByTeamId =
    useMemo(
      () =>
        buildPreQualDriversByTeamId(
          preQualDrivers,
        ),
      [preQualDrivers],
    );

  const preQualDriverDetailsByProfileId =
    useMemo(
      () =>
        buildPreQualDriverDetailsByProfileId(
          preQualDrivers,
        ),
      [preQualDrivers],
    );

  const currentDivisionDrivers =
    useMemo(
      () =>
        buildCurrentDivisionDrivers(
          seasonDrivers,
          divisionTeams,
        ),
      [divisionTeams, seasonDrivers],
    );

  const currentDivisionTeamsById =
    useMemo(
      () =>
        new Map(
          divisionTeams.map((t) => [
            t.id,
            t,
          ]),
        ),
      [divisionTeams],
    );

  const readOnlyDivisionDrivers =
    useMemo(
      () =>
        isLinkedDivision
          ? buildLinkedDivisionReadOnlyDrivers(
              watchedTeams,
              preQualTeamByName,
              preQualDriversByTeamId,
            )
          : buildReadOnlyDivisionDrivers(
              currentDivisionDrivers,
              currentDivisionTeamsById,
            ),
      [
        currentDivisionDrivers,
        currentDivisionTeamsById,
        isLinkedDivision,
        preQualDriversByTeamId,
        preQualTeamByName,
        watchedTeams,
      ],
    );

  const persistedAssignments =
    useMemo(
      () =>
        isLinkedDivision
          ? []
          : buildPersistedAssignments(
              currentDivisionDrivers,
            ),
      [
        currentDivisionDrivers,
        isLinkedDivision,
      ],
    );

  const persistedAssignmentMap =
    useMemo(
      () =>
        new Map(
          currentDivisionDrivers.map(
            (d) => [
              d.profile_id,
              d,
            ],
          ),
        ),
      [currentDivisionDrivers],
    );

  const driversAssignedToOtherDivisions =
    useMemo(
      () =>
        buildDriversAssignedToOtherDivisions(
          seasonDrivers,
          activeDivisionId,
          preQualDivisionId,
        ),
      [
        activeDivisionId,
        preQualDivisionId,
        seasonDrivers,
      ],
    );

  const getDriverOptionsForRow = (
    rowIndex: number,
  ) => {
    const selected = new Set(
      watchedAssignments
        .map((a, i) =>
          i === rowIndex
            ? ""
            : (a?.driver ?? ""),
        )
        .filter(Boolean),
    );

    const current =
      watchedAssignments[rowIndex]
        ?.driver;

    const filtered =
      driverOptions.filter(
        (o) =>
          o.value === current ||
          (!selected.has(o.value) &&
            !driversAssignedToOtherDivisions.has(
              o.value,
            )),
      );

    const currentOpt = current
      ? participantOptionsByProfileId.get(
          current,
        )
      : undefined;

    if (
      currentOpt &&
      !filtered.some(
        (o) =>
          o.value === currentOpt.value,
      )
    ) {
      return [
        currentOpt,
        ...filtered,
      ];
    }

    return filtered;
  };

  const findNextAvailableDriver =
    () => {
      const selectedDriverIds =
        new Set(
          watchedAssignments
            .map(
              (a) =>
                a?.driver ?? "",
            )
            .filter(Boolean),
        );

      return (
        driverOptions.find(
          (o) =>
            !selectedDriverIds.has(
              o.value,
            ) &&
            !driversAssignedToOtherDivisions.has(
              o.value,
            ),
        ) ?? null
      );
    };

  return {
    currentDivisionDrivers,
    persistedAssignments,
    persistedAssignmentMap,
    preQualDriversByTeamId,
    preQualDriverDetailsByProfileId,
    readOnlyDivisionDrivers,
    driversAssignedToOtherDivisions,
    getDriverOptionsForRow,
    findNextAvailableDriver,
  };
};