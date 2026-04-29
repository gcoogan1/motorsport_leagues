import {
  useGetLeagueApplicationOptionsQuery,
	useGetLeagueParticipantsQuery,
	useGetLeagueJoinRequestsQuery,
	useGetLeaguesQuery,
	useGetLeaguesByProfileIdQuery,
	useGetLeaguesBySquadIdQuery,
	useGetLeagueSeasonsQuery,
  useGetParticipantLeaguesQuery,
} from "@/rtkQuery/API/leagueApi";

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

// Query to fetch join requests for a league
export const useLeagueJoinRequests = (leagueId?: string) =>
	useGetLeagueJoinRequestsQuery(leagueId ?? "", {
		skip: !leagueId,
	});

// Query to fetch application options for a league
export const useLeagueApplicationOptions = (leagueId?: string) =>
	useGetLeagueApplicationOptionsQuery(leagueId ?? "", {
		skip: !leagueId,
	});

// Query to fetch leagues where any profile of this account is a league participant
export const useParticipantLeagues = (accountId?: string) =>
  useGetParticipantLeaguesQuery(accountId ?? "", {
    skip: !accountId,
  }
  );

// Query to fetch all enriched leagues for a given profile id
export const useProfileLeagues = (profileId?: string) =>
	useGetLeaguesByProfileIdQuery(profileId ?? "", {
		skip: !profileId,
	});

// Query to fetch all enriched leagues hosted by a given squad id
export const useSquadHostedLeagues = (squadId?: string) =>
	useGetLeaguesBySquadIdQuery(squadId ?? "", {
		skip: !squadId,
	});