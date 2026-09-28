// -- League Champion Types -- //

export type LeagueChampion = {
  id: string;
  created_at: string;
  season_id: string;
  league_id: string;
  profile_id: string;
};

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};


export type GetLeagueChampionResult =
  | { success: true; data: LeagueChampion[] }
  | SupabaseError;

export type GetLeagueChampionByIdResult =
  | { success: true; data: LeagueChampion }
  | SupabaseError;


export type AddLeagueChampionPayload = {
  leagueId: string;
  seasonId: string;
  profileId: string;
};

export type AddLeagueChampionResult =
  | { success: true; data: LeagueChampion }
  | SupabaseError;

export type UpdateLeagueChampionPayload = {
  id: string;
  profileId: string;
};

export type UpdateLeagueChampionResult =
  | { success: true; data: LeagueChampion }
  | SupabaseError;

export type RemoveLeagueChampionPayload = {
  id: string;
};

export type RemoveLeagueChampionResult =
  | { success: true }
  | SupabaseError;