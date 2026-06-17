import { useMemo } from "react";
import { useGetResultsWithDetailsByDriverId } from "@/rtkQuery/hooks/queries/useResults";

// Returns driver performance data using a single joined Supabase query.
// Round name, track name, driver info, and team info are all resolved server-side,
// eliminating the N+1 async waterfall that separate per-result fetches would cause.
export const useDriverPerformanceResults = (driverId: string) => {
  const { data: rawResults = [], isLoading } =
    useGetResultsWithDetailsByDriverId(driverId);

  // Hide zero-point events in performance views.
  const results = useMemo(
    () => rawResults.filter((result) => (result.points ?? 0) > 0),
    [rawResults],
  );

  // Driver and team info are embedded on the first result via the join.
  // All results share the same driver, so index 0 is sufficient.
  const driverData = results[0] ?? null;
  const teamName =
    driverData?.team_name ??
    // Fallback: some result rows may carry a denormalised team_name column
    results.find((r) => r.team_name)?.team_name ??
    null;

  return { results, driverData, teamName, isLoading };
};