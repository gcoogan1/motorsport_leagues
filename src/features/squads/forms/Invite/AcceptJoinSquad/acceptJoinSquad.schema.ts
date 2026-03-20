import { z } from "zod";

export const joinSquadSchema = z.object({
  profile_joining: z
    .string()
    .min(1, "Please select a profile to join this squad."),
});

export type JoinSquadFormValues = z.infer<typeof joinSquadSchema>;