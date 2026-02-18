import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FollowProfileVariables,
  GetProfilesResult,
  ProfileTable,
  UnfollowProfileVariables,
} from "@/types/profile.types";
import {
  followProfileService,
  getAllProfiles,
  getFollowersService,
  getFollowingService,
  isFollowingService,
  unfollowProfileService,
} from "@/services/profile.service";

// -- Profile API -- //

// RTK Query API slice for profile-related operations, including fetching profiles, followers, following, and follow/unfollow actions.

export type ProfilesQueryArgs = {
  userId?: string;
  search?: string;
  activeTab?: string;
};

export type IsFollowingArgs = {
  userId: string;
  profileId: string;
};


export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Profiles", "Followers", "Following", "IsFollowing"],
  endpoints: (builder) => ({
    getProfiles: builder.query<ProfileTable[], ProfilesQueryArgs>({
      queryFn: async ({ userId, search }, api) => {
        const result: GetProfilesResult = await getAllProfiles(
          userId,
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
      },
      providesTags: (_result, _error, args) => [
        { type: "Profiles", id: `${args.activeTab ?? "all"}-${args.search ?? ""}` },
      ],
    }),
    getFollowers: builder.query<ProfileTable[], string>({
      queryFn: async (profileId) => {
        const result = await getFollowersService(profileId);

        if (!result.success) {
          return {
            error: {
              status: result?.error?.status,
              data: result?.error,
            },
          };
        }

        return { data: result.data };
      },
      providesTags: (_result, _error, profileId) => [
        { type: "Followers", id: profileId },
      ],
    }),
    getFollowing: builder.query<ProfileTable[], string>({
      queryFn: async (userId) => {
        const result = await getFollowingService(userId);

        if (!result.success) {
          return {
            error: {
              status: result?.error?.status,
              data: result?.error,
            },
          };
        }

        return { data: result.data };
      },
      providesTags: (_result, _error, userId) => [
        { type: "Following", id: userId },
      ],
    }),
    isFollowing: builder.query<boolean, IsFollowingArgs>({
      queryFn: async ({ userId, profileId }) => {
        try {
          const data = await isFollowingService(userId, profileId);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_result, _error, args) => [
        { type: "IsFollowing", id: `${args.userId}-${args.profileId}` },
      ],
    }),
    followProfile: builder.mutation<boolean, FollowProfileVariables>({
      queryFn: async (variables) => {
        try {
          const data = await followProfileService(variables);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, variables) => [
        { type: "Followers", id: variables.followingProfileId },
        { type: "Following", id: variables.userId },
        { type: "IsFollowing", id: `${variables.userId}-${variables.followingProfileId}` },
      ],
    }),
    unfollowProfile: builder.mutation<boolean, UnfollowProfileVariables>({
      queryFn: async (variables) => {
        try {
          const data = await unfollowProfileService(variables);
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (_result, _error, variables) => [
        { type: "Followers", id: variables.followingProfileId },
        { type: "Following", id: variables.userId },
        { type: "IsFollowing", id: `${variables.userId}-${variables.followingProfileId}` },
      ],
    }),
  }),
});

export const {
  useGetProfilesQuery,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useIsFollowingQuery,
  useFollowProfileMutation,
  useUnfollowProfileMutation,
} = profileApi;
