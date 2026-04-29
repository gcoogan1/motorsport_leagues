import { useGetLeagueSeasonsQuery } from "@/rtkQuery/API/leagueApi";

export const useLeagueSeasons = (leagueId?: string) =>
  useGetLeagueSeasonsQuery(leagueId ?? "", {
    skip: !leagueId,
  });