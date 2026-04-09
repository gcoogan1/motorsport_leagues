import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addLeagueParticipant,
  getLeagueParticipantsByLeagueId,
  removeLeagueParticipant,
  updateLeagueParticipantRole,
} from "@/services/league.service";
import type {
  AddLeagueParticipantPayload,
  AddLeagueParticipantResult,
  GetLeagueParticipantsResult,
  LeagueParticipantProfile,
  RemoveLeagueParticipantPayload,
  RemoveLeagueParticipantResult,
  UpdateLeagueParticipantRolePayload,
  UpdateLeagueParticipantRoleResult,
} from "@/types/league.types";

export const leagueApi = createApi({
  reducerPath: "leagueApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["LeagueParticipants"],
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
  }),
});

export const {
  useAddLeagueParticipantMutation,
  useGetLeagueParticipantsQuery,
  useRemoveLeagueParticipantMutation,
  useUpdateLeagueParticipantRoleMutation,
} = leagueApi;