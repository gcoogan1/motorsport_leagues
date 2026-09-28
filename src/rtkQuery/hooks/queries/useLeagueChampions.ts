import {
  useGetLeagueChampionByIdQuery,
  useGetLeagueChampionsByLeagueAndSeasonQuery,
  useGetLeagueChampionsByProfileQuery,
} from "@/rtkQuery/API/leagueApi";

export const useLeagueChampionsByProfile = (profileId?: string) =>
  useGetLeagueChampionsByProfileQuery(profileId ?? "", {
    skip: !profileId,
  });

export const useLeagueChampionsByLeagueAndSeason = (
  leagueId?: string,
  seasonId?: string,
) =>
  useGetLeagueChampionsByLeagueAndSeasonQuery(
    { leagueId: leagueId ?? "", seasonId: seasonId ?? "" },
    { skip: !leagueId || !seasonId },
  );

export const useLeagueChampionById = (championId?: string) =>
  useGetLeagueChampionByIdQuery(championId ?? "", {
    skip: !championId,
  });