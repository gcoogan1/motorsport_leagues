export type RulesTable = {
  id: string;
  created_at: string;
  league_id: string;
  rules: string;
  edited_at?: string;
};

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

export type GetLeagueRulesResult =
  | { success: true; data: RulesTable | null }
  | SupabaseError;

export type AddLeagueRulesPayload = {
  leagueId: string;
  rules: string;
};

export type AddLeagueRulesResult =
  | { success: true; data: RulesTable }
  | SupabaseError;

export type UpdateLeagueRulesPayload = {
  leagueId: string;
  rules: string;
};

export type UpdateLeagueRulesResult =
  | { success: true; data: RulesTable }
  | SupabaseError;

export type UploadLeagueRulesImagePayload = {
  leagueId: string;
  file: File;
};

export type UploadLeagueRulesImageResult =
  | {
      success: true;
      data: {
        src: string;
        path: string;
      };
    }
  | SupabaseError;
