

// --- League Season Division Service --- //

import { supabase } from "@/lib/supabase";
import type {
  GetLeagueSeasonDivisionByIdResult,
  GetLeagueSeasonDivisionsResult,
  LeagueSeasonDivisionTable,
  RemoveLeagueSeasonDivisionPayload,
  RemoveLeagueSeasonDivisionResult,
} from "@/types/league.types";

// -- Create League Season Division -- //
// (Handled in leagueSeason.service.ts when creating season - creates divisions based on num_of_divisions)
export const createLeagueSeasonDivision = async ({
  seasonId,
  divisionNumber,
  divisionName,
}: {
  seasonId: string;
  divisionNumber: number;
  divisionName: string;
}) => {
  const { data, error } = await supabase
    .from("league_season_division")
    .insert({
      season_id: seasonId,
      division_number: divisionNumber,
      division_name: divisionName,
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

// -- Get League Season Divisions by Season ID -- //
export const getLeagueSeasonDivisionsBySeasonId = async (
  seasonId: string,
  signal?: AbortSignal,
): Promise<GetLeagueSeasonDivisionsResult> => {
  let query = supabase
    .from("league_season_division")
    .select("*")
    .eq("season_id", seasonId);

  if (signal) {
    query = query.abortSignal(signal);
  }

  const { data, error } = await query;

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
    data: data as LeagueSeasonDivisionTable[],
  };
};

// -- Get League Season Division by Division ID -- //
export const getLeagueSeasonDivisionByDivisionId = async (
  divisionId: string,
): Promise<GetLeagueSeasonDivisionByIdResult> => {
  const { data, error } = await supabase
    .from("league_season_division")
    .select("*")
    .eq("id", divisionId)
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
    data: data as LeagueSeasonDivisionTable,
  };
};

// -- Remove League Season Division by Division ID -- //
export const removeLeagueSeasonDivisionByDivisionId = async ({
  divisionId,
}: RemoveLeagueSeasonDivisionPayload): Promise<RemoveLeagueSeasonDivisionResult> => {
  const { error } = await supabase
    .from("league_season_division")
    .delete()
    .eq("id", divisionId);

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
