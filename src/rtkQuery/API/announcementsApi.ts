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
      providesTags: (result, _error, leagueId) => [
        { type: "Announcement", id: `league-${leagueId}` },
        ...(result?.map((item) => ({ type: "Announcement" as const, id: item.id })) ?? []),
      ],
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
      providesTags: (result, _error, seasonId) => [
        { type: "Announcement", id: `season-${seasonId}` },
        ...(result?.map((item) => ({ type: "Announcement" as const, id: item.id })) ?? []),
      ],
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
      invalidatesTags: (result, _error, payload) =>
        result
          ? [
              { type: "Announcement", id: result.id },
              { type: "Announcement", id: `season-${payload.seasonId}` },
              { type: "Announcement", id: `league-${payload.leagueId}` },
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
      invalidatesTags: (result, _error, payload) => [
        { type: "Announcement", id: payload.announcementId },
        result ? { type: "Announcement", id: `season-${result.season_id}` } : undefined,
        result ? { type: "Announcement", id: `league-${result.league_id}` } : undefined,
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
      invalidatesTags: [{ type: "Announcement" }],
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
