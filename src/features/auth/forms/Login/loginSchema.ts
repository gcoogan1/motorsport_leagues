import * as z from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(128, { message: "Email cannot be longer than 128 characters." }),
  password: z.string().min(8, "Your password must be at least 8 characters.")
    .max(64, "Your password can not be longer than 64 characters."),
});
