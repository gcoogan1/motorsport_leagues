import { useGetLeaguesQuery } from "@/store/rtkQueryAPI/leagueApi";

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
