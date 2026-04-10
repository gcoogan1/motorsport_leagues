import { useGetLeagueParticipantsQuery } from "@/store/rtkQueryAPI/leagueApi";

export const useLeagueParticipants = (leagueId?: string) =>
  useGetLeagueParticipantsQuery(leagueId ?? "", {
    skip: !leagueId,
  });