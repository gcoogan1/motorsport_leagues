import { z } from "zod";

export const confirmDeleteProfileSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "delete profile", {
      message: "Please type in “delete profile” to confirm.",
    }),
});

export type ConfirmDeleteProfileSchema = z.infer<typeof confirmDeleteProfileSchema>;