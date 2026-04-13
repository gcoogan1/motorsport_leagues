import { z } from "zod";
import { type Theme } from "@/app/design/tokens/theme";
import { LEAGUE_COVER_VARIANTS } from "@/types/league.types";

const settingsCoverSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("preset"),
    variant: z.enum(LEAGUE_COVER_VARIANTS),
  }),
  z.object({
    type: z.literal("upload"),
    file: z
      .instanceof(File)
      .refine((file) => file.size <= 5_000_000, "Max 5MB")
      .optional(),
    previewUrl: z.string().optional(),
  }).refine((value) => value.file instanceof File || !!value.previewUrl, {
    message: "Please upload an image.",
  
  }),
]);

const themeColors = ["yellow", "blue", "red", "green"] as const satisfies readonly Theme[];

export const settingsFormSchema = z.object({
  leagueName: z
    .string()
    .trim()
    .min(1, "Please enter a name for this League.")
    .max(50, "League name must be 50 characters or less."),
  description: z
    .string()
    .trim()
    .min(10, "League Description must be at least 10 characters.")
    .max(160, "League Description must be 160 characters or less."),
  timezone: z
    .string()
    .trim()
    .min(1, "Please select a timezone."),
  cover: settingsCoverSchema,
  themeColor: z.enum(themeColors, {
    error: "Please select a theme color.",
  }),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
