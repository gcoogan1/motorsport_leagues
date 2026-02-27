import { z } from "zod";
import { SQUAD_BANNER_VARIANTS } from "@/types/squad.types";


const bannerSelectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("preset"),
    variant: z.enum(SQUAD_BANNER_VARIANTS),
  }),
  z.object({
    type: z.literal("upload"),
    file: z.instanceof(File).refine((f) => f.size <= 5_000_000, "Max 5MB"),
  }),
]);

export const bannerFormSchema = z.object({
  banner: bannerSelectionSchema,
});

export type BannerFormValues = z.infer<typeof bannerFormSchema>;
