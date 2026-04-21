import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addLeagueParticipant,
  addLeagueParticipantRole,
  createLeagueSeason,
  getAllLeaguesWithInfo,
  getLeaguesWithInfoByProfileId,
  getLeaguesWithInfoBySquadId,
  getLeagueParticipantsByLeagueId,
  getLeagueSeasonsByLeagueId,
  removeLeagueParticipant,
  removeLeagueParticipantRole,
  removeLeagueSeason,
  // updateLeagueParticipantRole,
  updateLeagueSeason,
} from "@/services/league.service";
import type {
  AddLeagueParticipantPayload,
  AddLeagueParticipantResult,
  AddLeagueParticipantRolePayload,
  AddLeagueParticipantRoleResult,
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  GetLeaguesWithInfoResult,
  GetLeagueParticipantsResult,
  GetLeagueSeasonsResult,
  LeagueWithInfo,
  LeagueParticipantProfile,
  LeagueSeasonTable,
  RemoveLeagueParticipantPayload,
  RemoveLeagueParticipantResult,
  RemoveLeagueParticipantRolePayload,
  RemoveLeagueParticipantRoleResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  // UpdateLeagueParticipantRolePayload,
  // UpdateLeagueParticipantRoleResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";

export type LeaguesQueryArgs = {
  accountId?: string;
  search?: string;
  activeTab?: string;
  includeOwnLeagues?: boolean;
};

export const leagueApi = createApi({
  reducerPath: "leagueApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Leagues", "LeagueParticipants", "LeagueSeasons"],
  endpoints: (builder) => ({
    getLeagues: builder.query<LeagueWithInfo[], LeaguesQueryArgs>({
      queryFn: async ({ accountId, search, includeOwnLeagues }, api) => {
        try {
          const result: GetLeaguesWithInfoResult = await getAllLeaguesWithInfo(
            accountId,
            search,
            api.signal,
            includeOwnLeagues,
          );

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
      providesTags: (_result, _error, args) => [
        {
          type: "Leagues",
          id: `leagues-${args.activeTab ?? "all"}-${args.search ?? ""}-${args.includeOwnLeagues ? "include-own" : "exclude-own"}`,
        },
      ],
    }),
    getParticipantLeagues: builder.query<LeagueWithInfo[], string>({
      queryFn: async (accountId, api) => {
        try {
          const result: GetLeaguesWithInfoResult = await getAllLeaguesWithInfo(
            accountId,
            undefined,
            api.signal,
            true, // includeOwnLeagues is true to get leagues where the user is a participant
          );

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
      providesTags: (_result, _error, accountId) => [
        { type: "Leagues", id: `participant-leagues-${accountId}` },
      ],
    }),
    getLeaguesByProfileId: builder.query<LeagueWithInfo[], string>({
      queryFn: async (profileId, api) => {
        try {
          const result: GetLeaguesWithInfoResult = await getLeaguesWithInfoByProfileId(
            profileId,
            api.signal,
          );

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
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, profileId) => [
        { type: "Leagues", id: `profile-${profileId}` },
      ],
    }),
    getLeaguesBySquadId: builder.query<LeagueWithInfo[], string>({
      queryFn: async (squadId, api) => {
        try {
          const result: GetLeaguesWithInfoResult = await getLeaguesWithInfoBySquadId(
            squadId,
            api.signal,
          );

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
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, squadId) => [
        { type: "Leagues", id: `squad-${squadId}` },
      ],
    }),
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
    addLeagueParticipantRole: builder.mutation<
      AddLeagueParticipantRoleResult,
      AddLeagueParticipantRolePayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await addLeagueParticipantRole(payload);

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
      invalidatesTags: () => ["LeagueParticipants"],
    }),
    removeLeagueParticipantRole: builder.mutation<
      RemoveLeagueParticipantRoleResult,
      RemoveLeagueParticipantRolePayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await removeLeagueParticipantRole(payload);

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
      invalidatesTags: () => ["LeagueParticipants"],
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
    // updateLeagueParticipantRole: builder.mutation<
    //   UpdateLeagueParticipantRoleResult,
    //   UpdateLeagueParticipantRolePayload
    // >({
    //   queryFn: async (payload) => {
    //     try {
    //       const result = await updateLeagueParticipantRole(payload);

    //       if (!result.success) {
    //         return {
    //           error: {
    //             status: result.error.status,
    //             data: result.error,
    //           },
    //         };
    //       }

    //       return { data: result };
    //     } catch (error) {
    //       return { error };
    //     }
    //   },
    //   invalidatesTags: (_result, _error, payload) => [
    //     { type: "LeagueParticipants", id: payload.leagueId },
    //   ],
    // }),
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
  useAddLeagueParticipantRoleMutation,
  useCreateLeagueSeasonMutation,
  useGetLeaguesQuery,
  useGetParticipantLeaguesQuery,
  useGetLeaguesByProfileIdQuery,
  useGetLeaguesBySquadIdQuery,
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonsQuery,
  useRemoveLeagueParticipantMutation,
  useRemoveLeagueParticipantRoleMutation,
  useRemoveLeagueSeasonMutation,
  // useUpdateLeagueParticipantRoleMutation,
  useUpdateLeagueSeasonMutation,
} = leagueApi;