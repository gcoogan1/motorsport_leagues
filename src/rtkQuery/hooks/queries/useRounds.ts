import {
	useGetRoundByIdQuery,
	useGetRoundsByDivisionIdQuery,
  useGetRoundsBySeasonIdQuery,
} from "@/rtkQuery/API/roundApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch a single round by id
export const useRound = (roundId?: string) =>
	useGetRoundByIdQuery(roundId ?? "", {
		skip: !roundId,
	});

// Query to fetch all rounds for a division
export const useRounds = (divisionId?: string) =>
	useGetRoundsByDivisionIdQuery(divisionId ?? "", {
		skip: !divisionId,
	});

// Query to fetch all rounds for a season
export const useRoundsBySeason = (seasonId?: string) =>
  useGetRoundsBySeasonIdQuery(seasonId ?? "", {
    skip: !seasonId,
  });
