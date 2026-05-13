import z from "zod";

export const TEAM_NAME_MAX_LENGTH = 32;
export const TEAM_NAME_REQUIRED_MESSAGE = "Please enter a name for this Team.";
export const TEAM_NAME_TOO_LONG_MESSAGE = `Team name cannot be longer than ${TEAM_NAME_MAX_LENGTH} characters.`;
export const TEAM_DELETE_BLOCKED_MESSAGE = "Remove assigned drivers from this team before deleting it.";

const teamRowSchema = z.object({
  teamId: z.string().optional(),
  localId: z.string(),
  teamName: z.string().trim().min(1, TEAM_NAME_REQUIRED_MESSAGE).max(
    TEAM_NAME_MAX_LENGTH,
    TEAM_NAME_TOO_LONG_MESSAGE,
  ),
});

const driverAssignmentRowSchema = z.object({
  driver: z.string(),
  teamKey: z.string(),
});

export const teamAssignmentsFormSchema = z
  .object({
    teams: z.array(teamRowSchema),
    assignments: z.array(driverAssignmentRowSchema),
  })
  // Keep driver assignments aligned with the currently available teams.
  .superRefine((data, ctx) => {
    const activeTeamKeys = new Set(
      data.teams
        .filter((team) => team.teamName.trim())
        .map((team) => team.teamId ?? team.localId),
    );

    data.assignments.forEach((assignment, index) => {
      if (
        assignment.driver &&
        assignment.teamKey &&
        !activeTeamKeys.has(assignment.teamKey)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["assignments", index, "teamKey"],
          message: TEAM_DELETE_BLOCKED_MESSAGE,
        });
      }
    });
  });

export type TeamAssignmentsFormValues = z.infer<typeof teamAssignmentsFormSchema>;
