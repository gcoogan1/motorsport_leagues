import { z } from "zod";

export const confirmDeleteLeagueSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "delete league", {
      message: "Please type in “delete league” to confirm.",
    }),
});

export type ConfirmDeleteLeagueSchema = z.infer<typeof confirmDeleteLeagueSchema>;