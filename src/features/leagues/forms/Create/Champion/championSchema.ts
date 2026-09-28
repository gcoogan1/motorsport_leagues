import z from "zod";

export type ChampionFormValues = z.infer<typeof championSchema>;

export const championSchema = z.object({
    championName: z
      .string()
      .min(1, "Please select a season winner."),
});