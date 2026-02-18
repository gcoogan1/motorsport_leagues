import { useFollowProfileMutation, useUnfollowProfileMutation } from "@/store/rtkQueryAPI/profileApi";

// --- Mutations --- //
// Used to modify data //


// Mutation for following a profile
// This hook provides a mutation function to follow a profile, and automatically invalidates related queries on success to keep the UI in sync.
export const useFollowProfile = () => {
  return useFollowProfileMutation();
};


// Mutation for unfollowing a profile
// This hook provides a mutation function to unfollow a profile, and automatically invalidates related queries on success to keep the UI in sync.
export const useUnfollowProfile = () => {
  return useUnfollowProfileMutation();
};