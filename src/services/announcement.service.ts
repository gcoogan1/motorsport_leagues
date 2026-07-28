// --- Announcement Service --- //

import { supabase } from "@/lib/supabase";
import { resolveAvatarValue } from "@/services/profile/profile.service";
import { getParticipantTagsByLeagueAndProfile } from "@/services/shared/tags.service";
import type { Announcement, CreateAnnouncementPayload, GetAnnouncementByIdPayload, GetAnnouncementByIdResponse, GetAnnouncementsByIdResponse, GetAnnouncementsByLeagueIdPayload, GetAnnouncementsBySeasonIdPayload, UpdateAnnouncementPayload } from "@/types/announcements";

const enrichAnnouncementWithDirector = async (
  announcement: Record<string, unknown>,
): Promise<Announcement> => {
  const directorId = announcement.league_director_id as string | undefined;
  const leagueId = announcement.league_id as string | undefined;

  if (!directorId || !leagueId) {
    return announcement as Announcement;
  }

  // Get the participant record to find the profile_id
  const { data: participantData } = await supabase
    .from("league_participants")
    .select("profile_id")
    .eq("id", directorId)
    .eq("league_id", leagueId)
    .maybeSingle();

    console.log("participantData", participantData);

  if (!participantData?.profile_id) {
    return announcement as Announcement;
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("username, avatar_type, avatar_value, id")
    .eq("id", participantData.profile_id)
    .maybeSingle();

    console.log("profileData", profileData);

  if (!profileData) {
    return announcement as Announcement;
  }

  const tags = await getParticipantTagsByLeagueAndProfile(leagueId, profileData.id);
  const avatarValue = resolveAvatarValue(
    (profileData.avatar_type as "preset" | "upload") || "preset",
    profileData.avatar_value || "black",
  );

  return {
    ...announcement,
    league_director: {
      username: profileData.username || "Unknown",
      avatarType: profileData.avatar_type || "preset",
      avatarValue,
      tags,
    },
  } as Announcement;
};

// -- Get Announcement by ID -- //
export const getAnnouncementById = async (
  { announcementId }: GetAnnouncementByIdPayload,
): Promise<GetAnnouncementByIdResponse> => {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", announcementId)
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

  const enrichedAnnouncement = await enrichAnnouncementWithDirector(data);

  return {
    success: true,
    data: enrichedAnnouncement,
  };
};

// -- Get Announcements by League ID -- //
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

  const enrichedAnnouncements = await Promise.all(
    (data ?? []).map((announcement) =>
      enrichAnnouncementWithDirector(announcement),
    ),
  );

  return {
    success: true,
    data: enrichedAnnouncements,
  };
};

// -- Get Announcements by Season ID -- //
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

  const enrichedAnnouncements = await Promise.all(
    (data ?? []).map((announcement) =>
      enrichAnnouncementWithDirector(announcement),
    ),
  );

  return {
    success: true,
    data: enrichedAnnouncements,
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

  const enrichedAnnouncement = await enrichAnnouncementWithDirector(data);

  return {
    success: true,
    data: enrichedAnnouncement,
  };
};

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

  const enrichedAnnouncement = await enrichAnnouncementWithDirector(data);

  return {
    success: true,
    data: enrichedAnnouncement,
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
