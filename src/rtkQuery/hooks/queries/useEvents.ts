import {
  useGetEventByIdQuery,
  useGetEventDriversByDivisionIdQuery,
  useGetEventDriversByEventIdQuery,
  useGetEventsByDivisionIdQuery,
  useGetEventsBySeasonIdQuery,
  useGetEventTrackDetailsByEventIdQuery,
  useGetEventCarDetailsByEventIdQuery,
} from "@/rtkQuery/API/eventApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch a single event by id
export const useEvent = (eventId?: string) =>
  useGetEventByIdQuery(eventId ?? "", {
    skip: !eventId,
  });

// Query to fetch all events for a division
export const useEvents = (divisionId?: string) =>
  useGetEventsByDivisionIdQuery(divisionId ?? "", {
    skip: !divisionId,
  });

// Query to fetch all events for a season
export const useEventsBySeason = (seasonId?: string) =>
  useGetEventsBySeasonIdQuery(seasonId ?? "", {
    skip: !seasonId,
  });

export const useEventDriversByDivision = (divisionId?: string) =>
  useGetEventDriversByDivisionIdQuery(divisionId ?? "", {
    skip: !divisionId,
  });

export const useEventDrivers = (eventId?: string) =>
  useGetEventDriversByEventIdQuery(eventId ?? "", {
    skip: !eventId,
  });

  // Query to fetch track details for an event
export const useEventTrackDetails = (eventId?: string) =>
  useGetEventTrackDetailsByEventIdQuery(eventId ?? "", {
    skip: !eventId,
  });

  // Query to fetch ALL car details for an event
export const useAllEventCarDetails = (eventId?: string) =>
  useGetEventCarDetailsByEventIdQuery(eventId ?? "", {
    skip: !eventId,
  });
