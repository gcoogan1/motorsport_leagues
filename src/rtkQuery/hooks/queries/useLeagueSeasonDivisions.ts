import { useGetLeagueSeasonDivisionByDivisionIdQuery, useGetLeagueSeasonDivisionsQuery } from "@/rtkQuery/API/leagueApi";


// -- Get League Season Divisions by Season ID -- //
export const useLeagueSeasonDivisions = (seasonId?: string) =>
  useGetLeagueSeasonDivisionsQuery(seasonId ?? "", {
    skip: !seasonId,
  });

// -- Get League Season Division by Division ID -- //
export const useLeagueSeasonDivisionByDivisionId = (divisionId?: string) =>
  useGetLeagueSeasonDivisionByDivisionIdQuery(divisionId ?? "", {
    skip: !divisionId,
  });
