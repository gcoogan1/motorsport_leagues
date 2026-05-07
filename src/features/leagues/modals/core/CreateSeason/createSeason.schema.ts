import z from "zod";

export type CreateNewSeasonSchema = z.infer<typeof createNewSeasonSchema>;

export const createNewSeasonSchema = z.object({
  seasonName: z.string().min(1, "Please enter a name for this Season.").max(
    16,
    "Season Name cannot be longer than 16 characters.",
  ),
  numOfDivisions: z
    .number()
    .min(1, "Please choose at least one division.")
    .max(5, "You can create up to 5 divisions."),
  isTeamChampionship: z.boolean(),
});