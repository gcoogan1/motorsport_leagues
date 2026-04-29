import {
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  // useMarkAllNotificationsReadMutation,
  // useMarkNotificationReadMutation,
} from "@/rtkQuery/API/notificationApi";

// --- Mutations --- //
// Used to modify data //

// Mutation for creating a notification.
export const useCreateNotification = () => {
  return useCreateNotificationMutation();
};

// Mutation for deleting a notification.
export const useDeleteNotification = () => {
  return useDeleteNotificationMutation();
};

// // Mutation for marking a single notification as read.
// export const useMarkNotificationRead = () => {
//   return useMarkNotificationReadMutation();
// };

// // Mutation for marking all notifications as read for a recipient.
// export const useMarkAllNotificationsRead = () => {
//   return useMarkAllNotificationsReadMutation();
// };
