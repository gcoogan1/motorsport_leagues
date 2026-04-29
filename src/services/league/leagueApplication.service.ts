import { supabase } from "@/lib/supabase";
import type { AddLeagueApplicationOptionsPayload, AddLeagueApplicationOptionsResult, GetLeagueApplicationOptionsResult, UpdateLeagueApplicationOptionsPayload, UpdateLeagueApplicationOptionsResult, RemoveLeagueApplicationOptionsPayload, RemoveLeagueApplicationOptionsResult } from "@/types/league.types";

// -- Add League Application Options -- //
export const addLeagueApplicationOptions = async (
  {
    leagueId,
    openRoles,
    contactInfo,
    isClosed,
  }: AddLeagueApplicationOptionsPayload,
): Promise<AddLeagueApplicationOptionsResult> => {
  const { data, error } = await supabase
    .from("league_application_options")
    .insert({
      league_id: leagueId,
      open_roles: [...new Set(openRoles)],
      contact_info: contactInfo,
      is_closed: isClosed ?? false,
    })
    .select("id, league_id, open_roles, contact_info, is_closed")
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

// -- Get League Application Options by League ID -- //
export const getLeagueApplicationOptionsByLeagueId = async (
  leagueId: string,
): Promise<GetLeagueApplicationOptionsResult> => {
  const { data, error } = await supabase
    .from("league_application_options")
    .select("id, league_id, open_roles, contact_info, is_closed")
    .eq("league_id", leagueId)
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

// -- Update League Application Options -- //
export const updateLeagueApplicationOptions = async (
  {
    leagueId,
    openRoles,
    contactInfo,
  }: UpdateLeagueApplicationOptionsPayload,
): Promise<UpdateLeagueApplicationOptionsResult> => {
  const updateData: Record<string, unknown> = {};

  if (openRoles !== undefined) {
    updateData.open_roles = [...new Set(openRoles)];
  }

  if (contactInfo !== undefined) {
    updateData.contact_info = contactInfo;
  }

  const { data, error } = await supabase
    .from("league_application_options")
    .update(updateData)
    .eq("league_id", leagueId)
    .select("id, league_id, open_roles, contact_info, is_closed")
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

// -- Remove League Application Options -- //
export const removeLeagueApplicationOptions = async (
  { leagueId }: RemoveLeagueApplicationOptionsPayload,
): Promise<RemoveLeagueApplicationOptionsResult> => {
  const { error } = await supabase
    .from("league_application_options")
    .delete()
    .eq("league_id", leagueId);

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