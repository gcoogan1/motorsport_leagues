import { supabase } from "@/lib/supabase";
import type { CreateRoundPayload, CreateRoundResponse, GetRoundByIdResponse, GetRoundsResponse, UpdateRoundResponse, UpdateRoundPayload, DeleteRoundResponse } from "@/types/round.types";


// -- Round Service -- //


// Get a round by its ID
export const getRoundById = async (roundId: string): Promise<GetRoundByIdResponse> => {
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("id", roundId)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Get all rounds for a specific division
export const getRoundsByDivisionId = async (divisionId: string): Promise<GetRoundsResponse> => {
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Get all rounds for a specific season
export const getRoundsBySeasonId = async (seasonId: string): Promise<GetRoundsResponse> => {
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Create a new round
export const createRound = async ({ roundName, divisionId, seasonId }: CreateRoundPayload): Promise<CreateRoundResponse> => {
  const { data, error } = await supabase
    .from("rounds")
    .insert([{ round_name: roundName, division_id: divisionId, season_id: seasonId }])
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Update an existing round
export const updateRound = async ({ roundId, roundName, briefing }: UpdateRoundPayload): Promise<UpdateRoundResponse> => {
  const updateData: Record<string, unknown> = {};
  if (roundName) updateData.round_name = roundName;
  if (briefing) updateData.briefing = briefing;

  const { data, error } = await supabase
    .from("rounds")
    .update(updateData)
    .eq("id", roundId)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: data,
  };
};

// Delete a round by its ID
export const deleteRound = async (roundId: string): Promise<DeleteRoundResponse> => {
  const { error } = await supabase
    .from("rounds")
    .delete()
    .eq("id", roundId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all rounds for a specific division
export const deleteRoundsByDivisionId = async (divisionId: string): Promise<DeleteRoundResponse> => {
  const { error } = await supabase
    .from("rounds")
    .delete()
    .eq("division_id", divisionId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};

// Delete all rounds for a specific season
export const deleteRoundsBySeasonId = async (seasonId: string): Promise<DeleteRoundResponse> => {
  const { error } = await supabase
    .from("rounds")
    .delete()
    .eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};