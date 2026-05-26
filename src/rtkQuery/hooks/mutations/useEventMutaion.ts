import {
  useCreateEventMutation,
  useCreateEventDriverMutation,
  useDeleteEventMutation,
  useDeleteEventDriverMutation,
  useDeleteEventDriversByEventIdMutation,
  useDeleteEventsByDivisionIdMutation,
  useDeleteEventsByRoundIdMutation,
  useDeleteEventsBySeasonIdMutation,
  useUpdateEventMutation,
} from "@/rtkQuery/API/eventApi";

// --- Mutations --- //
// Used to modify data //

// Mutation for creating a event.
export const useCreateEvent = () => {
  return useCreateEventMutation();
};

export const useCreateEventDriver = () => {
  return useCreateEventDriverMutation();
};

// Mutation for updating an existing event.
export const useUpdateEvent = () => {
  return useUpdateEventMutation();
};

// Mutation for deleting a event.
export const useDeleteEvent = () => {
  return useDeleteEventMutation();
};

export const useDeleteEventDriver = () => {
  return useDeleteEventDriverMutation();
};

export const useDeleteEventDriversByEventId = () => {
  return useDeleteEventDriversByEventIdMutation();
};

// Mutation for deleting all events associated with a specific round.
export const useDeleteEventsByRoundId = () => {
  return useDeleteEventsByRoundIdMutation();
};

// Mutation for deleting all events associated with a specific division.
export const useDeleteEventsByDivisionId = () => {
  return useDeleteEventsByDivisionIdMutation();
};

// Mutation for deleting all events associated with a specific season.
export const useDeleteEventsBySeasonId = () => {
  return useDeleteEventsBySeasonIdMutation();
};