import {
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonDivisionsQuery,
  useGetLeagueSeasonDriversBySeasonIdQuery,
  useGetLeagueSeasonTeamsBySeasonIdQuery,
} from "@/rtkQuery/API/leagueApi";

import type { LeagueSeasonTable } from "@/types/league.types";

/**
 * Centralises all RTK Query calls needed by the prequal team assignments form.
 *
 * Note: `seasonTeamsByDivision` is intentionally NOT fetched here because it
 * depends on `activeDivisionId`, which is computed downstream in `usePrequalDivision`.
 * That query lives in `usePrequalTeams` where the division id is available.
 */
export const usePrequalQueries = (
  seasonData: LeagueSeasonTable,
) => {
  // Fetches all divisions for the season so the division selector can be populated.
  const seasonDivisions =
    useGetLeagueSeasonDivisionsQuery(seasonData.id);

  // Fetches all league participants so the driver assignment selects can be populated.
  const leagueParticipants =
    useGetLeagueParticipantsQuery(
      seasonData.league_id,
    );

  // Season-wide driver query — used to determine persisted assignments and
  // compute which drivers are already in other divisions.
  const seasonDriversBySeason =
    useGetLeagueSeasonDriversBySeasonIdQuery(
      seasonData.id,
    );

  // Season-wide team query — used to derive the pre-qual team pool and detect
  // teams claimed by other linked divisions.
  const seasonTeamsBySeason =
    useGetLeagueSeasonTeamsBySeasonIdQuery(
      seasonData.id,
    );

  // Prefer `currentData` (the last successful result) so the UI doesn't flicker
  // back to undefined during a refetch after save.
  const seasonTeams =
    seasonTeamsBySeason.currentData ??
    seasonTeamsBySeason.data;

  const seasonDrivers =
    seasonDriversBySeason.currentData ??
    seasonDriversBySeason.data;

  return {
    seasonDivisions,
    leagueParticipants,
    seasonDriversBySeason,
    seasonTeamsBySeason,
    seasonTeams,
    seasonDrivers,
  };
};