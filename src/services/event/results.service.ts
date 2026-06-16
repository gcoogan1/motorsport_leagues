import { supabase } from "@/lib/supabase";
import type {
  CreateResultsPayload,
  CreateResultsResponse,
  DeleteResultsResponse,
  GetResultResponse,
  GetResultsResponse,
  UpdateResultsPayload,
  UpdateResultsResponse,
} from "@/types/results.types";


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


