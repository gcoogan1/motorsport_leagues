
import { z } from "zod";
import { AVATAR_VARIANTS } from "@/types/profile.types";

const avatarSelectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("preset"),
    variant: z.enum(AVATAR_VARIANTS),
  }),
  z.object({
    type: z.literal("upload"),
    file: z.instanceof(File).refine((f) => f.size <= 5_000_000, "Max 5MB"),
  }),
]);

export const avatarFormSchema = z.object({
  avatar: avatarSelectionSchema,
});

export type AvatarFormValues = z.infer<typeof avatarFormSchema>;
