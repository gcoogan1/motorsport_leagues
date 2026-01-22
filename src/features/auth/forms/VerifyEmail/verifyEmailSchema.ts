import z from "zod";

// Do not show error messages to user for verification code input

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;

export const verifyEmailSchema = z.object({
  verificationCode: z.string().min(1, "Incorrect code. Please try again."),
});
