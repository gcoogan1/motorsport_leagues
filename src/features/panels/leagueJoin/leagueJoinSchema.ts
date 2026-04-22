import { z } from "zod";

export const joinFormSchema = z.object({
  leagueId: z.string().min(1),
  profile_joining: z.string().min(1, "Please select a profile."),
  contactInfo: z
    .string()
    .trim()
    .min(2, "Please enter contact information.")
    .max(64, "Contact information must be 64 characters or less."),
  options: z
    .record(z.string(), z.boolean())
    .refine(
      (value) => Object.values(value).some(Boolean),
      "Please select at least one role.",
    ),
});

export type JoinFormValues = z.infer<typeof joinFormSchema>;