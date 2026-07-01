import { useMemo } from "react";
import { useGetResultsWithDetailsByDriverId } from "@/rtkQuery/hooks/queries/useResults";
import {
  useGetLeagueSeasonDriverByIdQuery,
  useGetLeagueSeasonTeamByIdQuery,
} from "@/rtkQuery/API/leagueApi";

// Returns driver performance data using a single joined Supabase query.
// Round name, track name, driver info, and team info are all resolved server-side,
// eliminating the N+1 async waterfall that separate per-result fetches would cause.
export const useDriverPerformanceResults = (driverId: string) => {
  const { data: rawResults = [], isLoading } =
    useGetResultsWithDetailsByDriverId(driverId);
  const { data: seasonDriver } = useGetLeagueSeasonDriverByIdQuery(driverId, {
    skip: !driverId,
  });
  const { data: seasonTeam } = useGetLeagueSeasonTeamByIdQuery(
    seasonDriver?.team_id ?? "",
    {
      skip: !seasonDriver?.team_id,
    },
  );

  // Driver/team metadata should come from unfiltered joined rows first, then
  // fall back to live season-driver/team queries when no results exist yet.
  const rawDriverData = rawResults[0] ?? null;

  // Hide zero-point events in performance views and sort by event date (oldest to newest)
  const results = useMemo(
    () => {
      const filtered = rawResults.filter((result) => (result.points ?? 0) > 0);
      return filtered.sort((left, right) => {
        // Sort by event_date first (oldest to newest)
        if (!left.event_date && !right.event_date) {
          return left.created_at.localeCompare(right.created_at);
        }
        if (!left.event_date) {
          return 1;
        }
        if (!right.event_date) {
          return -1;
        }
        return new Date(left.event_date).getTime() - new Date(right.event_date).getTime();
      });
    },
    [rawResults],
  );

  const driverData = rawDriverData ?? seasonDriver ?? null;

  const teamName =
    rawDriverData?.team_name ??
    // Fallback: some result rows may carry a denormalised team_name column
    rawResults.find((r) => r.team_name)?.team_name ??
    seasonTeam?.team_name ??
    null;

  return { results, driverData, teamName, isLoading };
};