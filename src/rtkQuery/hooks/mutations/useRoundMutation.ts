import {
  useCreateRoundMutation,
  useDeleteRoundMutation,
  useDeleteRoundsByDivisionIdMutation,
  useDeleteRoundsBySeasonIdMutation,
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

// Mutation for deleting all rounds associated with a specific division.
export const useDeleteRoundsByDivisionId = () => {
  return useDeleteRoundsByDivisionIdMutation();
};

// Mutation for deleting all rounds associated with a specific season.
export const useDeleteRoundsBySeasonId = () => {
  return useDeleteRoundsBySeasonIdMutation();
};