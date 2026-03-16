import {
  addMemberToSquad,
  followSquadService,
  getAllSquads,
  getSquadsByFounderProfileId,
  getFollowingSquads,
  getSquadFollowersService,
  getSquadMembersBySquadId,
  isFollowingSquadService,
  removeSquadFollowerService,
  unfollowSquadService,
} from "@/services/squad.service";
import type {
  AddSquadMemberPayload,
  AddSquadMemberResult,
  GetSquadMembersResult,
  GetSquadFollowingResult,
  GetSquadsResult,
  SquadMemberProfile,
  SquadTable,
  FollowSquadPayload,
  FollowSquadResult,
  UnfollowSquadPayload,
  UnfollowSquadResult,
  RemoveSquadFollowerResult,
  RemoveSquadFollowerPayload,
} from "@/types/squad.types";
import type { GetFollowersResult, ProfileTable } from "@/types/profile.types";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";


export type SquadQueryArgs = {
  founderAccountId?: string;
  search?: string;
  activeTab?: string;
}

export const squadApi = createApi({
  reducerPath: "squadApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Squads", "SquadMembers", "SquadFollowers", "SquadFollowing"],
  endpoints: (builder) => ({
    getSquads: builder.query<SquadTable[], SquadQueryArgs>({
      queryFn: async ({ founderAccountId, search }, api) => {
        try {
          const result: GetSquadsResult = await getAllSquads(
            founderAccountId,
            search,
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
      providesTags: (_result, _error, args) => [
        { type: "Squads", id: `${args.activeTab ?? "all"}-${args.search ?? ""}` },
      ],
    }),
    getSquadsByFounderProfileId: builder.query<SquadTable[], string>({
      queryFn: async (profileId, api) => {
        try {
          const result: GetSquadsResult = await getSquadsByFounderProfileId(
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
        { type: "Squads", id: `profile-${profileId}` },
      ],
    }),
    getSquadMembers: builder.query<SquadMemberProfile[], string>({
      queryFn: async (squadId, api) => {
        try {
          const result: GetSquadMembersResult = await getSquadMembersBySquadId(
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
        { type: "SquadMembers", id: squadId },
      ],
    }),
    addSquadMember: builder.mutation<AddSquadMemberResult, AddSquadMemberPayload>({
      queryFn: async (payload) => {
        try {
          const result = await addMemberToSquad(payload);

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
        { type: "SquadMembers", id: payload.squadId },
        "Squads",
      ],
    }),
    followSquad: builder.mutation<FollowSquadResult, FollowSquadPayload>({
      queryFn: async (payload) => {
        try {
          const result = await followSquadService(payload);

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
        { type: "SquadFollowers", id: payload.squadId },
        { type: "SquadFollowing", id: payload.accountId },
      ],
    }),
    getSquadFollowers: builder.query<ProfileTable[], string>({
      queryFn: async (squadId) => {
        try {
          const result: GetFollowersResult = await getSquadFollowersService(
            squadId,
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
        { type: "SquadFollowers", id: squadId },
      ],
    }),
    getSquadFollowing: builder.query<SquadTable[], string>({
      queryFn: async (accountId) => {
        try {
          const result: GetSquadFollowingResult = await getFollowingSquads(
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
        { type: "SquadFollowing", id: accountId },
      ],
    }),
    isFollowingSquad: builder.query<boolean, { squadId: string, accountId: string }>({
      queryFn: async ({ squadId, accountId }) => {
        try {
          const data = await isFollowingSquadService(squadId, accountId);
          return { data };
        } catch (error) {
          return {
            error,
          };
        }
      },
      providesTags: (_result, _error, { squadId, accountId }) => [
        { type: "SquadFollowers", id: squadId },
        { type: "SquadFollowing", id: accountId },
      ],
    }),
    unfollowSquad: builder.mutation<UnfollowSquadResult, UnfollowSquadPayload>({
      queryFn: async (payload) => {
        try {
          const data = await unfollowSquadService(payload);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "SquadFollowers", id: payload.squadId },
        { type: "SquadFollowing", id: payload.accountId },
      ],
    }),
    removeSquadFollower: builder.mutation<RemoveSquadFollowerResult, RemoveSquadFollowerPayload>({
      queryFn: async (payload) => {
        try {
          const data = await removeSquadFollowerService(payload);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, payload) => [
        { type: "SquadFollowers", id: payload.squadId },
        "SquadFollowing",
      ],
    }),
  }),
});

export const {
  useGetSquadsQuery,
  useGetSquadsByFounderProfileIdQuery,
  useGetSquadMembersQuery,
  useAddSquadMemberMutation,
  useGetSquadFollowersQuery,
  useGetSquadFollowingQuery,
  useFollowSquadMutation,
  useIsFollowingSquadQuery,
  useUnfollowSquadMutation,
  useRemoveSquadFollowerMutation,
} = squadApi;