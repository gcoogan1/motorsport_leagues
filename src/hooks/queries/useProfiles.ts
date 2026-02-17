import { getAllProfiles } from "@/services/profile.service";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Hook to fetch profiles with optional search parameter
export const useProfiles = (userId?: string, search?: string, activeTab?: string) => {
  return useQuery({
    // Adding activeTab to the key prevents data "bleeding" between tabs
    queryKey: ["profiles", activeTab, search], 
    // The query function now accepts an AbortSignal for cancellation, which is useful for debounced search inputs
    queryFn: async ({ signal }) => {
      const result = await getAllProfiles(userId, search, signal);
      if (!result.success) {
        throw new Error(result.error?.message || "Failed to fetch profiles");
      }
      return result.data;
    },
    // Only run if on Profiles tab AND there is a search term
    enabled: !!userId && !!search && activeTab === "Profiles",
    staleTime: 1000 * 60 * 5,
    // keepPreviousData is useful for pagination, but can be confusing during tab switches
    // Consider removing it if you want a "clean" slate when switching tabs
    placeholderData: activeTab === "Profiles" ? keepPreviousData : undefined,
  });
};
