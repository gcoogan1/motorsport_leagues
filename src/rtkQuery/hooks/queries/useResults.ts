import {
  useGetResultByIdQuery,
  useGetResultsByDivisionIdQuery,
  useGetResultsByDriverIdQuery,
  useGetResultsByEventIdQuery,
  useGetResultsByRoundIdQuery,
  useGetResultsBySessionIdQuery,
  useGetResultsByTeamIdQuery,
  useGetResultsWithDetailsByDriverIdQuery,
} from "@/rtkQuery/API/resultsApi";

// --- Queries --- //
// Used to fetch data //

export const useGetResult = (resultId: string) => {
  return useGetResultByIdQuery(resultId ?? "", {
    skip: !resultId,
  });
};

export const useGetResultBySessionId = (sessionId: string) => {
  return useGetResultsBySessionIdQuery(sessionId ?? "", {
    skip: !sessionId,
  });
};

export const useGetResultsByEventId = (eventId: string) => {
  return useGetResultsByEventIdQuery(eventId ?? "", {
    skip: !eventId,
  });
};

export const useGetResultsByDivisionId = (divisionId: string) => {
  return useGetResultsByDivisionIdQuery(divisionId ?? "", {
    skip: !divisionId,
  });
};

export const useGetResultsByRoundId = (roundId: string) => {
  return useGetResultsByRoundIdQuery(roundId ?? "", {
    skip: !roundId,
  });
};

export const useGetResultsByDriverId = (driverId: string) => {
  return useGetResultsByDriverIdQuery(driverId ?? "", {
    skip: !driverId,
  });
};

export const useGetResultsByTeamId = (teamId: string) => {
  return useGetResultsByTeamIdQuery(teamId ?? "", {
    skip: !teamId,
  });
};

// Returns a driver's results with round, track, and team data pre-joined.
// Qualifying sessions are excluded. Use this instead of useGetResultsByDriverId
// when you need the full performance breakdown (e.g. DriverPerformance modal).
export const useGetResultsWithDetailsByDriverId = (driverId: string) => {
  return useGetResultsWithDetailsByDriverIdQuery(driverId ?? "", {
    skip: !driverId,
  });
};
