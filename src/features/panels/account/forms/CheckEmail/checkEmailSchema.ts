import z from "zod";

export type CheckEmailSchema = z.infer<typeof checkEmailSchema>;

export const checkEmailSchema = z.object({
  verificationCode: z.string().length(6, "Verification code must be 6 characters long"),
});
