import z from "zod";

export type UpdateNameSchema = z.infer<typeof updateNameSchema>;

export const updateNameSchema = z.object({
    firstName: z.string().min(1, "Please enter your first name.").max(
      64,
      "First Name cannot be longer than 64 characters.",
    ),
    lastName: z.string().min(1, "Please enter your last name.").max(
      64,
      "Last Name cannot be longer than 64 characters.",
    ),
});
