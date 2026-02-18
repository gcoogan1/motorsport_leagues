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
