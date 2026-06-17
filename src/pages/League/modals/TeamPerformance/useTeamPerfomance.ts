import { useMemo } from "react";
import { useGetResultsWithDetailsByTeamId } from "@/rtkQuery/hooks/queries/useResults";

// Returns team performance data using a single joined Supabase query.
// Round name, track name, team info, and team info are all resolved server-side,
// eliminating the N+1 async waterfall that separate per-result fetches would cause.
export const useTeamPerformanceResults = (teamId: string) => {
  const { data: rawResults = [], isLoading } =
    useGetResultsWithDetailsByTeamId(teamId);

  // Hide zero-point events in performance views.
  const results = useMemo(
    () => rawResults.filter((result) => (result.points ?? 0) > 0),
    [rawResults],
  );

  // Team and team info are embedded on the first result via the join.
  // All results share the same team, so index 0 is sufficient.
  const teamData = results[0] ?? null;
  const teamName =
    teamData?.team_name ??
    // Fallback: some result rows may carry a denormalised team_name column
    results.find((r) => r.team_name)?.team_name ??
    null;

  return { results, teamData, teamName, isLoading };
};