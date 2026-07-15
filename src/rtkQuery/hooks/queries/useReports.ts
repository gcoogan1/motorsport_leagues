import {
  useGetDecisionByIdQuery,
  useGetDecisionsBySeasonIdQuery,
  useGetTicketByIdQuery,
  useGetTicketsBySeasonIdQuery,
} from "@/rtkQuery/API/reportsApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch a single ticket by id
export const useTicket = (ticketId?: string) =>
  useGetTicketByIdQuery(ticketId ?? "", {
    skip: !ticketId,
  });

// Query to fetch all tickets by season id
export const useTicketsBySeasonId = (seasonId?: string) =>
  useGetTicketsBySeasonIdQuery(seasonId ?? "", {
    skip: !seasonId,
  });

// Query to fetch a single decision by id
export const useDecision = (decisionId?: string) =>
  useGetDecisionByIdQuery(decisionId ?? "", {
    skip: !decisionId,
  });

// Query to fetch all decisions by season id
export const useDecisionsBySeasonId = (seasonId?: string) =>
  useGetDecisionsBySeasonIdQuery(seasonId ?? "", {
    skip: !seasonId,
  });
