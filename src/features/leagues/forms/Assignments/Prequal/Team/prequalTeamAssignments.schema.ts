import z from "zod";

export const TEAM_NAME_MAX_LENGTH = 32;
export const TEAM_NAME_REQUIRED_MESSAGE = "Please enter a name for this Team.";
export const TEAM_NAME_TOO_LONG_MESSAGE = `Team name cannot be longer than ${TEAM_NAME_MAX_LENGTH} characters.`;
export const TEAM_DELETE_BLOCKED_MESSAGE = "Remove assigned drivers from this team before deleting it.";
export const PREQUAL_TEAM_REQUIRED_MESSAGE = "Please select a team from Pre-Qualifying.";
export const PREQUAL_TEAM_INVALID_MESSAGE = "Select a team that exists in Pre-Qualifying.";
export const PREQUAL_TEAM_ASSIGNED_MESSAGE = "This team is already assigned to another division.";
export const PREQUAL_TEAM_DUPLICATE_MESSAGE = "This team has already been selected.";

const normalizeTeamName = (teamName?: string) => teamName?.trim() ?? "";

type TeamAssignmentsSchemaOptions = {
  isLinkedDivision?: boolean;
  availableLinkedTeamNames?: Iterable<string>;
  blockedLinkedTeamNames?: Iterable<string>;
};

const buildTeamRowSchema = (isLinkedDivision: boolean) =>
  z.object({
    teamId: z.string().optional(),
    localId: z.string(),
    teamName: z.string().trim().min(
      1,
      isLinkedDivision ? PREQUAL_TEAM_REQUIRED_MESSAGE : TEAM_NAME_REQUIRED_MESSAGE,
    ).max(
      TEAM_NAME_MAX_LENGTH,
      TEAM_NAME_TOO_LONG_MESSAGE,
    ),
  });

const driverAssignmentRowSchema = z.object({
  driver: z.string(),
  teamKey: z.string(),
});

export const createTeamAssignmentsFormSchema = ({
  isLinkedDivision = false,
  availableLinkedTeamNames = [],
  blockedLinkedTeamNames = [],
}: TeamAssignmentsSchemaOptions = {}) => {
  const availableNames = new Set(
    Array.from(availableLinkedTeamNames, (teamName) => normalizeTeamName(teamName)),
  );
  const blockedNames = new Set(
    Array.from(blockedLinkedTeamNames, (teamName) => normalizeTeamName(teamName)),
  );

  return z
    .object({
      teams: z.array(buildTeamRowSchema(isLinkedDivision)),
      assignments: z.array(driverAssignmentRowSchema),
    })
    .superRefine((data, ctx) => {
      if (isLinkedDivision) {
        const selectedTeamNames = new Set<string>();

        data.teams.forEach((team, index) => {
          const teamName = normalizeTeamName(team.teamName);

          if (!teamName) {
            return;
          }

          if (!availableNames.has(teamName)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["teams", index, "teamName"],
              message: PREQUAL_TEAM_INVALID_MESSAGE,
            });
            return;
          }

          if (blockedNames.has(teamName)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["teams", index, "teamName"],
              message: PREQUAL_TEAM_ASSIGNED_MESSAGE,
            });
          }

          if (selectedTeamNames.has(teamName)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["teams", index, "teamName"],
              message: PREQUAL_TEAM_DUPLICATE_MESSAGE,
            });
            return;
          }

          selectedTeamNames.add(teamName);
        });

        return;
      }

      // Keep driver assignments aligned with the currently available teams.
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
};

export const teamAssignmentsFormSchema = createTeamAssignmentsFormSchema();

export type TeamAssignmentsFormValues = z.infer<typeof teamAssignmentsFormSchema>;
