// -- Champ Points Types -- //

export type ChampPointsTable = {
  id: string;
  created_at: string;
  season_id: string;
  league_id: string;
  position: number;
  points: string;
};

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

export type GetLeagueSeasonChampPointsResult =
  | { success: true; data: ChampPointsTable[] }
  | SupabaseError;

export type AddLeagueSeasonChampPointsPayload = {
  seasonId: string;
  leagueId: string;
  position: number;
  points: string;
};

export type AddLeagueSeasonChampPointsResult =
  | { success: true; data: ChampPointsTable }
  | SupabaseError;

export type UpdateLeagueSeasonChampPointsPayload = {
  champPointsId: string;
  seasonId: string;
  position: number;
  points: string;
};

export type UpdateLeagueSeasonChampPointsResult =
  | { success: true; data: ChampPointsTable }
  | SupabaseError;

export type RemoveLeagueSeasonChampPointsPayload = {
  champPointsId: string;
  seasonId: string;
};

export type RemoveLeagueSeasonChampPointsResult =
  | { success: true }
  | SupabaseError;