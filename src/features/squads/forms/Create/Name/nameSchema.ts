import z from "zod";

export type CreateNameSchema = z.infer<typeof createNameSchema>;

export const createNameSchema = z.object({
  name: z.string().min(1, "Please enter a name for your Squad.").max(
    64,
    "Squad Name can not be longer than 64 characters.",
  )
});
