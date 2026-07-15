import z from "zod";

export type ResolveTicketSchema = z.infer<typeof resolveTicketSchema>;

export const resolveTicketSchema = z.object({
  offendingDriver: z.string().min(1, "Please select a driver."),
  incidentTitle: z.string().min(1, "Please enter a short title for the incident.").max(
    120,
    "Incident Title cannot be longer than 120 characters.",
  ),
  decisionSummary: z.string().min(1, "Please enter a short summary of the decision.").max(
    120,
    "Decision Summary cannot be longer than 120 characters.",
  ),
  detailedReasoning: z.string().min(1, "Please enter a detailed reasoning for the decision.").max(
    2000,
    "Detailed Reasoning cannot be longer than 2,000 characters.",
  )
});
