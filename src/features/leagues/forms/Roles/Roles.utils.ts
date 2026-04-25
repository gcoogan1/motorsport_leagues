import type { LeagueRole, LeagueRoleTag, RolesFormValues } from "./Roles.types";

// Normalize role arrays to sets - for easier diffing of role changes.
export const toRoleSet = (roles: LeagueRoleTag[] | LeagueRole[]) =>
  new Set((roles ?? []) as LeagueRole[]);

// Get indexes of participants that would have no roles if the changes were applied.
export const getUnassignedParticipantIndexes = (
  rows: RolesFormValues["participants"],
) =>
  rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.selectedRoles.length === 0)
    .map(({ index }) => index);

// Get indexes of participants that would have no director if the changes were applied.
export const getNoDirectorErrorIndexes = ({
  rows,
  originalRolesByParticipantId,
}: {
  rows: RolesFormValues["participants"];
  originalRolesByParticipantId: Map<string, Set<LeagueRole>>;
}) => {
  const hasDirector = rows.some((row) =>
    toRoleSet(row.selectedRoles).has("director")
  );

  if (hasDirector) {
    return [];
  }

  const directorRemovedIndexes = rows
    .map((row, index) => {
      const previousRoles =
        originalRolesByParticipantId.get(row.participantId) ?? new Set();
      const hadDirectorBefore = previousRoles.has("director");
      const hasDirectorNow = toRoleSet(row.selectedRoles).has("director");

      return hadDirectorBefore && !hasDirectorNow ? index : -1;
    })
    .filter((index) => index >= 0);

  return directorRemovedIndexes.length > 0
    ? directorRemovedIndexes
    : rows.map((_, index) => index);
};
