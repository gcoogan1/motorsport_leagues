import z from "zod";

export type UpdateRoundNameSchema = z.infer<typeof updateRoundNameSchema>;

export const updateRoundNameSchema = z.object({
  roundName: z.string().min(1, "Please enter a name for this Round.").max(
    24,
    "Round name cannot be longer than 24 characters.",
  )
});
