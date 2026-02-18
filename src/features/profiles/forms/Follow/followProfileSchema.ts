import { z } from "zod";

export const followProfileSchema = z.object({
  follow_profile: z
    .string()
    .min(1, "Please select a profile to follow"), // Error if field is an empty string ("")
});

export type FollowProfileFormValues = z.infer<typeof followProfileSchema>;
