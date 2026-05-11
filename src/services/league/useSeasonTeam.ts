import { supabase } from "@/lib/supabase";
import type {
  CreateLeagueSeasonTeamPayload,
  CreateLeagueSeasonTeamResult,
  GetLeagueSeasonTeamsResult,
  RemoveLeagueSeasonTeamPayload,
  RemoveLeagueSeasonTeamResult,
  UpdateLeagueSeasonTeamPayload,
  UpdateLeagueSeasonTeamResult,
} from "@/types/league.types";

// --- League Season Team (per division) Service --- //

// -- Create League Season Team -- //
export const createLeagueSeasonTeam = async ({
  seasonId,
  divisionId,
  teamName,
}: CreateLeagueSeasonTeamPayload): Promise<CreateLeagueSeasonTeamResult> => {
  const { data, error } = await supabase
    .from("league_season_team")
    .insert({
      season_id: seasonId,
      division_id: divisionId,
      team_name: teamName,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: {
        message: error?.message || "Failed to create team in division.",
        code: error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};

// -- Update League Season Team (name) -- //
export const updateLeagueSeasonTeam = async ({
  teamId,
  teamName,
}: UpdateLeagueSeasonTeamPayload): Promise<UpdateLeagueSeasonTeamResult> => {
  const { data, error } = await supabase
    .from("league_season_team")
    .update({
      team_name: teamName,
    })
    .eq("id", teamId)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: {
        message: error?.message || "Failed to update team name.",
        code: error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data,
  };
};

// -- Get League Season Teams for a Division -- //
export const getLeagueSeasonTeamsByDivision = async ({
  divisionId,
  signal,
}: {
  divisionId: string;
  signal?: AbortSignal;
}): Promise<GetLeagueSeasonTeamsResult> => {
  let query = supabase
    .from("league_season_team")
    .select("*")
    .eq("division_id", divisionId)
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

// -- Get League Season Teams for a Season Id-- //
export const getLeagueSeasonTeamsBySeasonId = async ({
  seasonId,
  signal,
}: {
  seasonId: string;
  signal?: AbortSignal;
}): Promise<GetLeagueSeasonTeamsResult> => {
  let query = supabase
    .from("league_season_team")
    .select("*")
    .eq("season_id", seasonId)
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

// -- Remove League Season Team -- //
export const removeLeagueSeasonTeam = async ({
  teamId,
}: RemoveLeagueSeasonTeamPayload): Promise<RemoveLeagueSeasonTeamResult> => {
  const { error } = await supabase
    .from("league_season_team")
    .delete()
    .eq("id", teamId);

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
  };
};
