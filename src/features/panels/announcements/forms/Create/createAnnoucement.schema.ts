import z from "zod";

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const announcementSchema = z.object({
  title: z.string().min(1, "Please enter a title for your announcement.").max(
    64,
    "Title cannot be longer than 64 characters.",
  ),
  message: z.string().min(1, "Please enter a message for your announcement.").max(
    1000,
    "Announcement cannot be longer than 1,000 characters.",
  )
});
