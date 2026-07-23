import {
  getAnnouncementById,
  getAnnouncementsByLeagueId,
  getAnnouncementsBySeasonId,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/services/announcement.service";
import type {
  Announcement,
  CreateAnnouncementPayload,
  GetAnnouncementByIdResponse,
  GetAnnouncementsByIdResponse,
  UpdateAnnouncementPayload,
} from "@/types/announcements";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const announcementsApi = createApi({
  reducerPath: "announcementsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Announcement"],
  endpoints: (builder) => ({
    getAnnouncementById: builder.query<Announcement, string>({
      queryFn: async (announcementId) => {
        try {
          const result: GetAnnouncementByIdResponse = await getAnnouncementById({
            announcementId,
          });

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
      providesTags: (_result, _error, announcementId) => [
        { type: "Announcement", id: announcementId },
      ],
    }),

    getAnnouncementsByLeagueId: builder.query<Announcement[], string>({
      queryFn: async (leagueId) => {
        try {
          const result: GetAnnouncementsByIdResponse =
            await getAnnouncementsByLeagueId({ leagueId });

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
        result?.map((item) => ({ type: "Announcement" as const, id: item.id })) ?? [],
    }),

    getAnnouncementsBySeasonId: builder.query<Announcement[], string>({
      queryFn: async (seasonId) => {
        try {
          const result: GetAnnouncementsByIdResponse =
            await getAnnouncementsBySeasonId({ seasonId });

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
        result?.map((item) => ({ type: "Announcement" as const, id: item.id })) ?? [],
    }),

    createAnnouncement: builder.mutation<Announcement, CreateAnnouncementPayload>({
      queryFn: async (payload) => {
        try {
          const result: GetAnnouncementByIdResponse = await createAnnouncement(payload);

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
        result
          ? [
              { type: "Announcement", id: result.id },
              { type: "Announcement", id: result.league_id },
              { type: "Announcement", id: result.season_id },
            ]
          : ["Announcement"],
    }),

    updateAnnouncement: builder.mutation<
      Announcement,
      UpdateAnnouncementPayload
    >({
      queryFn: async (payload) => {
        try {
          const result: GetAnnouncementByIdResponse = await updateAnnouncement(
            payload,
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
      invalidatesTags: (_result, _error, payload) => [
        { type: "Announcement", id: payload.announcementId },
      ],
    }),

    deleteAnnouncement: builder.mutation<boolean, string>({
      queryFn: async (announcementId) => {
        try {
          const result = await deleteAnnouncement({ announcementId });

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
      invalidatesTags: (_result, _error, announcementId) => [
        { type: "Announcement", id: announcementId },
      ],
    }),
  }),
});

export const {
  useGetAnnouncementByIdQuery,
  useGetAnnouncementsByLeagueIdQuery,
  useGetAnnouncementsBySeasonIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApi;
