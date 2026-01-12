import * as z from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, "Your password must be at least 8 characters."),
});