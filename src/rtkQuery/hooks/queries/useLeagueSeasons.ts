import { useGetLeagueSeasonDriversBySeasonIdQuery, useGetLeagueSeasonsQuery, useGetLeagueSeasonTeamsBySeasonIdQuery } from "@/rtkQuery/API/leagueApi";

export const useLeagueSeasons = (leagueId?: string) =>
  useGetLeagueSeasonsQuery(leagueId ?? "", {
    skip: !leagueId,
  });

  // -- Get League Season Drivers by Season ID -- //
  export const useLeagueSeasonDrivers = (seasonId?: string) =>
    useGetLeagueSeasonDriversBySeasonIdQuery(seasonId ?? "", {
      skip: !seasonId,
    });
    
  
  // -- Get League Season Teams by Season ID -- //
  export const useLeagueSeasonTeams = (seasonId?: string) =>
    useGetLeagueSeasonTeamsBySeasonIdQuery(seasonId ?? "", {
      skip: !seasonId,
    });