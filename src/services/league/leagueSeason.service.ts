import { supabase } from "@/lib/supabase";
import type {
  CreateLeagueSeasonPayload,
  CreateLeagueSeasonResult,
  GetLeagueSeasonsResult,
  RemoveLeagueSeasonPayload,
  RemoveLeagueSeasonResult,
  UpdateLeagueSeasonPayload,
  UpdateLeagueSeasonResult,
} from "@/types/league.types";

// --- League Season Service --- //

// -- Create League Season -- //
export const createLeagueSeason = async (
  {
    leagueId,
    seasonName,
    numOfDivisions,
    isTeamChampionship,
  }: CreateLeagueSeasonPayload,
): Promise<CreateLeagueSeasonResult> => {
  const { data, error } = await supabase
    .from("league_season")
    .insert({
      league_id: leagueId,
      season_name: seasonName,
      num_of_divisions: numOfDivisions,
      is_team_championship: isTeamChampionship,
      season_status: "setup",
    })
    .select()
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

  return {
    success: true,
    data,
  };
};

// -- Get League Seasons by League ID -- //
export const getLeagueSeasonsByLeagueId = async (
  leagueId: string,
  signal?: AbortSignal,
): Promise<GetLeagueSeasonsResult> => {
  let query = supabase
    .from("league_season")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: true });

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

  if (error) {
    if (error.code === "ABORT" || error.message?.includes("abort")) {
      return { success: true, data: [] };
    }

    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};

// -- Update League Season -- //
export const updateLeagueSeason = async (
  {
    seasonId,
    seasonName,
    numOfDivisions,
    isTeamChampionship,
    seasonStatus,
  }: UpdateLeagueSeasonPayload,
): Promise<UpdateLeagueSeasonResult> => {
  const { data, error } = await supabase
    .from("league_season")
    .update({
      season_name: seasonName,
      num_of_divisions: numOfDivisions,
      is_team_championship: isTeamChampionship,
      season_status: seasonStatus,
    })
    .eq("id", seasonId)
    .select()
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

  return {
    success: true,
    data,
  };
};

// -- Remove League Season -- //
export const removeLeagueSeason = async (
  { seasonId }: RemoveLeagueSeasonPayload,
  signal?: AbortSignal,
): Promise<RemoveLeagueSeasonResult> => {
  let query = supabase.from("league_season").delete().eq("id", seasonId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { error } = await query;

  if (error) {
    if (error.code === "ABORT" || error.message?.includes("abort")) {
      return { success: true };
    }

    return {
      success: false,
      error: {
        message: error.message,
        code: error.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
  };
};
