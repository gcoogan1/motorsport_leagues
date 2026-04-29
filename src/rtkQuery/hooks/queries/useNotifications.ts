import {
  useGetNotificationsByRecipientIdsQuery,
  useGetNotificationsQuery,
  useGetUnreadNotificationsCountQuery,
} from "@/rtkQuery/API/notificationApi";

// --- Queries --- //
// Used to fetch data //

export const useAllNotifications = (recipientIds: string[] = []) =>
  useGetNotificationsByRecipientIdsQuery(recipientIds, {
    skip: recipientIds.length === 0,
  });

// Query to fetch notifications for the current recipient account
export const useNotifications = (recipientId?: string) =>
  useGetNotificationsQuery(recipientId ?? "", {
    skip: !recipientId,
  });

// Query to fetch unread notification count for the current recipient account
export const useUnreadNotificationsCount = (recipientId?: string) =>
  useGetUnreadNotificationsCountQuery(recipientId ?? "", {
    skip: !recipientId,
  });
