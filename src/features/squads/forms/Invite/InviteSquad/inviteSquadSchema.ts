import { z } from "zod";

export const inviteSchema = z.object({
  invitees: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        isEmail: z.boolean().optional(),
        profileId: z.string().optional(),
        accountId: z.string().optional(),
      }).passthrough()
    )
    .min(1, "Please enter a valid Profile username or email address.")
    .max(6, "You can only invite 6 people at once.")
    .refine(
      (invitees) => {
        // Check for duplicate values (emails or usernames) - case insensitive
        const values = invitees.map((inv) => inv.value.toLowerCase());
        const uniqueValues = new Set(values);
        return uniqueValues.size === values.length;
      },
      "Duplicate entries detected. Each profile or email can only be added once."
    )
    .refine(
      (invitees) => {
        // Check for duplicate profileIds (for selected profiles)
        const profileIds = invitees
          .filter((inv) => inv.profileId)
          .map((inv) => inv.profileId);
        const uniqueProfileIds = new Set(profileIds);
        return uniqueProfileIds.size === profileIds.length;
      },
      "The same profile cannot be invited twice."
    ),
});