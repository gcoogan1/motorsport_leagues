// --- Mutations --- //
// Used to modify data //

import {
  useAddLeagueParticipantMutation,
  useCreateLeagueSeasonMutation,
  useRemoveLeagueParticipantMutation,
  useRemoveLeagueSeasonMutation,
  useUpdateLeagueParticipantRoleMutation,
  useUpdateLeagueSeasonMutation,
} from "@/store/rtkQueryAPI/leagueApi";

// Mutation for adding a PARTICIPANT to a league.
// This hook provides a mutation function that can be called to add a PARTICIPANT,
// along with the loading and error state of the mutation.
export const useAddLeagueParticipant = () => {
  return useAddLeagueParticipantMutation();
};

// Mutation for updating a PARTICIPANT's role in a league.
export const useUpdateLeagueParticipantRole = () => {
  return useUpdateLeagueParticipantRoleMutation();
};

// Mutation for removing a PARTICIPANT from a league.
export const useRemoveLeagueParticipant = () => {
  return useRemoveLeagueParticipantMutation();
};

// Mutation for creating a new SEASON in a league.
export const useCreateLeagueSeason = () => {
  return useCreateLeagueSeasonMutation();
};

// Mutation for updating an existing SEASON in a league.
export const useUpdateLeagueSeason = () => {
  return useUpdateLeagueSeasonMutation();
};

// Mutation for removing a SEASON from a league.
export const useRemoveLeagueSeason = () => {
  return useRemoveLeagueSeasonMutation();
};