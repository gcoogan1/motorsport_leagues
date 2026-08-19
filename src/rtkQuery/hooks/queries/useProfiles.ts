import { useGetProfilesQuery } from "@/rtkQuery/API/profileApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch profiles with optional search parameter
export const useProfiles = (
  userId?: string,
  search?: string,
  activeTab?: string,
  options?: {
    includeOwnProfiles?: boolean;
  },
) => {
  // Require a minimum of 3 characters before firing a search query.
  const normalizedSearch = search?.trim() ?? "";
  const skip = normalizedSearch.length < 3 || activeTab !== "Profiles";
  const includeOwnProfiles = options?.includeOwnProfiles ?? false;

  return useGetProfilesQuery(
    { userId, search, activeTab, includeOwnProfiles },
    { skip },
  );
};

// Query to fetch all profiles excluding the current user's account
export const useOtherProfiles = (userId?: string) =>
  useGetProfilesQuery(
    { userId, activeTab: "Profiles" },
    { skip: !userId },
  );
