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
import { createLeagueSeasonDivision } from "./leagueSeasonDivision.service";

// --- League Season Service --- //

// -- Create League Season -- //
export const createLeagueSeason = async ({
  leagueId,
  seasonName,
  numOfDivisions,
  isTeamChampionship,
}: CreateLeagueSeasonPayload): Promise<CreateLeagueSeasonResult> => {

  // Create season 
  const { data: season, error: seasonError } = await supabase
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

  if (seasonError || !season) {
    return {
      success: false,
      error: {
        message: seasonError?.message || "Failed to create season.",
        code: seasonError?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  // Create divisions for the season
  const divisionResults = await Promise.all(
    Array.from({ length: numOfDivisions }, (_, index) =>
      createLeagueSeasonDivision({
        seasonId: season.id,
        divisionNumber: index + 1,
        divisionName: `Division ${index + 1}`,
      }),
    ),
  );

  //  Check for division creation failures 
  const failedDivision = divisionResults.find(
    (result) => !result.success,
  );

  // Rollback season if ANY division fails
  if (failedDivision) {
    await supabase
      .from("league_season")
      .delete()
      .eq("id", season.id);

    return {
      success: false,
      error: {
        message:
          failedDivision.error?.message ||
          "Failed to create season divisions. Season creation rolled back.",
        code: failedDivision.error?.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  return {
    success: true,
    data: season,
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
// Note: Only season name and status can be updated. Number of divisions and team championship status are fixed upon season creation.
export const updateLeagueSeason = async (
  {
    seasonId,
    seasonName,
    seasonStatus,
  }: UpdateLeagueSeasonPayload,
): Promise<UpdateLeagueSeasonResult> => {
  const { data, error } = await supabase
    .from("league_season")
    .update({
      season_name: seasonName,
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
