import z from "zod";

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})