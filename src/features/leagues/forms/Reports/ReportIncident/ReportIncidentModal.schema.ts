import z from "zod";

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;

const stripHtml = (value: string): string => {
  if (!value) {
    return "";
  }

  if (typeof DOMParser !== "undefined") {
    const document = new DOMParser().parseFromString(value, "text/html");
    return document.body.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
  }

  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const hasImageContent = (value: string): boolean => {
  if (!value) {
    return false;
  }

  if (typeof DOMParser !== "undefined") {
    const document = new DOMParser().parseFromString(value, "text/html");
    return document.querySelector("img") !== null;
  }

  return /<img\b[^>]*>/i.test(value);
};

export const createTicketSchema = z.object({
  reportingDriver: z.string().min(1, "Please select a driver."),
  offendingDriver: z.string().min(1, "Please select a driver."),
  description: z
    .string()
    .superRefine((value, context) => {
      const plainText = stripHtml(value);
      const containsImage = hasImageContent(value);

      if (!plainText && !containsImage) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a description of the incident.",
        });
        return;
      }

      if (plainText.length > 2000) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description cannot be longer than 2,000 characters.",
        });
      }
    }),
});
