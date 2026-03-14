import { z } from "zod";

export const inviteSchema = z.object({
  invitees: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        isEmail: z.boolean().optional(),
        profileId: z.string().optional(),
        accountId: z.string().optional(),
      }).passthrough()
    )
    .min(1, "Please enter a valid Profile username or email address.")
    .max(6, "You can only invite 6 people at once."),
});