import z from "zod";

export type EditSquadNameSchema = z.infer<typeof editSquadNameSchema>;

export const editSquadNameSchema = z.object({
  name: z.string().min(1, "Please enter a name for your Squad.").max(
    64,
    "Squad Name can not be longer than 64 characters.",
  )
});
