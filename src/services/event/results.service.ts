import { supabase } from "@/lib/supabase";
import type {
  CreateResultsPayload,
  CreateResultsResponse,
  DeleteResultsResponse,
  GetJoinedResultsResponse,
  GetResultResponse,
  GetResultsResponse,
  NormalizedResultsTable,
  UpdateResultsPayload,
  UpdateResultsResponse,
} from "@/types/results.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeResult = (result: any): NormalizedResultsTable => {
  const {
    round,
    event,
    league_season_driver,
    ...baseResult
  } = result;

  return {
    ...baseResult,

    round_name: round?.round_name ?? null,

    track_name:
      event?.event_track_details?.[0]?.track_name ?? null,

    display_name:
      league_season_driver?.display_name ?? null,

    team_name:
      league_season_driver?.league_season_team?.team_name ?? null,
  };
};



// -- GET RESULT-- //
export const getResultPerSessionId = async (
  sessionId: string,
): Promise<GetResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("session_id", sessionId);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

export const getResultById = async (
  resultId: string,
): Promise<GetResultResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("id", resultId)
    .single();

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};


// -- GET RESULTS -- //
export const getResultsByEventId = async (
  eventId: string,
): Promise<GetResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("event_id", eventId);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

export const getResultsByDivisionId = async (
  divisionId: string,
): Promise<GetResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

export const getResultsByRoundId = async (
  roundId: string,
): Promise<GetResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("round_id", roundId);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

export const getResultsPerDriverId = async (
  driverId: string,
): Promise<GetResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("driver_id", driverId);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

// Fetches a driver's results with related round, track, and team data in a
// single query using Supabase PostgREST relational joins. Qualifying sessions
// are excluded at the database level so no extra client-side filtering is needed.
export const getResultsWithDetailsByDriverId = async (
  driverId: string,
): Promise<GetJoinedResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select(`
      *,
      round ( round_name ),
      event (
        event_track_details ( track_name )
      ),
      league_season_driver!driver_id (
        display_name,
        team_id,
        league_season_team ( team_name )
      )
    `)
    .eq("driver_id", driverId)
    .neq("session_type", "qualifying")
    .neq("fastest_lap", true);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data: (data ?? []).map(normalizeResult) };
};

export const getResultsPerTeamId = async (
  teamId: string,
): Promise<GetResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("team_id", teamId);

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

export const getResultsWithDetailsPerTeamId = async (
  teamId: string,
): Promise<GetJoinedResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .select(`
      *,
      round ( round_name ),
      event (
        event_track_details ( track_name )
      ),
      league_season_driver!driver_id (
        display_name,
        team_id,
        league_season_team ( team_name )
      )
    `)
    .eq("team_id", teamId)
    .neq("session_type", "qualifying")
    .neq("fastest_lap", true)

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data: (data ?? []).map(normalizeResult) };
};

// -- CREATE RESULT -- //
export const createResult = async (
  payload: CreateResultsPayload,
): Promise<CreateResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .insert([payload])
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

// -- UPDATE RESULT -- //
export const updateResult = async (
  id: string,
  payload: UpdateResultsPayload,
): Promise<UpdateResultsResponse> => {
  const { data, error } = await supabase
    .from("results")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true, data };
};

// -- DELETE RESULT -- //
export const deleteResult = async (
  id: string,
): Promise<DeleteResultsResponse> => {
  const { error } = await supabase
    .from("results")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return {
      success: false,
      error: { message: error.message, code: error.code, status: 500 },
    };
  }

  return { success: true };
};


