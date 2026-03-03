import { z } from "zod";

export const followSquadSchema = z.object({
  profile_following: z
    .string()
    .min(1, "Please select a profile to follow this squad."),
});

export type FollowSquadFormValues = z.infer<typeof followSquadSchema>;