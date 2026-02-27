import { z } from "zod";

export const founderProfileSchema = z.object({
  founder: z
    .string()
    .min(1, "Please select a founder."),
});

export type FounderFormValues = z.infer<typeof founderProfileSchema>;
