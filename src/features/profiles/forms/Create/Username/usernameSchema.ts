import * as z from "zod";

export const gtUsernameSchema = z.object({
  username: z
    .string()
    .min(1, "Please enter your GT7 Nickname.")
    .max(16, "GT7 Nickname cannot be longer than 16 characters.")
    .trim()
    .transform((val) => val.toLowerCase()),
});

// TEST FOR FUTURE GAME TYPES
export const iracingUsernameSchema = z.object({
  username: z.string().min(3, "iRacing username required"),
});

export const usernameSchemaMap = {
  gt7: gtUsernameSchema,
  iRacing: iracingUsernameSchema,
} as const;

export type UsernameFormValues =
  z.infer<(typeof usernameSchemaMap)[keyof typeof usernameSchemaMap]>;


  // Function to get the appropriate schema based on game type
export const getUsernameSchema = (gameType?: string) => {
  return (
    usernameSchemaMap[gameType as keyof typeof usernameSchemaMap] ??
    gtUsernameSchema // fallback
  );
};
