// --- Mutations --- //
// Used to modify data //

import {
  useAddLeagueParticipantMutation,
  useRemoveLeagueParticipantMutation,
  useUpdateLeagueParticipantRoleMutation,
} from "@/store/rtkQueryAPI/leagueApi";

// Mutation for adding a participant to a league.
// This hook provides a mutation function that can be called to add a participant,
// along with the loading and error state of the mutation.
export const useAddLeagueParticipant = () => {
  return useAddLeagueParticipantMutation();
};

// Mutation for updating a participant's role in a league.
// This hook provides a mutation function that can be called to change a role,
// along with the loading and error state of the mutation.
export const useUpdateLeagueParticipantRole = () => {
  return useUpdateLeagueParticipantRoleMutation();
};

// Mutation for removing a participant from a league.
// This hook provides a mutation function that can be called to remove a participant,
// along with the loading and error state of the mutation.
export const useRemoveLeagueParticipant = () => {
  return useRemoveLeagueParticipantMutation();
};