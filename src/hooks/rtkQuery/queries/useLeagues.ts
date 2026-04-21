import {
	useGetLeagueParticipantsQuery,
	useGetLeaguesQuery,
	useGetLeagueSeasonsQuery,
  useGetParticipantLeaguesQuery,
} from "@/store/rtkQueryAPI/leagueApi";

// --- Queries --- //
// Used to fetch data //

// Query to fetch leagues with optional search parameter
export const useLeagues = (
	accountId?: string,
	search?: string,
	activeTab?: string,
	options?: {
		includeOwnLeagues?: boolean;
	},
) => {
	const skip = !search || activeTab !== "Leagues";
	const includeOwnLeagues = options?.includeOwnLeagues ?? false;

	return useGetLeaguesQuery(
		{ accountId, search, activeTab, includeOwnLeagues },
		{ skip },
	);
};

// Query to fetch participants for a league
export const useLeagueParticipants = (leagueId?: string) =>
	useGetLeagueParticipantsQuery(leagueId ?? "", {
		skip: !leagueId,
	});

// Query to fetch seasons for a league
export const useLeagueSeasons = (leagueId?: string) =>
	useGetLeagueSeasonsQuery(leagueId ?? "", {
		skip: !leagueId,
	});

// Query to fetch leagues where any profile of this account is a league participant
export const useParticipantLeagues = (accountId?: string) =>
  useGetParticipantLeaguesQuery(accountId ?? "", {
    skip: !accountId,
  }
  );