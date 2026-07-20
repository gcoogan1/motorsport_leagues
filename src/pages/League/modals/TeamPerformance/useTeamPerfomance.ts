import { useMemo } from "react";
import { useGetResultsWithDetailsByTeamId } from "@/rtkQuery/hooks/queries/useResults";
import { mergeFastestLapPointsForDisplay } from "@/utils/resultsDisplay";

export type TeamPerformanceEventRow = {
  eventId: string;
  roundName: string;
  eventName: string;
  totalPoints: number;
  createdAt: string;
  participantCount: number;
};

const getEventDateValue = (eventDate?: string | null) => {
  if (!eventDate) {
    return 0;
  }

  const parsedDate = new Date(eventDate).getTime();
  return Number.isNaN(parsedDate) ? 0 : parsedDate;
};

// This hook fetches and processes team performance results for a given team ID.
// It returns the processed events, team data, team name, loading state, and driver count.
// The events are grouped by event ID, and the total points and participant count are calculated for each event.
export const useTeamPerformanceResults = (teamId: string) => {
  const { data: rawResults = [], isLoading } =
    useGetResultsWithDetailsByTeamId(teamId);

  const mergedRows = useMemo(
    () => mergeFastestLapPointsForDisplay(rawResults, { excludeQualifying: true }),
    [rawResults],
  );

  const events = useMemo<TeamPerformanceEventRow[]>(() => {
    const grouped = new Map<string, TeamPerformanceEventRow & { participantIds: Set<string>; eventDate: string | null }>();

    for (const result of mergedRows) {
      const eventId = result.event_id;
      const existing = grouped.get(eventId);
      const eventDate = result.event_date ?? null;

      if (existing) {
        existing.totalPoints += result.points ?? 0;
        existing.participantIds.add(result.driver_id);
        if (getEventDateValue(eventDate) > getEventDateValue(existing.eventDate)) {
          existing.eventDate = eventDate;
        }
        continue;
      }

      grouped.set(eventId, {
        eventId,
        roundName: result.round_name ?? "Unknown Round",
        eventName: result.event_name ?? "Unknown Event",
        totalPoints: result.points ?? 0,
        createdAt: result.created_at ?? "",
        participantCount: 1,
        participantIds: new Set([result.driver_id]),
        eventDate,
      });
    }

    return [...grouped.values()]
      .map(({ participantIds, ...entry }) => ({
        ...entry,
        participantCount: participantIds.size,
      }))
      .sort((left, right) => {
        const leftEventDate = getEventDateValue((left as typeof left & { eventDate?: string | null }).eventDate);
        const rightEventDate = getEventDateValue((right as typeof right & { eventDate?: string | null }).eventDate);
        const eventDateDiff = leftEventDate - rightEventDate;

        if (eventDateDiff !== 0) {
          return eventDateDiff;
        }

        const createdAtDiff = new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();

        if (createdAtDiff !== 0) {
          return createdAtDiff;
        }

        const roundDiff = left.roundName.localeCompare(right.roundName);

        if (roundDiff !== 0) {
          return roundDiff;
        }

        return left.eventName.localeCompare(right.eventName);
      });
  }, [mergedRows]);

  const driverCount = useMemo(
    () => new Set(mergedRows.map((result) => result.driver_id)).size,
    [mergedRows],
  );

  // Team and team info are embedded on the first result via the join.
  // All results share the same team, so index 0 is sufficient.
  const teamData = mergedRows[0] ?? null;
  const teamName =
    teamData?.team_name ??
    // Fallback: some result rows may carry a denormalised team_name column
    mergedRows.find((r) => r.team_name)?.team_name ??
    null;

  return { events, teamData, teamName, isLoading, driverCount };
};