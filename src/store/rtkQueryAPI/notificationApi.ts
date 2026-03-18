import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createNotification,
  getNotificationsByRecipientId,
  getNotificationsByRecipientIds,
  getUnreadNotificationsCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";
import type {
  CreateNotificationPayload,
  CreateNotificationResult,
  GetNotificationsResult,
  GetUnreadNotificationsCountResult,
  MarkAllNotificationsReadPayload,
  MarkAllNotificationsReadResult,
  MarkNotificationReadPayload,
  MarkNotificationReadResult,
  Notification,
} from "@/types/notification.types";

// -- Notification API -- //

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Notifications", "UnreadNotifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], string>({
      queryFn: async (recipientId) => {
        try {
          const result: GetNotificationsResult =
            await getNotificationsByRecipientId(recipientId);

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
      providesTags: (_result, _error, recipientId) => [
        { type: "Notifications", id: recipientId },
        { type: "UnreadNotifications", id: recipientId },
      ],
    }),
    getNotificationsByRecipientIds: builder.query<Notification[], string[]>({
      queryFn: async (recipientIds) => {
        try {
          const result: GetNotificationsResult =
            await getNotificationsByRecipientIds(recipientIds);

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
      providesTags: (_result, _error, recipientIds) =>
        recipientIds.map((recipientId) => ({
          type: "Notifications" as const,
          id: recipientId,
        })),
    }),
    getUnreadNotificationsCount: builder.query<number, string>({
      queryFn: async (recipientId) => {
        try {
          const result: GetUnreadNotificationsCountResult =
            await getUnreadNotificationsCount(recipientId);

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
      providesTags: (_result, _error, recipientId) => [
        { type: "UnreadNotifications", id: recipientId },
      ],
    }),
    createNotification: builder.mutation<
      CreateNotificationResult,
      CreateNotificationPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await createNotification(payload);

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
        { type: "Notifications", id: payload.recipient_profile_id },
        { type: "UnreadNotifications", id: payload.recipient_profile_id },
      ],
    }),
    markNotificationRead: builder.mutation<
      MarkNotificationReadResult,
      MarkNotificationReadPayload & { recipientProfileId: string }
    >({
      queryFn: async ({ notificationId }) => {
        try {
          const result = await markNotificationRead({ notificationId });

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
        { type: "Notifications", id: payload.recipientProfileId },
        { type: "UnreadNotifications", id: payload.recipientProfileId },
      ],
    }),
    markAllNotificationsRead: builder.mutation<
      MarkAllNotificationsReadResult,
      MarkAllNotificationsReadPayload
    >({
      queryFn: async (payload) => {
        try {
          const result = await markAllNotificationsRead(payload);

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
        { type: "Notifications", id: payload.recipientProfileId },
        { type: "UnreadNotifications", id: payload.recipientProfileId },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationsByRecipientIdsQuery,
  useGetUnreadNotificationsCountQuery,
  useCreateNotificationMutation,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
