import * as z from "zod";

export const eventSettingsSchema = z.object({
  eventName: z
    .string()
    .min(1, "Please enter a name for this Event.")
    .max(16, "Event name cannot be longer than 16 characters.")
    .trim(),

  eventDate: z.date({
    error: "Please select a date.",
  }),

  eventTime: z
    .string()
    .min(1, "Please select a time."),

  broadcastUrl: z
    .string()
    .optional()
    .or(z.literal("")),

  revealDate: z.boolean().optional(),
  revealBroadcast: z.boolean().optional(),
});

export type EventSettingsFormValues =
  z.infer<typeof eventSettingsSchema>;