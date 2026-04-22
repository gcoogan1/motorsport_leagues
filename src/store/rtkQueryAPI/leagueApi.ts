import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addLeagueParticipant,
  addLeagueParticipantRole,
  createLeagueSeason,
  followLeagueService,
  getAllLeaguesWithInfo,
  getFollowingLeagues,
  getLeagueFollowersService,
  getLeaguesWithInfoByProfileId,
  getLeaguesWithInfoBySquadId,
  getLeagueParticipantsByLeagueId,
  getLeagueSeasonsByLeagueId,
  isFollowingLeagueService,
  removeLeagueParticipant,
  removeLeagueParticipantRole,
  removeLeagueFollowerService,
  removeLeagueSeason,
  unfollowLeagueService,
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
  FollowLeaguePayload,
  FollowLeagueResult,
  GetLeagueFollowersResult,
  GetLeagueFollowingResult,
  GetLeaguesWithInfoResult,
  GetLeagueParticipantsResult,
  GetLeagueSeasonsResult,
  LeagueWithInfo,
  LeagueTable,
  LeagueParticipantProfile,
  LeagueSeasonTable,
  RemoveLeagueParticipantPayload,
  RemoveLeagueParticipantResult,
  RemoveLeagueFollowerPayload,
  RemoveLeagueFollowerResult,
  RemoveLeagueParticipantRolePayload,
  RemoveLeagueParticipantRoleResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  UnfollowLeaguePayload,
  UnfollowLeagueResult,
  // UpdateLeagueParticipantRolePayload,
  // UpdateLeagueParticipantRoleResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";
import type { ProfileTable } from "@/types/profile.types";

export type LeaguesQueryArgs = {
  accountId?: string;
  search?: string;
  activeTab?: string;
  includeOwnLeagues?: boolean;
};

export const leagueApi = createApi({
  reducerPath: "leagueApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Leagues", "LeagueParticipants", "LeagueSeasons", "LeagueFollowers", "LeagueFollowing"],
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
    followLeague: builder.mutation<FollowLeagueResult, FollowLeaguePayload>({
      queryFn: async (payload) => {
        try {
          const result = await followLeagueService(payload);

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
          return {
            error,
          };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueFollowers", id: payload.leagueId },
        { type: "LeagueFollowing", id: payload.accountId },
      ],
    }),
    getLeagueFollowers: builder.query<ProfileTable[], string>({
      queryFn: async (leagueId) => {
        try {
          const result: GetLeagueFollowersResult = await getLeagueFollowersService(
            leagueId,
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
      providesTags: (_result, _error, leagueId) => [
        { type: "LeagueFollowers", id: leagueId },
      ],
    }),
    getLeagueFollowing: builder.query<LeagueTable[], string>({
      queryFn: async (accountId) => {
        try {
          const result: GetLeagueFollowingResult = await getFollowingLeagues(
            accountId,
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
      providesTags: (_result, _error, accountId) => [
        { type: "LeagueFollowing", id: accountId },
      ],
    }),
    isFollowingLeague: builder.query<boolean, { leagueId: string; accountId: string }>({
      queryFn: async ({ leagueId, accountId }) => {
        try {
          const data = await isFollowingLeagueService(leagueId, accountId);
          return { data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, { leagueId, accountId }) => [
        { type: "LeagueFollowers", id: leagueId },
        { type: "LeagueFollowing", id: accountId },
      ],
    }),
    unfollowLeague: builder.mutation<UnfollowLeagueResult, UnfollowLeaguePayload>({
      queryFn: async (payload) => {
        try {
          const data = await unfollowLeagueService(payload);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueFollowers", id: payload.leagueId },
        { type: "LeagueFollowing", id: payload.accountId },
      ],
    }),
    removeLeagueFollower: builder.mutation<RemoveLeagueFollowerResult, RemoveLeagueFollowerPayload>({
      queryFn: async (payload) => {
        try {
          const data = await removeLeagueFollowerService(payload);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "LeagueFollowers", id: payload.leagueId },
        "LeagueFollowing",
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
  useFollowLeagueMutation,
  useGetLeagueFollowersQuery,
  useGetLeagueFollowingQuery,
  useGetLeaguesQuery,
  useGetParticipantLeaguesQuery,
  useGetLeaguesByProfileIdQuery,
  useGetLeaguesBySquadIdQuery,
  useIsFollowingLeagueQuery,
  useGetLeagueParticipantsQuery,
  useGetLeagueSeasonsQuery,
  useUnfollowLeagueMutation,
  useRemoveLeagueFollowerMutation,
  useRemoveLeagueParticipantMutation,
  useRemoveLeagueParticipantRoleMutation,
  useRemoveLeagueSeasonMutation,
  // useUpdateLeagueParticipantRoleMutation,
  useUpdateLeagueSeasonMutation,
} = leagueApi;