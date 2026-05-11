import { supabase } from "@/lib/supabase";
import type {
  CreateLeagueSeasonDriverPayload,
  CreateLeagueSeasonDriverResult,
  GetLeagueSeasonDriversResult,
  RemoveLeagueSeasonDriverPayload,
  RemoveLeagueSeasonDriverResult,
} from "@/types/league.types";

// -- League Season Driver (per division) Service -- //

// -- Create League Season Driver -- //
export const createLeagueSeasonDriver = async ({
  seasonId,
  profileId,
  divisionId,
  teamId,
}: CreateLeagueSeasonDriverPayload): Promise<CreateLeagueSeasonDriverResult> => {
  const { data, error } = await supabase
    .from("league_season_driver")
    .insert({
      season_id: seasonId,
      profile_id: profileId,
      division_id: divisionId,
      team_id: teamId || null,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: {
        message: error?.message || "Failed to add driver to division.",
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

// -- Update League Season Driver Team -- //
// Driver should only be updated to add/change team affiliation. 
export const updateLeagueSeasonDriverTeam = async ({
  driverId,
  teamId,
}: {
  driverId: string;
  teamId: string;
}): Promise<CreateLeagueSeasonDriverResult> => {
  const { data, error } = await supabase
    .from("league_season_driver")
    .update({
      team_id: teamId,
    })
    .eq("id", driverId)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      error: {
        message: error?.message || "Failed to update driver's team.",
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

// -- Get League Season Drivers by Division -- //
export const getLeagueSeasonDriversByDivision = async ({
  divisionId,
  signal,
}: {
  divisionId: string;
  signal?: AbortSignal;
}): Promise<GetLeagueSeasonDriversResult> => {
  let query = supabase
    .from("league_season_driver")
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

// -- Get League Season Drivers by Season Id -- //
export const getLeagueSeasonDriversBySeasonId = async ({
  seasonId,
  signal,
}: {
  seasonId: string;
  signal?: AbortSignal;
}): Promise<GetLeagueSeasonDriversResult> => {
  let query = supabase
    .from("league_season_driver")
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


// -- Remove League Season Driver -- //
export const removeLeagueSeasonDriver = async ({
  driverId,
}: RemoveLeagueSeasonDriverPayload): Promise<RemoveLeagueSeasonDriverResult> => {
  const { error } = await supabase
    .from("league_season_driver")
    .delete()
    .eq("id", driverId);

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