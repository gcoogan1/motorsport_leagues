import {
  createTicket,
  deleteTicket,
  getTicketById,
  getTicketsBySeasonId,
  createDecision,
  deleteDecision,
  getDecisionById,
  getDecisionsBySeasonID,
  updateDecision,
} from "@/services/reports/reports.service";
import type {
  CreateTicketPayload,
  GetTicketByIdResponse,
  GetTicketsBySeasonIdResponse,
  TicketsTable,
  DecisionsTable,
  CreateDecisionPayload,
  UpdateDecisionPayload,
  GetDecisionByIdResponse,
  GetDecisionsBySeasonIDResponse,
  DeleteTicketResponse,
  DeleteDecisionResponse,
} from "@/types/reports.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Ticket", "Decision"],
  endpoints: (builder) => ({
    // Ticket endpoints - Queries
    getTicketById: builder.query<TicketsTable, string>({
      queryFn: async (ticketId) => {
        try {
          const result: GetTicketByIdResponse = await getTicketById(ticketId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, ticketId) => [
        { type: "Ticket", id: ticketId },
      ],
    }),
    getTicketsBySeasonId: builder.query<TicketsTable[], string>({
      queryFn: async (seasonId) => {
        try {
          const result: GetTicketsBySeasonIdResponse =
            await getTicketsBySeasonId(seasonId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, seasonId) => [
        { type: "Ticket", id: `season-${seasonId}` },
      ],
    }),
    // Ticket endpoints - Mutations
    createTicket: builder.mutation<TicketsTable, CreateTicketPayload>({
      queryFn: async (payload) => {
        try {
          const result = await createTicket(payload);
          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }
          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "Ticket", id: `season-${payload.seasonId}` },
      ],
    }),
    deleteTicket: builder.mutation<DeleteTicketResponse, string>({
      queryFn: async (ticketId) => {
        try {
          const result = await deleteTicket(ticketId);
          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }
          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [{ type: "Ticket" }],
    }),

    // Decision endpoints - Queries
    getDecisionById: builder.query<DecisionsTable, string>({
      queryFn: async (decisionId) => {
        try {
          const result: GetDecisionByIdResponse = await getDecisionById(decisionId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, decisionId) => [
        { type: "Decision", id: decisionId },
      ],
    }),
    getDecisionsBySeasonId: builder.query<DecisionsTable[], string>({
      queryFn: async (seasonId) => {
        try {
          const result: GetDecisionsBySeasonIDResponse =
            await getDecisionsBySeasonID(seasonId);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, seasonId) => [
        { type: "Decision", id: `season-${seasonId}` },
      ],
    }),

    // Decision endpoints - Mutations
    createDecision: builder.mutation<DecisionsTable, CreateDecisionPayload>({
      queryFn: async (payload) => {
        try {
          const result = await createDecision(payload);
          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }
          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "Decision", id: `season-${payload.seasonId}` },
        { type: "Ticket" },
      ],
    }),
    updateDecision: builder.mutation<DecisionsTable, UpdateDecisionPayload>({
      queryFn: async (payload) => {
        try {
          const result = await updateDecision(payload);
          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }
          return { data: result.data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "Decision", id: `season-${payload.seasonId}` },
        { type: "Decision", id: payload.decisionId },
      ],
    }),
    deleteDecision: builder.mutation<DeleteDecisionResponse, string>({
      queryFn: async (decisionId) => {
        try {
          const result = await deleteDecision(decisionId);
          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }
          return { data: result };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [{ type: "Decision" }, { type: "Ticket" }],
    }),
  }),
});

export const {
  useGetTicketByIdQuery,
  useGetTicketsBySeasonIdQuery,
  useCreateTicketMutation,
  useDeleteTicketMutation,
  useGetDecisionByIdQuery,
  useGetDecisionsBySeasonIdQuery,
  useCreateDecisionMutation,
  useUpdateDecisionMutation,
  useDeleteDecisionMutation,
} = reportsApi;
