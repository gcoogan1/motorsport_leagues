import z from "zod";

export type CreateHostSchema = z.infer<typeof createHostSchema>;

export const createHostSchema = z.object({
  leagueName: z.string().min(1, "Please enter a name for your League.").max(
    64,
    "Name of League cannot be longer than 64 characters.",
  ),
  hostingSquad: z
    .string()
    .min(1, "Please select hosting squad."),
});
