import { z } from "zod";
import { SQUAD_BANNER_VARIANTS } from "@/types/squad.types";


const editBannerSelectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("preset"),
    variant: z.enum(SQUAD_BANNER_VARIANTS),
  }),
  z.object({
    type: z.literal("upload"),
    file: z.instanceof(File).refine((f) => f.size <= 5_000_000, "Max 5MB").optional(),
    previewUrl: z.string().optional(),
  }),
]);

export const editBannerFormSchema = z.object({
  banner: editBannerSelectionSchema,
});

export type EditBannerFormValues = z.infer<typeof editBannerFormSchema>;
