import {
  useGetLeagueFollowersQuery,
  useGetLeagueFollowingQuery,
  useIsFollowingLeagueQuery,
} from "@/rtkQuery/API/leagueApi";

// --- Queries --- //
// Used to fetch data //

// Query for fetching followers of a league
export const useLeagueFollowers = (leagueId: string) =>
  useGetLeagueFollowersQuery(leagueId, { skip: !leagueId });

// Query for fetching leagues that a user is following
export const useLeagueFollowing = (accountId: string) =>
  useGetLeagueFollowingQuery(accountId, { skip: !accountId });

// Query for checking if the current user is following a specific league
export const useIsFollowingLeague = (leagueId: string, accountId: string) =>
  useIsFollowingLeagueQuery({ leagueId, accountId }, { skip: !leagueId || !accountId });
