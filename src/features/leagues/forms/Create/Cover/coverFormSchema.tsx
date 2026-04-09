import { z } from "zod";
import { LEAGUE_COVER_VARIANTS } from "@/types/league.types";
import { type Theme } from "@/app/design/tokens/theme";

const coverSelectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("preset"),
    variant: z.enum(LEAGUE_COVER_VARIANTS),
  }),
  z.object({
    type: z.literal("upload"),
    file: z.instanceof(File).refine((f) => f.size <= 5_000_000, "Max 5MB"),
  }),
  
]);

const themeColors = ["yellow", "blue", "red", "green"] as const satisfies readonly Theme[];

export const coverFormSchema = z.object({
  cover: coverSelectionSchema,
  themeColor: z.enum(themeColors, {
    error: "Please select a theme color.",
  }),
});

export type CoverFormValues = z.infer<typeof coverFormSchema>;