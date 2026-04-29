import { useGetSquadFollowersQuery, useGetSquadFollowingQuery, useIsFollowingSquadQuery } from "@/rtkQuery/API/squadApi";

// --- Queries --- //
// Used to fetch data //

// Query for fetching followers of a squad
export const useSquadFollowers = (squadId: string) =>
  useGetSquadFollowersQuery(squadId, { skip: !squadId });

// Query for fetching squads that a user is following
export const useSquadFollowing = (accountId: string) =>
  useGetSquadFollowingQuery(accountId, { skip: !accountId });

// Query for checking if the current user is following a specific squad
export const useIsFollowingSquad = (squadId: string, accountId: string) =>
  useIsFollowingSquadQuery({ squadId, accountId }, { skip: !squadId || !accountId });