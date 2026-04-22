import { z } from "zod";

export const followLeagueSchema = z.object({
  profile_following: z
    .string()
    .min(1, "Please select a profile to follow this league."),
});

export type FollowLeagueFormValues = z.infer<typeof followLeagueSchema>;