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

  // Hide zero-point events in performance views.
  const results = useMemo(
    () => rawResults.filter((result) => (result.points ?? 0) > 0),
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