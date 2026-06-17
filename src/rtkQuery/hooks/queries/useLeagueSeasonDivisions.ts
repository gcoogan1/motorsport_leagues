import { useGetLeagueSeasonDivisionByDivisionIdQuery, useGetLeagueSeasonDivisionsQuery, useGetLeagueSeasonDriverByIdQuery, useGetLeagueSeasonDriversByDivisionQuery, useGetLeagueSeasonTeamByIdQuery, useGetLeagueSeasonTeamsByDivisionQuery } from "@/rtkQuery/API/leagueApi";


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

// -- Get League Season Division Drivers by Division ID -- //
export const useLeagueSeasonDivisionDrivers = (divisionId?: string) =>
  useGetLeagueSeasonDriversByDivisionQuery(divisionId ?? "", {
    skip: !divisionId,
  });
  

// -- Get League Season Division Teams by Division ID -- //
export const useLeagueSeasonDivisionTeams = (divisionId?: string) =>
  useGetLeagueSeasonTeamsByDivisionQuery(divisionId ?? "", {
    skip: !divisionId,
  });

// -- Get League Season Driver by ID -- //
export const useLeagueSeasonDriver = (driverId?: string) =>
  useGetLeagueSeasonDriverByIdQuery(driverId ?? "", {
    skip: !driverId,
  });

// -- Get League Season Team by ID -- //
export const useLeagueSeasonTeam = (teamId?: string) =>
  useGetLeagueSeasonTeamByIdQuery(teamId ?? "", {
    skip: !teamId,
  });
