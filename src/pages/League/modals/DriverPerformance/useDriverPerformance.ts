import { useMemo } from "react";
import { useGetResultsWithDetailsByDriverId } from "@/rtkQuery/hooks/queries/useResults";
import {
  useGetLeagueSeasonDriverByIdQuery,
  useGetLeagueSeasonTeamByIdQuery,
} from "@/rtkQuery/API/leagueApi";

type DriverPerformanceEventResult = {
  event_id: string;
  round_name: string;
  track_name: string;
  position?: number;
  points: number;
};

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

  const results = useMemo<DriverPerformanceEventResult[]>(() => {
    const grouped = new Map<string, DriverPerformanceEventResult>();

    for (const result of rawResults) {
      const eventId = result.event_id;
      const existing = grouped.get(eventId);

      if (existing) {
        existing.points += result.points ?? 0;

        if (!result.fastest_lap && typeof result.position === "number") {
          existing.position =
            typeof existing.position === "number"
              ? Math.min(existing.position, result.position)
              : result.position;
        }

        continue;
      }

      grouped.set(eventId, {
        event_id: eventId,
        round_name: result.round_name ?? "Unknown Round",
        track_name: result.track_name ?? "Hidden Track",
        position:
          !result.fastest_lap && typeof result.position === "number"
            ? result.position
            : undefined,
        points: result.points ?? 0,
      });
    }

    return [...grouped.values()].filter((result) => result.points > 0);
  }, [rawResults]);

  const driverData = rawDriverData ?? seasonDriver ?? null;

  const teamName =
    rawDriverData?.team_name ??
    // Fallback: some result rows may carry a denormalised team_name column
    rawResults.find((r) => r.team_name)?.team_name ??
    seasonTeam?.team_name ??
    null;

  return { results, driverData, teamName, isLoading };
};