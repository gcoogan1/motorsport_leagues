import z from "zod";

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters long").max(64, "Password cannot be longer than 64 characters."),
  newPassword: z.string().min(8, "Password must be at least 8 characters long").max(64, "Password cannot be longer than 64 characters."),
})