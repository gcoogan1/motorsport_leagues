import { z } from "zod";

export const confirmDeleteAccountSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "delete account", {
      message: "Please type in “delete account” to confirm.",
    }),
});

export type ConfirmDeleteAccountSchema = z.infer<typeof confirmDeleteAccountSchema>;
