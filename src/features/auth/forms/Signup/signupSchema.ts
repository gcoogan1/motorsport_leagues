import * as z from "zod";

export type SignupFormValues = z.infer<typeof signupSchema>;

export const signupSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name.").max(
    64,
    "First Name cannot be longer than 64 characters.",
  )
    .trim()
    .transform((val) => val.toLowerCase()),
  lastName: z.string().min(1, "Please enter your last name.").max(
    64,
    "Last Name cannot be longer than 64 characters.",
  )
    .trim()
    .transform((val) => val.toLowerCase()),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(128, { message: "Email cannot be longer than 128 characters." })
    .trim()
    .transform((val) => val.toLowerCase()),
  password: z.string().min(8, "Your password must be at least 8 characters.")
    .max(64, "Your password cannot be longer than 64 characters."),
});
