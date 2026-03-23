import z from "zod";

export const changeMemberRoleSchema = z.object({
  memberRole: z.enum(["member", "founder"]),
});

 export type ChangeMemberRoleSchema = z.infer<typeof changeMemberRoleSchema>;