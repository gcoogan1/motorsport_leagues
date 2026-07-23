// --- Mutations --- //
// Used to modify data //

import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "@/rtkQuery/API/announcementsApi";

export const useCreateAnnouncement = () => {
  return useCreateAnnouncementMutation();
};

export const useUpdateAnnouncement = () => {
  return useUpdateAnnouncementMutation();
};

export const useDeleteAnnouncement = () => {
  return useDeleteAnnouncementMutation();
};
