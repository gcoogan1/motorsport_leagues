import z from "zod";

export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;

export const changeEmailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(128, { message: "Email cannot be longer than 128 characters." }),
});
