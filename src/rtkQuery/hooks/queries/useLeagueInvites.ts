import { useGetPendingLeagueInvitesQuery } from "@/rtkQuery/API/leagueApi";

// Query for fetching pending invites of a league
export const useLeagueInvites = (leagueId?: string) =>
  useGetPendingLeagueInvitesQuery(leagueId ?? "", {
    skip: !leagueId,
    refetchOnMountOrArgChange: true,
  });
