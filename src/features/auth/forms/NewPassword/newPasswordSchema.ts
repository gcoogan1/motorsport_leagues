import z from "zod";

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export const newPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
})