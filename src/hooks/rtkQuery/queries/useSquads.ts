import { useGetSquadsQuery } from "@/store/rtkQueryAPI/squadApi";

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
