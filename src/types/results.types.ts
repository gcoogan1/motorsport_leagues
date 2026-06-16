export type SessionType = "qualifying" | "race";

export type ResultsTable = {
  id: string;
  created_at: string;
  division_id: string;
  round_id: string;
  event_id: string;
  event_name: string;
  session_id: string;
  session_type: SessionType;
  position: number;
  time: string;
  points: number;
  driver_id: string;
  team_id?: string;
  team_name?: string;
  fastest_lap: boolean;
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

export type CreateResultsPayload = {
  division_id: string;
  round_id: string;
  event_id: string;
  event_name: string;
  session_id: string;
  session_type: SessionType;
  position: number;
  time: string;
  points: number;
  driver_id: string;
  team_id?: string;
  team_name?: string;
  fastest_lap: boolean;
};

export type CreateResultsResponse = {
  success: true;
  data: ResultsTable;
} | SupabaseError;

// -- UPDATE -- //

export type UpdateResultsPayload = Partial<Omit<ResultsTable, "id" | "created_at">>;

export type UpdateResultsResponse = {
  success: true;
  data: ResultsTable;
} | SupabaseError;


// -- GET -- //

// -- GET SINGLE RESULT -- //
export type GetResultResponse = {
  success: true;
  data: ResultsTable;
} | SupabaseError;

// -- GET MULTIPLE RESULTS -- //
export type GetResultsResponse = {
  success: true;
  data: ResultsTable[];
} | SupabaseError;


// -- DELETE -- //

export type DeleteResultsResponse = {
  success: true;
} | SupabaseError;
