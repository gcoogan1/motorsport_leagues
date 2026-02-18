import {
  useGetFollowersQuery,
  useGetFollowingQuery,
  useIsFollowingQuery,
} from "@/store/rtkQueryAPI/profileApi";


// --- Queries --- //
// Used to fetch data //

// Query for fetching followers of a profile
export const useProfileFollowers = (profileId: string) =>
  useGetFollowersQuery(profileId, { skip: !profileId });

// Query for fetching profiles that a user is following
export const useProfileFollowing = (userId: string) =>
  useGetFollowingQuery(userId, { skip: !userId });

// Query for checking if the current user is following a specific profile
export const useIsFollowingProfile = (userId: string, profileId: string) =>
  useIsFollowingQuery({ userId, profileId }, { skip: !userId || !profileId });

