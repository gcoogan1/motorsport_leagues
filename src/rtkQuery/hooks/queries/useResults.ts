import {
  useGetResultByIdQuery,
  useGetResultsByDivisionIdQuery,
  useGetResultsByDriverIdQuery,
  useGetResultsByEventIdQuery,
  useGetResultsByRoundIdQuery,
  useGetResultsBySessionIdQuery,
  useGetResultsByTeamIdQuery,
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
