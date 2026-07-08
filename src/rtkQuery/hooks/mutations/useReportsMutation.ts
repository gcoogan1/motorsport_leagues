import { useCreateDecisionMutation, useCreateTicketMutation, useDeleteDecisionMutation, useDeleteTicketMutation } from "@/rtkQuery/API/reportsApi";


// --- Mutations --- //
// Used to modify data //


// Mutation for creating a ticket
export const useCreateTicket = () => {
  return useCreateTicketMutation();
};

// Mutation for deleting a ticket
export const useDeleteTicket = () => {
  return useDeleteTicketMutation();
};

// Mutation for creating a decision
export const useCreateDecision = () => {
  return useCreateDecisionMutation();
};

// Mutation for deleting a decision
export const useDeleteDecision = () => {
  return useDeleteDecisionMutation();
};