// --- Mutations --- //
// Used to modify data //

import { useFollowSquadMutation, useUnfollowSquadMutation } from "@/store/rtkQueryAPI/squadApi";


// Mutation for following a squad.
// This hook provides a mutation function that can be called to follow a squad, along with the loading and error state of the mutation.
export const useFollowSquad = () => {
  return useFollowSquadMutation();
};

// Mutation for unfollowing a squad.
// This hook provides a mutation function that can be called to unfollow a squad, along with the loading and error state of the mutation.
export const useUnfollowSquad = () => {
  return useUnfollowSquadMutation();
};