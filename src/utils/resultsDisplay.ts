import type { SessionType } from "@/types/results.types";

type ResultDisplayLike = {
  session_id: string;
  session_type: SessionType;
  driver_id: string;
  fastest_lap: boolean;
  position: number;
  points: number;
};

const buildSessionDriverKey = (sessionId: string, driverId: string) =>
  `${sessionId}:${driverId}`;

export const isFastestLapOnlyRow = <T extends ResultDisplayLike>(row: T) =>
  row.fastest_lap && row.position === 0;

// Fastest lap points may be stored on a separate "fastest-lap-only" row.
// For display, merge that bonus into the driver's regular session result.
export const mergeFastestLapPointsForDisplay = <T extends ResultDisplayLike>(
  rows: T[],
  options?: { excludeQualifying?: boolean },
) => {
  const excludeQualifying = options?.excludeQualifying ?? false;

  const bonusBySessionDriver = new Map<string, number>();

  rows.forEach((row) => {
    if (excludeQualifying && row.session_type === "qualifying") {
      return;
    }

    if (!isFastestLapOnlyRow(row)) {
      return;
    }

    const key = buildSessionDriverKey(row.session_id, row.driver_id);
    const current = bonusBySessionDriver.get(key) ?? 0;
    bonusBySessionDriver.set(key, current + (row.points ?? 0));
  });

  return rows
    .filter((row) => {
      if (excludeQualifying && row.session_type === "qualifying") {
        return false;
      }

      return !isFastestLapOnlyRow(row);
    })
    .map((row) => {
      const key = buildSessionDriverKey(row.session_id, row.driver_id);
      const bonus = bonusBySessionDriver.get(key) ?? 0;

      return {
        ...row,
        points: (row.points ?? 0) + bonus,
      };
    });
};
