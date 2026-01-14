import z from "zod";

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(128, { message: "Email cannot be longer than 128 characters." }),
});
