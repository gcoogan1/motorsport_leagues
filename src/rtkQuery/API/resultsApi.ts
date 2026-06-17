import {
  createResult,
  deleteResult,
  getResultById,
  getResultPerSessionId,
  getResultsByDivisionId,
  getResultsByEventId,
  getResultsByRoundId,
  getResultsPerDriverId,
  getResultsPerTeamId,
  getResultsWithDetailsByDriverId,
  getResultsWithDetailsPerTeamId,
  updateResult,
} from "@/services/event/results.service";
import type {
  CreateResultsPayload,
  CreateResultsResponse,
  GetJoinedResultsResponse,
  GetResultResponse,
  GetResultsResponse,
  NormalizedResultsTable,
  ResultsTable,
  UpdateResultsPayload,
  UpdateResultsResponse,
} from "@/types/results.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const resultsApi = createApi({
  reducerPath: "resultsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Result"],
  endpoints: (builder) => ({
    getResultById: builder.query<ResultsTable, string>({
      queryFn: async (resultId) => {
        try {
          const result: GetResultResponse = await getResultById(resultId);

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
      providesTags: (_result, _error, resultId) => [
        { type: "Result", id: resultId },
      ],
    }),
    getResultsBySessionId: builder.query<ResultsTable[], string>({
      queryFn: async (sessionId) => {
        try {
          const result: GetResultsResponse = await getResultPerSessionId(sessionId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    getResultsByEventId: builder.query<ResultsTable[], string>({
      queryFn: async (eventId) => {
        try {
          const result: GetResultsResponse = await getResultsByEventId(eventId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    getResultsByDivisionId: builder.query<ResultsTable[], string>({
      queryFn: async (divisionId) => {
        try {
          const result: GetResultsResponse = await getResultsByDivisionId(divisionId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    getResultsByRoundId: builder.query<ResultsTable[], string>({
      queryFn: async (roundId) => {
        try {
          const result: GetResultsResponse = await getResultsByRoundId(roundId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    getResultsByDriverId: builder.query<ResultsTable[], string>({
      queryFn: async (driverId) => {
        try {
          const result: GetResultsResponse = await getResultsPerDriverId(driverId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    getResultsByTeamId: builder.query<ResultsTable[], string>({
      queryFn: async (teamId) => {
        try {
          const result: GetResultsResponse = await getResultsPerTeamId(teamId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    // Fetches a driver's results with round, track, and team data joined in
    // a single query. Qualifying sessions are already excluded by the service.
    getResultsWithDetailsByDriverId: builder.query<NormalizedResultsTable[], string>({
      queryFn: async (driverId) => {
        try {
          const result: GetJoinedResultsResponse =
            await getResultsWithDetailsByDriverId(driverId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    // Fetches a driver's results with round, track, and team data joined in
    // a single query. Qualifying sessions are already excluded by the service.
    getResultsWithDetailsByTeamId: builder.query<NormalizedResultsTable[], string>({
      queryFn: async (teamId) => {
        try {
          const result: GetJoinedResultsResponse =
            await getResultsWithDetailsPerTeamId(teamId);

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
      providesTags: (result) =>
        result?.map((item) => ({ type: "Result" as const, id: item.id })) ?? [],
    }),
    createResult: builder.mutation<ResultsTable, CreateResultsPayload>({
      queryFn: async (payload) => {
        try {
          const result: CreateResultsResponse = await createResult(payload);

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
      invalidatesTags: (result) =>
        result ? [{ type: "Result", id: result.id }] : ["Result"],
    }),
    updateResult: builder.mutation<ResultsTable, { id: string; payload: UpdateResultsPayload }>({
      queryFn: async ({ id, payload }) => {
        try {
          const result: UpdateResultsResponse = await updateResult(id, payload);

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
      invalidatesTags: (_result, _error, { id }) => [{ type: "Result", id }],
    }),
    deleteResult: builder.mutation<boolean, string>({
      queryFn: async (id) => {
        try {
          const result = await deleteResult(id);

          if (!result.success) {
            return {
              error: {
                status: result.error.status,
                data: result.error,
              },
            };
          }

          return { data: true };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, id) => [{ type: "Result", id }],
    }),
  }),
});

export const {
  useGetResultByIdQuery,
  useGetResultsBySessionIdQuery,
  useGetResultsByEventIdQuery,
  useGetResultsByDivisionIdQuery,
  useGetResultsByRoundIdQuery,
  useGetResultsByDriverIdQuery,
  useGetResultsByTeamIdQuery,
  useGetResultsWithDetailsByDriverIdQuery,
  useGetResultsWithDetailsByTeamIdQuery,
  useCreateResultMutation,
  useUpdateResultMutation,
  useDeleteResultMutation,
} = resultsApi;
