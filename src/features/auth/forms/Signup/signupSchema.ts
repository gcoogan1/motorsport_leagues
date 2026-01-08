import * as z from "zod";

export type SignupFormValues = z.infer<typeof signupSchema>;

export const signupSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name.").max(50, "First name must be less than 50 characters."),
  lastName: z.string().min(1, "Please enter your last name.").max(50, "Last name must be less than 50 characters."),
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, "Your password must be at least 8 characters."),
})
