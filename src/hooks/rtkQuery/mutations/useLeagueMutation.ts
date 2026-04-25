// --- Mutations --- //
// Used to modify data //

import {
  useAddLeagueApplicationOptionsMutation,
  useAddLeagueParticipantMutation,
  useAddLeagueParticipantRoleMutation,
  useCreateLeagueJoinRequestMutation,
  useCreateLeagueSeasonMutation,
  useFollowLeagueMutation,
  useJoinLeagueWithRolesMutation,
  useRemoveLeagueApplicationOptionsMutation,
  useRemoveLeagueJoinRequestMutation,
  useRemoveLeagueFollowerMutation,
  useRemoveLeagueParticipantMutation,
  useRemoveLeagueParticipantRoleMutation,
  useRemoveLeagueSeasonMutation,
  useUnfollowLeagueMutation,
  // useUpdateLeagueParticipantRoleMutation,
  useUpdateLeagueApplicationOptionsMutation,
  useUpdateLeagueSeasonMutation,
} from "@/store/rtkQueryAPI/leagueApi";

// Mutation for adding league application options.
export const useAddLeagueApplicationOptions = () => {
  return useAddLeagueApplicationOptionsMutation();
};

// Mutation for adding a PARTICIPANT to a league.
// This hook provides a mutation function that can be called to add a PARTICIPANT,
// along with the loading and error state of the mutation.
export const useAddLeagueParticipant = () => {
  return useAddLeagueParticipantMutation();
};

// Mutation for joining a league as a participant.
// This mirrors the squad-member helper naming while keeping league terminology.
export const useJoinLeagueAsParticipant = () => {
  return useJoinLeagueWithRolesMutation();
};

// Mutation for creating a join request for a league.
export const useCreateLeagueJoinRequest = () => {
  return useCreateLeagueJoinRequestMutation();
};

// Mutation for removing a join request from a league.
export const useRemoveLeagueJoinRequest = () => {
  return useRemoveLeagueJoinRequestMutation();
};

// Mutation for removing league application options.
export const useRemoveLeagueApplicationOptions = () => {
  return useRemoveLeagueApplicationOptionsMutation();
};

// Mutation for adding a role to a participant in a league.
export const useAddLeagueParticipantRole = () => {
  return useAddLeagueParticipantRoleMutation();
};

// // Mutation for updating a PARTICIPANT's role in a league.
// export const useUpdateLeagueParticipantRole = () => {
//   return useUpdateLeagueParticipantRoleMutation();
// };

// Mutation for removing a PARTICIPANT from a league.
export const useRemoveLeagueParticipant = () => {
  return useRemoveLeagueParticipantMutation();
};

// Mutation for removing a participant from a league.
export const useRemoveParticipantFromLeague = () => {
  return useRemoveLeagueParticipantMutation();
};

// Mutation for removing a role from a participant in a league.
export const useRemoveLeagueParticipantRole = () => {
  return useRemoveLeagueParticipantRoleMutation();
};

// Mutation for following a league.
export const useFollowLeague = () => {
  return useFollowLeagueMutation();
};

// Mutation for unfollowing a league.
export const useUnfollowLeague = () => {
  return useUnfollowLeagueMutation();
};

// Mutation for removing a follower from a league.
export const useRemoveLeagueFollower = () => {
  return useRemoveLeagueFollowerMutation();
};

// Mutation for creating a new SEASON in a league.
export const useCreateLeagueSeason = () => {
  return useCreateLeagueSeasonMutation();
};

// Mutation for updating an existing SEASON in a league.
export const useUpdateLeagueSeason = () => {
  return useUpdateLeagueSeasonMutation();
};

// Mutation for updating league application options.
export const useUpdateLeagueApplicationOptions = () => {
  return useUpdateLeagueApplicationOptionsMutation();
};

// Mutation for removing a SEASON from a league.
export const useRemoveLeagueSeason = () => {
  return useRemoveLeagueSeasonMutation();
};