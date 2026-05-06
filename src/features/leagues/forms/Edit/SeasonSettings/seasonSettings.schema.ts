import z from "zod";

export type SeasonSettingsSchema = z.infer<typeof seasonSettingsSchema>;

export const seasonSettingsSchema = z.object({
  seasonStatus: z
  .enum(["setup", "active", "complete"])
  .refine((val) => val, {
    message: "Please select a status for this Season.",
  }),
  seasonName: z.string().min(1, "Please enter a name for this Season.").max(
    16,
    "Season Name cannot be longer than 16 characters.",
  ),
});