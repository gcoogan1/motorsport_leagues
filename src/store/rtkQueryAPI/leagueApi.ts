import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addLeagueParticipant,
  createLeagueSeason,
  getLeagueParticipantsByLeagueId,
  getLeagueSeasonsByLeagueId,
  removeLeagueParticipant,
  removeLeagueSeason,
  updateLeagueParticipantRole,
  updateLeagueSeason,
} from "@/services/league.service";
import type {
  AddLeagueParticipantPayload,
  AddLeagueParticipantResult,
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  GetLeagueParticipantsResult,
  GetLeagueSeasonsResult,
  LeagueParticipantProfile,
  LeagueSeasonTable,
  RemoveLeagueParticipantPayload,
  RemoveLeagueParticipantResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  UpdateLeagueParticipantRolePayload,
  UpdateLeagueParticipantRoleResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";

export const leagueApi = createApi({
  reducerPath: "leagueApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["LeagueParticipants", "LeagueSeasons"],
  endpoints: (builder) => ({
    getLeagueParticipants: builder.query<LeagueParticipantProfile[], string>({
      queryFn: async (leagueId, api) => {
        try {
          const result: GetLeagueParticipantsResult =
            await getLeagueParticipantsByLeagueId(leagueId, api.signal);

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
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueParticipants", id: leagueId },
      ],
    }),
    getLeagueSeasons: builder.query<LeagueSeasonTable[], string>({
      queryFn: async (leagueId, api) => {
        try {
          const result: GetLeagueSeasonsResult =
            await getLeagueSeasonsByLeagueId(leagueId, api.signal);

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
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueSeasons", id: leagueId },
      ],
    }),
    addLeagueParticipant: builder.mutation<
      AddLeagueParticipantResult,
      AddLeagueParticipantPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await addLeagueParticipant(payload);

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
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueParticipants", id: payload.leagueId },
      ],
    }),
    createLeagueSeason: builder.mutation<
      CreateLeagueSeasonResult,
      CreateLeagueSeasonPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await createLeagueSeason(payload);

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
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueSeasons", id: payload.leagueId },
      ],
    }),
    updateLeagueParticipantRole: builder.mutation<
      UpdateLeagueParticipantRoleResult,
      UpdateLeagueParticipantRolePayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueParticipantRole(payload);

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
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueParticipants", id: payload.leagueId },
      ],
    }),
    updateLeagueSeason: builder.mutation<
      UpdateLeagueSeasonResult,
      UpdateLeagueSeasonPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await updateLeagueSeason(payload);

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
      invalidatesTags: () => ["LeagueSeasons"],
    }),
    removeLeagueParticipant: builder.mutation<
      RemoveLeagueParticipantResult,
      RemoveLeagueParticipantPayload
    >({
      queryFn: async (payload, api) => {
        try {
          const result = await removeLeagueParticipant(payload, api.signal);

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
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueParticipants", id: payload.leagueId },
      ],
    }),
    removeLeagueSeason: builder.mutation<
      RemoveLeagueSeasonResult,
      RemoveLeagueSeasonPayload
    >({
      queryFn: async (payload, api) => {
        try {
          const result = await removeLeagueSeason(payload, api.signal);

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
      invalidatesTags: () => ["LeagueSeasons"],
    }),
  }),
});

export const {
  useAddLeagueParticipantMutation,
  useCreateLeagueSeasonMutation,
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonsQuery,
  useRemoveLeagueParticipantMutation,
  useRemoveLeagueSeasonMutation,
  useUpdateLeagueParticipantRoleMutation,
  useUpdateLeagueSeasonMutation,
} = leagueApi;