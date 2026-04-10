import { useGetLeagueSeasonsQuery } from "@/store/rtkQueryAPI/leagueApi";

export const useLeagueSeasons = (leagueId?: string) =>
  useGetLeagueSeasonsQuery(leagueId ?? "", {
    skip: !leagueId,
  });