// --- Mutations --- //
// Used to modify data //

import { useAddSquadMemberMutation, useFollowSquadMutation, useRemoveSquadFollowerMutation, useRemoveSquadMemberMutation, useUnfollowSquadMutation, useUpdateSquadMemberRoleMutation } from "@/rtkQuery/API/squadApi";


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

// Mutation for removing a squad follower.
// This hook provides a mutation function that can be called to remove a squad follower, along with the loading and error state of the mutation.
export const useRemoveSquadFollower = () => {
  return useRemoveSquadFollowerMutation();
};

// Mutation for joining a squad as a member.
// This hook provides a mutation function that can be called to add a member to a squad, along with the loading and error state of the mutation.
export const useJoinSquadAsMember = () => {
  return useAddSquadMemberMutation();
}

export const useUpdateSquadMemberRole = () => {
  return useUpdateSquadMemberRoleMutation();
}

// Mutation for removing a member from a squad.
// This hook provides a mutation function that can be called to remove a member from a squad, along with the loading and error state of the mutation.
export const useRemoveMemberFromSquad = () => {
  return useRemoveSquadMemberMutation();
};