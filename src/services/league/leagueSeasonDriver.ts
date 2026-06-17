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
  addedToTeam,
  displayName,
  gameType,
  avatarType,
  avatarValue,
}: CreateLeagueSeasonDriverPayload): Promise<CreateLeagueSeasonDriverResult> => {
  const { data, error } = await supabase
    .from("league_season_driver")
    .insert({
      season_id: seasonId,
      profile_id: profileId,
      display_name: displayName,
      game_type: gameType,
      avatar_type: avatarType,
      avatar_value: avatarValue,
      division_id: divisionId,
      team_id: teamId || null,
      added_to_team: teamId ? (addedToTeam ?? new Date().toISOString()) : null,
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
  addedToTeam,
}: {
  driverId: string;
  teamId: string;
  addedToTeam?: string;
}): Promise<CreateLeagueSeasonDriverResult> => {
  const { data, error } = await supabase
    .from("league_season_driver")
    .update({
      team_id: teamId,
      added_to_team: addedToTeam ?? new Date().toISOString(),
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


// -- Get League Season Driver by ID -- //
export const getLeagueSeasonDriverById = async (
  driverId: string,
): Promise<{ success: true; data: import("@/types/league.types").LeagueSeasonDriverTable } | { success: false; error: { message: string; code: string; status: number } }> => {
  const { data, error } = await supabase
    .from("league_season_driver")
    .select("*")
    .eq("id", driverId)
    .single();

  if (error || !data) {
    return {
      success: false,
      error: {
        message: error?.message ?? "Driver not found.",
        code: error?.code ?? "NOT_FOUND",
        status: 404,
      },
    };
  }

  return { success: true, data };
};

// -- Remove League Season Driver -- //
export const removeLeagueSeasonDriver = async ({
  driverId,
}: RemoveLeagueSeasonDriverPayload): Promise<RemoveLeagueSeasonDriverResult> => {
  // Block deletion if this driver has been added to any event.
  const { data: eventDriverRows, error: eventDriverCheckError } = await supabase
    .from("event_driver")
    .select("id")
    .eq("season_driver_id", driverId)
    .limit(1);

  if (eventDriverCheckError) {
    return {
      success: false,
      error: {
        message: eventDriverCheckError.message,
        code: eventDriverCheckError.code || "SERVER_ERROR",
        status: 500,
      },
    };
  }

  if (eventDriverRows && eventDriverRows.length > 0) {
    return {
      success: false,
      error: {
        message: "This driver has been added to an event and cannot be removed.",
        code: "DRIVER_IN_EVENT",
        status: 409,
      },
    };
  }

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