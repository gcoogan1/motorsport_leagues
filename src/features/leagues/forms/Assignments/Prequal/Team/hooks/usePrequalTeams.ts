import { useMemo } from "react";
import { useGetLeagueSeasonTeamsByDivisionQuery } from "@/rtkQuery/API/leagueApi";
import type { LeagueSeasonTeamTable } from "@/types/league.types";
import { type TeamRow, buildPersistedTeams } from "../../../TeamAssignments/TeamAssignments.util";
import {
  buildPreQualTeams,
  buildPreQualTeamByName,
  buildTeamNamesAssignedToOtherDivisions,
  buildSelectedTeamOptions,
  buildPreQualTeamOptionsForRow,
  findNextAvailablePreQualTeam,
} from "../util/prequalTeamAssignments.util";

/**
 * Builds all team-related derived state for the prequal team assignments form.
 *
 * Fetches the saved teams for the active division via RTK Query, then derives
 * the pre-qual source list, lookup maps, and per-row option helpers used by
 * both the pre-qual and linked-division team tables.
 *
 * Division rules:
 * - Pre-qual (division_number === 0): teams are created and owned directly here.
 * - Linked (division_number !== 0): teams are selected from the pre-qual pool.
 *   Each pre-qual team may only be assigned to one linked division at a time.
 */

type Props = {
  activeDivisionId: string;
  preQualDivisionId: string;
  watchedTeams: TeamRow[];
  /** All season teams across every division, used to derive the pre-qual source and blocked sets. */
  seasonTeams?: LeagueSeasonTeamTable[];
};

export const usePrequalTeams = ({
  activeDivisionId,
  preQualDivisionId,
  watchedTeams,
  seasonTeams,
}: Props) => {
  // Fetches the saved teams for the active division. `skip` prevents an empty-
  // string query from firing before the user selects a division.
  const seasonTeamsByDivision = useGetLeagueSeasonTeamsByDivisionQuery(
    activeDivisionId,
    { skip: !activeDivisionId },
  );

  const divisionTeams = useMemo(
    () => seasonTeamsByDivision.currentData ?? [],
    [seasonTeamsByDivision.currentData],
  );

  const preQualTeamSource = useMemo(() => {
    if (!preQualDivisionId) {
      return [];
    }

    if (
      activeDivisionId ===
      preQualDivisionId
    ) {
      return divisionTeams;
    }

    return (seasonTeams ?? []).filter(
      (t) =>
        t.division_id ===
        preQualDivisionId,
    );
  }, [
    activeDivisionId,
    divisionTeams,
    preQualDivisionId,
    seasonTeams,
  ]);

  const preQualTeams = useMemo(
    () =>
      buildPreQualTeams(
        preQualTeamSource,
        preQualDivisionId,
      ),
    [
      preQualDivisionId,
      preQualTeamSource,
    ],
  );

  const preQualTeamByName = useMemo(
    () =>
      buildPreQualTeamByName(
        preQualTeams,
      ),
    [preQualTeams],
  );

  const persistedTeams = useMemo(
    () =>
      buildPersistedTeams(
        divisionTeams,
      ),
    [divisionTeams],
  );

  const teamNamesAssignedToOtherDivisions =
    useMemo(
      () =>
        buildTeamNamesAssignedToOtherDivisions(
          seasonTeams,
          activeDivisionId,
          preQualDivisionId,
        ),
      [
        activeDivisionId,
        preQualDivisionId,
        seasonTeams,
      ],
    );

  const teamOptions = useMemo(
    () =>
      buildSelectedTeamOptions(
        watchedTeams,
      ),
    [watchedTeams],
  );

  const getPreQualTeamOptionsForRow = (
    rowIndex: number,
  ) =>
    buildPreQualTeamOptionsForRow(
      watchedTeams.map(
        (t) => t?.teamName ?? "",
      ),
      rowIndex,
      preQualTeams,
      teamNamesAssignedToOtherDivisions,
    );

  const findNextAvailableTeam = () =>
    findNextAvailablePreQualTeam(
      watchedTeams.map(
        (t) => t?.teamName ?? "",
      ),
      preQualTeams,
      teamNamesAssignedToOtherDivisions,
    ) ?? null;

  return {
    seasonTeamsByDivision,
    divisionTeams,
    persistedTeams,
    preQualTeams,
    preQualTeamByName,
    teamNamesAssignedToOtherDivisions,
    teamOptions,
    getPreQualTeamOptionsForRow,
    findNextAvailableTeam,
  };
};