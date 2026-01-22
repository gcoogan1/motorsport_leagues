import z from "zod";

export type CheckEmailSchema = z.infer<typeof checkEmailSchema>;

export const checkEmailSchema = z.object({
  verificationCode: z.string().min(1, "Incorrect code. Please try again."),
});
