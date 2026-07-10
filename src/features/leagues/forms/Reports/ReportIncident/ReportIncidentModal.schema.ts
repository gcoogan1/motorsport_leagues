import z from "zod";

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;

export const createTicketSchema = z.object({
  reportingDriver: z.string().min(1, "Please select a driver."),
  offendingDriver: z.string().min(1, "Please select a driver."),
  description: z.string().min(1, "Please enter a description of the incident.").max(
    2000,
    "Description cannot be longer than 2,000 characters.",
  )
});
