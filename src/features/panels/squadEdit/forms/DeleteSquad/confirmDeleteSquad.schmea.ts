import { z } from "zod";

export const confirmDeleteSquadSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "delete squad", {
      message: "Please type in “delete squad” to confirm.",
    }),
});

export type ConfirmDeleteSquadSchema = z.infer<typeof confirmDeleteSquadSchema>;