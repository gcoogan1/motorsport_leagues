export type RoundTable = {
  id: string;
  created_at: string;
  round_name: string;
  division_id: string;
  season_id: string;
  briefing?: string;
}


// -- DRAFT TYPES -- //
export type RoundTableDraft = {
  id: string;
  created_at: string;
  round_name: string;
  division_id: string;
  season_id: string;
}

// -- SUPABASE SERVICE TYPES -- //

type SupabaseError = {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
  };
};

// -- CREATE -- //

export type CreateRoundPayload = {
  roundName: string;
  divisionId: string;
  seasonId: string;
};

export type CreateRoundSuccess = {
  success: true;
  data: RoundTable;
};

export type CreateRoundResponse = CreateRoundSuccess | SupabaseError;


export type UploadRoundBriefingImagePayload = {
  roundId: string;
  file: File;
};

export type UploadRoundBriefingImageSuccess = {
  success: true;
  data: {
    src: string;
    path: string;
  };
};

export type UploadRoundBriefingImageResponse = UploadRoundBriefingImageSuccess | SupabaseError;


// -- GET -- //


// Get all rounds for a specific division or season
export type GetRoundsSuccess = {
  success: true;
  data: RoundTable[];
};

export type GetRoundsResponse = GetRoundsSuccess | SupabaseError;

// -- GET BY ID -- //

// Get a single round by its ID
export type GetRoundByIdSuccess = {
  success: true;
  data: RoundTable;
};

export type GetRoundByIdResponse = GetRoundByIdSuccess | SupabaseError;

// -- UPDATE -- //

export type UpdateRoundPayload = {
  roundId: string;
  roundName?: string;
  briefing?: string;
};

export type UpdateRoundSuccess = {
  success: true;
  data: RoundTable;
};

export type UpdateRoundResponse = UpdateRoundSuccess | SupabaseError;

// -- DELETE -- //

export type DeleteRoundSuccess = {
  success: true;
};

export type DeleteRoundResponse = DeleteRoundSuccess | SupabaseError;