// --- Announcement Service --- //

import { supabase } from "@/lib/supabase";
import type { Announcement, CreateAnnouncementPayload, GetAnnouncementByIdPayload, GetAnnouncementByIdResponse, GetAnnouncementsByIdResponse, GetAnnouncementsByLeagueIdPayload, GetAnnouncementsBySeasonIdPayload, UpdateAnnouncementPayload } from "@/types/announcements";

// -- Get Annoucement by ID -- //
export const getAnnouncementById = async (
  { announcementId }: GetAnnouncementByIdPayload,
): Promise<GetAnnouncementByIdResponse> => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", announcementId)
    .order("created_at", { ascending: false });

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
    data: (data ?? [])[0] as Announcement,
  };
};

// -- Get Annoucements by League ID -- //
export const getAnnouncementsByLeagueId = async (
  { leagueId }: GetAnnouncementsByLeagueIdPayload,
): Promise<GetAnnouncementsByIdResponse> => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("league_id", leagueId)
    .order("created_at", { ascending: false });

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
    data: data ?? [] as Announcement[],
  };
};

// -- Get Annoucements by Season ID -- //
export const getAnnouncementsBySeasonId = async (
  { seasonId }: GetAnnouncementsBySeasonIdPayload,
): Promise<GetAnnouncementsByIdResponse> => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("season_id", seasonId)
    .order("created_at", { ascending: false });

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
    data: data ?? [] as Announcement[],
  };
};

// -- Create Announcement -- //
export const createAnnouncement = async (
  { title, message, leagueId, seasonId, seasonName, leagueDirectorId }: CreateAnnouncementPayload,
): Promise<GetAnnouncementByIdResponse> => {
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      title,
      message,
      league_id: leagueId,
      season_id: seasonId,
      season_name: seasonName,
      league_director_id: leagueDirectorId,
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

  return {
    success: true,
    data: data as Announcement,
  };
}

// -- Update Announcement -- //
export const updateAnnouncement = async (
  { announcementId, title, message }: UpdateAnnouncementPayload,
): Promise<GetAnnouncementByIdResponse> => {
  const { data, error } = await supabase
    .from("announcements")
    .update({
      title,
      message,
    })
    .eq("id", announcementId)
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

  return {
    success: true,
    data: data as Announcement,
  };
};

// -- Delete Announcement -- //
export const deleteAnnouncement = async (
  { announcementId }: GetAnnouncementByIdPayload,
): Promise<{ success: true } | { success: false; error: { message: string; code: string; status: number } }> => {
  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", announcementId);

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
