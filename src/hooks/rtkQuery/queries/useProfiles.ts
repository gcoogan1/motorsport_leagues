import { useGetProfilesQuery } from "@/store/rtkQueryAPI/profileApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch profiles with optional search parameter
export const useProfiles = (
  userId?: string,
  search?: string,
  activeTab?: string,
) => {
  const skip = !userId || !search || activeTab !== "Profiles";

  return useGetProfilesQuery(
    { userId, search, activeTab },
    { skip },
  );
};

// Query to fetch all profiles excluding the current user's account
export const useOtherProfiles = (userId?: string) =>
  useGetProfilesQuery(
    { userId, activeTab: "Profiles" },
    { skip: !userId },
  );
