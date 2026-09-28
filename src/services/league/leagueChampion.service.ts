import { supabase } from "@/lib/supabase";
import type { GetLeagueChampionByIdResult, GetLeagueChampionResult, AddLeagueChampionPayload, AddLeagueChampionResult, UpdateLeagueChampionResult, RemoveLeagueChampionResult, UpdateLeagueChampionPayload } from "@/types/champion.type";

// -- League Champion Service -- //


// -- Get League Champion (By Profile -> shows all champions for a profile for all leagues and seasons) -- //
export const getLeagueChampionByProfile = async (profileId: string): Promise<GetLeagueChampionResult> => {
  const { data, error } = await supabase
    .from("league_champion")
    .select("*")
    .eq("profile_id", profileId);

  
	if (error) {
		return {
			success: false,
			error: {
				message: error.message,
				code: error.code || "SERVER_ERROR",
				status: 500,
			},
		};
	}

  return { success: true, data };
};

// -- Get League Champion By League and Season -- //
export const getLeagueChampionByLeagueAndSeason = async (leagueId: string, seasonId: string): Promise<GetLeagueChampionResult> => {
  const { data, error } = await supabase
    .from("league_champion")
    .select("*")
    .eq("league_id", leagueId)
    .eq("season_id", seasonId);

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true, data };
};


// -- Get League Champion By ID -- //
export const getLeagueChampionById = async (id: string): Promise<GetLeagueChampionByIdResult> => {
  const { data, error } = await supabase
    .from("league_champion")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true, data };
};

// -- Add League Champion -- //

export const addLeagueChampion = async (payload: AddLeagueChampionPayload): Promise<AddLeagueChampionResult> => {
  const { data, error } = await supabase
    .from("league_champion")
    .insert({
      league_id: payload.leagueId,
      season_id: payload.seasonId,
      profile_id: payload.profileId,
    })
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true, data };
};

// -- Update League Champion -- //
export const updateLeagueChampion = async (payload: UpdateLeagueChampionPayload): Promise<UpdateLeagueChampionResult> => {
  const { data, error } = await supabase
    .from("league_champion")
    .update({
      profile_id: payload.profileId,
    })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true, data };
};


// -- Delete League Champion -- //
export const deleteLeagueChampion = async (id: string): Promise<RemoveLeagueChampionResult> => {
  const { error } = await supabase
    .from("league_champion")
    .delete()
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return { success: true };
};
