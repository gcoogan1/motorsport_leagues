import { z } from "zod";

export const joinLeagueSchema = z.object({
  profile_joining: z
    .string()
    .min(1, "Please select a profile to join this league."),
});

export type JoinLeagueFormValues = z.infer<typeof joinLeagueSchema>;