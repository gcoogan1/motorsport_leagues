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
  useCreateEventCarDetailsMutation,
  useCreateEventTrackDetailsMutation,
  useDeleteEventTracksByEventIdMutation,
  useUpdateEventCarDetailsMutation,
  useUpdateEventTrackDetailsMutation,
  useDeleteEventCarsByEventIdMutation,
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

// Mutaion for creating track details for an event
export const useCreateEventTrackDetails = () => {
  return useCreateEventTrackDetailsMutation();
};

// Mutation for creating car details for an event
export const useCreateEventCarDetails = () => {
  return useCreateEventCarDetailsMutation();
};

// Mutation for updating track details for an event
export const useUpdateEventTrackDetails = () => {
  return useUpdateEventTrackDetailsMutation();
};

// Mutation for updating car details for an event
export const useUpdateEventCarDetails = () => {
  return useUpdateEventCarDetailsMutation();
};

// Mutation for deleting track details for an event
export const useDeleteEventTracksByEventId = () => {
  return useDeleteEventTracksByEventIdMutation();
};

// Mutation for deleting car details for an event
export const useDeleteEventCarDetailsByEventId = () => {
  return useDeleteEventCarsByEventIdMutation();
}