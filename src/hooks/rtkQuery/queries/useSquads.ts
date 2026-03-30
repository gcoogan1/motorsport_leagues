import {
  useGetMemberSquadsQuery,
  useGetSquadsByFounderProfileIdQuery,
  useGetSquadsByProfileIdQuery,
  useGetSquadsQuery,
} from "@/store/rtkQueryAPI/squadApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch squads with optional search parameter
export const useSquads = (
  userId?: string,
  search?: string,
  activeTab?: string,
) => {
  const skip = !userId || !search || activeTab !== "Squads";

  return useGetSquadsQuery(
    { founderAccountId: userId, search, activeTab },
    { skip },
  );
};

// Query to fetch squads founded by the viewed profile
export const useProfileSquads = (profileId?: string) =>
  useGetSquadsByFounderProfileIdQuery(profileId ?? "", {
    skip: !profileId,
  });

// Query to fetch squads where any profile of this account is a squad member
export const useSquadsByProfileId = (profileId?: string) =>
  useGetSquadsByProfileIdQuery(profileId ?? "", {
    skip: !profileId,
  });

// Query to fetch squads where any profile of this account is a squad member
export const useMemberSquads = (accountId?: string) =>
  useGetMemberSquadsQuery(accountId ?? "", {
    skip: !accountId,
  });
