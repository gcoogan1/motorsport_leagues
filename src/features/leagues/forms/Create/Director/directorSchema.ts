import { z } from "zod";

export const directorProfileSchema = z.object({
  director: z
    .string()
    .min(1, "Please select a director."),
});

export type DirectorFormValues = z.infer<typeof directorProfileSchema>;
