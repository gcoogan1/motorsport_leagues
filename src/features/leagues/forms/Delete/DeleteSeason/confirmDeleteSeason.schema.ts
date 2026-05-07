import { z } from "zod";

export const confirmDeleteSeasonSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "delete season", {
      message: "Please type in “delete season” to confirm.",
    }),
});

export type ConfirmDeleteSeasonSchema = z.infer<typeof confirmDeleteSeasonSchema>;