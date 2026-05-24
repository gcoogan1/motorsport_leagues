import {
  useCreateRoundMutation,
  useDeleteRoundMutation,
  useUpdateRoundMutation,
} from "@/rtkQuery/API/roundApi";

// --- Mutations --- //
// Used to modify data //

// Mutation for creating a round.
export const useCreateRound = () => {
  return useCreateRoundMutation();
};

// Mutation for updating an existing round.
export const useUpdateRound = () => {
  return useUpdateRoundMutation();
};

// Mutation for deleting a round.
export const useDeleteRound = () => {
  return useDeleteRoundMutation();
};